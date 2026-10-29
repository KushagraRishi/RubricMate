import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { ExtractSchema, CheckSchema } from './schema.js';
import type { Criterion, ChatMessage } from '../../src/app/lib/types.js';
import { LIMITS } from './limits.js';

/**
 * One model per route, because the three jobs are not the same job.
 *
 * Measured on the sample rubric and essay, all three models pulled out the
 * same five criteria with the same weights and the same measurable rules, and
 * answered chat questions equally well -- so those two routes run on Haiku.
 *
 * Checking a draft is the one that needs judgement. The sample essay ends
 * without a conclusion on purpose; Opus and Sonnet both caught it, Haiku
 * called the structure done. Sonnet matches Opus on the call that matters at
 * a quarter of the price, so it marks the drafts.
 *
 * Each is overridable, so the mix can be retuned from Vercel's environment
 * variables without a deploy.
 */
const EXTRACT_MODEL = process.env.EXTRACT_MODEL ?? 'claude-haiku-5-5';
const CHECK_MODEL = process.env.CHECK_MODEL ?? 'claude-sonnet-5-5';
const CHAT_MODEL = process.env.CHAT_MODEL ?? 'claude-haiku-5-5';

type Effort = 'low' | 'medium' | 'high';
const EXTRACT_EFFORT = (process.env.EXTRACT_EFFORT ?? 'low') as Effort;
const CHECK_EFFORT = (process.env.CHECK_EFFORT ?? 'medium') as Effort;
const CHAT_EFFORT = (process.env.CHAT_EFFORT ?? 'low') as Effort;

/**
 * Haiku takes `disabled`; Sonnet 5.5 rejects it and wants `between_tools`
 * instead. Both are only accepted at effort `high` or below, which every
 * route here is.
 */
const noThinking = (model: string) =>
  model.includes('sonnet')
    ? ({ type: 'between_tools' } as const)
    : ({ type: 'disabled' } as const);

/**
 * Off for extraction: measured over repeated runs it halved the output tokens
 * and made the criteria list *more* consistent, because pulling fields out of
 * a document is not a reasoning problem.
 *
 * On for checking and chat: measured at the same price either way, and on the
 * route that has to notice a missing conclusion, reasoning is a free safety
 * margin on inputs harder than the sample.
 */
const EXTRACT_THINKING = (process.env.EXTRACT_THINKING ?? 'off') === 'off';
const CHECK_THINKING = (process.env.CHECK_THINKING ?? 'on') === 'off';
const CHAT_THINKING = (process.env.CHAT_THINKING ?? 'on') === 'off';

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new ConfigError('The server is missing its ANTHROPIC_API_KEY.');
    }
    client = new Anthropic();
  }
  return client;
}

class ConfigError extends Error {}
export class BadInput extends Error {}

/** Per-million-token prices, for the cost line in the log. */
const PRICES: Record<string, { in: number; out: number }> = {
  'claude-opus-5-5': { in: 4, out: 20 },
  'claude-sonnet-5-5': { in: 2, out: 10 },
  'claude-haiku-5-5': { in: 0.1, out: 0.5 },
};

/**
 * One line per call saying what it cost. On a public demo paid for out of one
 * pocket, that number should be visible in the logs rather than discovered on
 * a bill.
 */
function logUsage(route: string, model: string, usage: Anthropic.Usage) {
  const price = PRICES[model];
  const write = usage.cache_creation_input_tokens ?? 0;
  const read = usage.cache_read_input_tokens ?? 0;

  // Cache writes bill at 1.25x input, reads at 0.1x. Counting them as free
  // would make every cached call look cheaper than it is.
  const cents = price
    ? ((usage.input_tokens * price.in +
        write * price.in * 1.25 +
        read * price.in * 0.1 +
        usage.output_tokens * price.out) /
        1_000_000) *
      100
    : 0;

  const cache = write || read ? ` cacheW=${write} cacheR=${read}` : '';
  console.log(
    `[rubricmate] ${route} model=${model} in=${usage.input_tokens} out=${usage.output_tokens}${cache} cost=${cents.toFixed(3)}c`,
  );
}

export interface HandlerResult {
  status: number;
  body: unknown;
}

/**
 * Every user-facing string here is written to be read by a student in a
 * 360px sidebar: short sentences, plain words, no jargon.
 */
const VOICE = `Write for a student, not a teacher. Use short sentences and plain
words a 12-year-old would know. Never use the words "utilize", "leverage",
"robust" or "comprehensive". Do not greet, apologise, or explain what you are
about to do. Say the thing itself.`;

const EXTRACT_SYSTEM = `You turn an assignment rubric into a checklist a student can work through.

Read the rubric and pull out every separate thing the student is graded on.

Rules:
- One criterion per thing that is graded. Split anything that bundles two
  separate requirements.
- "name" is a label for a narrow sidebar: at most 4 words, no trailing period.
- "description" is one short line saying what a good answer looks like. At most
  12 words.
- "weight" is the share of the grade, 0-100. If the rubric gives points or
  percentages, use them. If it gives nothing, spread the weight evenly. The
  weights should add up to about 100.
- "id" is a short lowercase slug, like "thesis" or "word-count". Unique.
- "measurable" is for rules that can be counted exactly rather than judged:
  a minimum or maximum word count, or a minimum number of citations. Set it to
  null for anything that needs judgement.
- Length is always one criterion, never two. A range like "1000-1500 words" is a
  single criterion with a min_words of 1000.
- Return between 3 and 8 criteria. If the rubric has more, merge the smallest
  ones together.
- If the text is clearly not a rubric, return an empty criteria list and put a
  short plain-English sentence in "problem" saying what you got instead.

${VOICE}`;

const CHECK_SYSTEM = `You check a student's draft against a rubric checklist and say where they stand.

For every criterion you are given, return one result.

Rules:
- "status" is "done" when the draft clearly meets it, "in_progress" when it is
  partly there, and "missing" when there is nothing for it yet.
- "score" is 0 to 10. Be a fair marker, not a harsh or a soft one. A draft that
  fully meets a criterion scores 9 or 10. Half-done work scores around 5.
  Nothing at all scores 0 or 1.
- "feedback" is one or two short sentences written straight to the student. Say
  what is there and what to do next. At most 30 words.
- "evidence" is a short quote from the draft, under 15 words, that shows why you
  scored it that way. Use null when the draft has nothing to quote.
- "id" must be copied exactly from the criterion you are answering.
- "suggestion" is the single most useful next action across the whole draft. One
  sentence, at most 20 words. Pick the one that gains the most marks.

Judge only what is in the draft. Do not invent sources or sections that are not
there. An empty or near-empty draft gets "missing" on everything.

${VOICE}`;

const CHAT_SYSTEM = `You are RubricMate's helper. A student is writing an assignment and has a question.

You are given their rubric checklist and their draft. Answer using them.

Rules:
- Answer in at most 50 words. Two or three short sentences.
- Plain sentences only. No markdown, no asterisks, no bullet points, no
  headings. The answer is rendered as plain text, so a "*" shows up as a "*".
- If they ask what something on the rubric means, explain it in plain words and
  give one concrete example.
- If they ask how they are doing, point at their actual draft.
- Never write the assignment for them. You can explain, show the shape of a
  paragraph, or give an example on a different topic. Do not hand them sentences
  to paste in.
- If the answer is not in the rubric or the draft, say so in one line.

${VOICE}`;

function clean(value: unknown, max: number, field: string): string {
  if (typeof value !== 'string') throw new BadInput(`${field} is missing.`);
  const text = value.trim();
  if (!text) throw new BadInput(`${field} is empty.`);
  if (text.length > max) {
    throw new BadInput(
      `${field} is too long for this demo. The limit is ${max.toLocaleString()} characters and this is ${text.length.toLocaleString()}.`,
    );
  }
  return text;
}

export async function handleExtract(body: any): Promise<HandlerResult> {
  const rubric = clean(body?.rubric, LIMITS.rubricChars, 'The rubric');

  const response = await getClient().messages.parse({
    model: EXTRACT_MODEL,
    max_tokens: 4000,
    // Pulling fields out of a document is a reading task, not a reasoning one.
    output_config: { effort: EXTRACT_EFFORT, format: zodOutputFormat(ExtractSchema) },
    ...(EXTRACT_THINKING ? { thinking: noThinking(EXTRACT_MODEL) } : {}),
    system: [{ type: 'text', text: EXTRACT_SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: `Here is the rubric:\n\n${rubric}` }],
  });

  logUsage('extract', EXTRACT_MODEL, response.usage);

  const parsed = response.parsed_output;
  if (!parsed) throw new Error('The model did not return a usable checklist.');

  if (parsed.problem && parsed.criteria.length === 0) {
    return { status: 422, body: { error: parsed.problem } };
  }

  // `null` is what the schema needs on the wire; `undefined` is what the UI wants.
  const criteria: Criterion[] = parsed.criteria.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    weight: c.weight,
    ...(c.measurable ? { measurable: c.measurable } : {}),
  }));

  return { status: 200, body: { criteria } };
}

export async function handleCheck(body: any): Promise<HandlerResult> {
  const draft = clean(body?.draft, LIMITS.draftChars, 'The draft');
  const criteria = body?.criteria;
  if (!Array.isArray(criteria) || criteria.length === 0) {
    throw new BadInput('No checklist was sent with the draft.');
  }

  const checklist = (criteria as Criterion[])
    .map((c) => `- id: ${c.id} | ${c.name}: ${c.description} (worth ${c.weight}%)`)
    .join('\n');

  const response = await getClient().messages.parse({
    model: CHECK_MODEL,
    max_tokens: 6000,
    output_config: { effort: CHECK_EFFORT, format: zodOutputFormat(CheckSchema) },
    ...(CHECK_THINKING ? { thinking: noThinking(CHECK_MODEL) } : {}),
    system: [{ type: 'text', text: CHECK_SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [
      {
        role: 'user',
        content: `The checklist:\n${checklist}\n\nThe student's draft:\n"""\n${draft}\n"""`,
      },
    ],
  });

  logUsage('check', CHECK_MODEL, response.usage);

  const parsed = response.parsed_output;
  if (!parsed) throw new Error('The model did not return a usable result.');

  // Guard against a result for a criterion we never asked about.
  const known = new Set((criteria as Criterion[]).map((c) => c.id));
  const results = parsed.results
    .filter((r) => known.has(r.id))
    .map((r) => ({
      id: r.id,
      status: r.status,
      score: Math.max(0, Math.min(10, r.score)),
      feedback: r.feedback,
      ...(r.evidence ? { evidence: r.evidence } : {}),
    }));

  return { status: 200, body: { results, suggestion: parsed.suggestion } };
}

export async function handleChat(body: any): Promise<HandlerResult> {
  const question = clean(body?.question, LIMITS.questionChars, 'The question');
  const criteria = Array.isArray(body?.criteria) ? (body.criteria as Criterion[]) : [];
  const draft = typeof body?.draft === 'string' ? body.draft.slice(0, LIMITS.draftChars) : '';
  const history = Array.isArray(body?.history)
    ? (body.history as ChatMessage[]).slice(-LIMITS.historyTurns)
    : [];

  const checklist = criteria.length
    ? criteria.map((c) => `- ${c.name}: ${c.description}`).join('\n')
    : '(they have not loaded a rubric yet)';

  const context = `Their checklist:\n${checklist}\n\nTheir draft so far:\n"""\n${
    draft || '(empty)'
  }\n"""`;

  const response = await getClient().messages.create({
    model: CHAT_MODEL,
    max_tokens: 1200,
    output_config: { effort: CHAT_EFFORT },
    ...(CHAT_THINKING ? { thinking: noThinking(CHAT_MODEL) } : {}),
    system: [
      // Fixed instructions, cached. Everything volatile sits after this
      // breakpoint, which is the whole reason the two are separate blocks.
      { type: 'text', text: CHAT_SYSTEM, cache_control: { type: 'ephemeral' } },
      { type: 'text', text: context },
    ],
    messages: [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: question },
    ],
  });

  logUsage('chat', CHAT_MODEL, response.usage);

  if (response.stop_reason === 'refusal') {
    return { status: 200, body: { answer: "I can't help with that one. Try asking about your rubric or your draft." } };
  }

  const answer = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();

  return { status: 200, body: { answer: answer || 'I did not catch that. Try asking again.' } };
}

/** Turns anything thrown above into a response a person can read. */
export function toErrorResult(err: unknown): HandlerResult {
  if (err instanceof BadInput) return { status: 400, body: { error: err.message } };
  if (err instanceof ConfigError) return { status: 500, body: { error: err.message } };

  if (err instanceof Anthropic.AuthenticationError) {
    return { status: 500, body: { error: 'The server rejected its own API key.' } };
  }
  if (err instanceof Anthropic.RateLimitError) {
    return { status: 429, body: { error: 'The demo is busy right now. Try again in a minute.' } };
  }
  if (err instanceof Anthropic.APIError) {
    return { status: 502, body: { error: 'The model could not be reached. Try again in a moment.' } };
  }

  console.error('[rubricmate]', err);
  return { status: 500, body: { error: 'Something went wrong. Try again.' } };
}
