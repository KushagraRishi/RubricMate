import { z } from 'zod';

/**
 * Zod is the single source of truth for everything the model returns.
 * `zodOutputFormat` turns these into the structured-output schema the API
 * enforces, so a malformed response is impossible rather than merely unlikely.
 */

export const MeasurableSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('min_words'), value: z.number() }),
  z.object({ kind: z.literal('max_words'), value: z.number() }),
  z.object({ kind: z.literal('min_citations'), value: z.number() }),
]);

export const CriterionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  weight: z.number(),
  measurable: z.nullable(MeasurableSchema),
});

export const ExtractSchema = z.object({
  /** Empty when the text given was not a rubric at all. */
  criteria: z.array(CriterionSchema),
  /** Set when the text could not be read as a rubric, so the UI can say why. */
  problem: z.nullable(z.string()),
});

export const CriterionResultSchema = z.object({
  id: z.string(),
  status: z.enum(['done', 'in_progress', 'missing']),
  score: z.number(),
  feedback: z.string(),
  evidence: z.nullable(z.string()),
});

export const CheckSchema = z.object({
  results: z.array(CriterionResultSchema),
  suggestion: z.string(),
});
