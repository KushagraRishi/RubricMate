import { motion } from 'motion/react';
import {
  Zap, Coins, ShieldCheck, LifeBuoy, FileInput, FileText, ListTree, Hash, PenLine,
  Send, BadgeCheck, LayoutList, Layers, Braces, Gauge, Check, Plus,
} from 'lucide-react';
import { Group, item, INK, MUTED, BLUE, EASE } from './CaseStudy';

/**
 * The visual half of the write-up. Each block says one thing in a picture,
 * with a line of text to anchor it. A reader who only looks should still
 * come away with the point.
 */

const GREEN = '#34A853';
const PURPLE = '#8430ce';
const AMBER = '#b06000';

/* ------------------------------------------------------------------ numbers */

const NUMBERS = [
  { n: '80%', label: 'cheaper per session' },
  { n: '3', label: 'serverless functions' },
  { n: '0', label: 'databases' },
  { n: '40', label: 'requests an hour, per visitor' },
];

export function NumberStrip() {
  return (
    <Group className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {NUMBERS.map(({ n, label }) => (
        <motion.div
          key={label}
          variants={item}
          className="rounded-2xl border border-gray-200 bg-white px-4 py-5 text-center"
        >
          <p className="text-4xl leading-none tabular-nums mb-2" style={{ color: BLUE }}>{n}</p>
          <p className="text-xs" style={{ color: MUTED }}>{label}</p>
        </motion.div>
      ))}
    </Group>
  );
}

/* --------------------------------------------------------------------- why */

const WHY = [
  { icon: Zap, label: 'Fast', body: 'Counts answer on the keystroke.', color: BLUE },
  { icon: Coins, label: 'Cheap', body: 'The AI only reads what it must.', color: GREEN },
  { icon: ShieldCheck, label: 'Safe', body: 'The key never reaches the browser.', color: PURPLE },
  { icon: LifeBuoy, label: 'Steady', body: 'A slow reply never freezes the counts.', color: AMBER },
];

export function WhyTiles() {
  return (
    <Group className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {WHY.map(({ icon: Icon, label, body, color }) => (
        <motion.div key={label} variants={item} className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}14` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <p className="text-sm mb-1" style={{ color: INK }}>{label}</p>
          <p className="text-xs leading-relaxed" style={{ color: MUTED }}>{body}</p>
        </motion.div>
      ))}
    </Group>
  );
}

/* ---------------------------------------------------------------- decisions */

function DecisionCard({
  n, title, line, children,
}: { n: string; title: string; line: string; children: React.ReactNode }) {
  return (
    <motion.div variants={item} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="p-5 pb-4">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-2xl tabular-nums leading-none" style={{ color: BLUE }}>{n}</span>
          <p style={{ color: INK }}>{title}</p>
        </div>
        <p className="text-sm" style={{ color: MUTED }}>{line}</p>
      </div>
      <div className="bg-[#fafbfc] border-t border-gray-100 p-5">{children}</div>
    </motion.div>
  );
}

function Tag({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px]" style={{ color, background: bg }}>
      {children}
    </span>
  );
}

export function DecisionCards() {
  return (
    <Group className="space-y-4">
      <DecisionCard n="01" title="Do not send everything to the AI" line="Counting is arithmetic. Only meaning needs a model.">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-blue-100 bg-white p-3">
            <p className="text-[11px] mb-2" style={{ color: BLUE }}>In your browser</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: INK }}><Hash className="w-3 h-3" style={{ color: MUTED }} />1,040 words</div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: INK }}><Hash className="w-3 h-3" style={{ color: MUTED }} />4 sources</div>
            </div>
            <div className="mt-3"><Tag color={GREEN} bg="#34A8531a"><Zap className="w-3 h-3" />instant</Tag></div>
          </div>
          <div className="rounded-xl border border-purple-100 bg-white p-3">
            <p className="text-[11px] mb-2" style={{ color: PURPLE }}>Read by AI</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: INK }}><PenLine className="w-3 h-3" style={{ color: MUTED }} />Is the aim clear?</div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: INK }}><PenLine className="w-3 h-3" style={{ color: MUTED }} />Is there a conclusion?</div>
            </div>
            <div className="mt-3"><Tag color={MUTED} bg="#f1f3f4">a few seconds</Tag></div>
          </div>
        </div>
      </DecisionCard>

      <DecisionCard n="02" title="A different model for each job" line="Copying a rubric is easy. Marking a draft is not.">
        <div className="space-y-2">
          {[
            { route: '/api/extract', model: 'Haiku 5.5', price: '$0.10', w: 5, color: '#8ab4f8' },
            { route: '/api/check', model: 'Sonnet 5.5', price: '$2.00', w: 100, color: BLUE },
            { route: '/api/chat', model: 'Haiku 5.5', price: '$0.10', w: 5, color: '#8ab4f8' },
          ].map((r) => (
            <div key={r.route} className="flex items-center gap-3">
              <code className="text-[11px] w-[84px] shrink-0" style={{ color: MUTED }}>{r.route}</code>
              <div className="flex-1 h-5 rounded-md bg-white border border-gray-100 overflow-hidden">
                <div className="h-full rounded-md" style={{ width: `${r.w}%`, background: r.color, minWidth: 6 }} />
              </div>
              <span className="text-[11px] w-[84px] shrink-0 text-right" style={{ color: INK }}>{r.model}</span>
            </div>
          ))}
          <p className="text-[11px] pt-1" style={{ color: MUTED }}>Bar length is price per million input tokens.</p>
        </div>
      </DecisionCard>

      <DecisionCard n="03" title="Make the reply a shape, not a paragraph" line="One schema checks it and types the screen.">
        <div className="rounded-xl bg-[#202124] p-4 text-[12px] leading-[1.9] font-mono overflow-x-auto" style={{ color: '#e8eaed' }}>
          <div><span style={{ color: '#8ab4f8' }}>id</span>: string</div>
          <div>
            <span style={{ color: '#8ab4f8' }}>status</span>:{' '}
            <span className="rounded px-1.5" style={{ background: '#34A85333', color: '#81c995' }}>done</span>{' '}
            <span className="rounded px-1.5" style={{ background: '#4285F433', color: '#8ab4f8' }}>in_progress</span>{' '}
            <span className="rounded px-1.5" style={{ background: '#ea433533', color: '#f28b82' }}>missing</span>
          </div>
          <div><span style={{ color: '#8ab4f8' }}>score</span>: number</div>
          <div><span style={{ color: '#8ab4f8' }}>feedback</span>: string</div>
          <div><span style={{ color: '#8ab4f8' }}>evidence</span>: string | null</div>
        </div>
      </DecisionCard>
    </Group>
  );
}

/* --------------------------------------------------------------------- flow */

const FLOW = [
  { icon: FileInput, label: 'Drop a rubric', lane: 'browser' },
  { icon: FileText, label: 'Becomes text', lane: 'browser' },
  { icon: ListTree, label: 'Becomes criteria', lane: 'model' },
  { icon: Hash, label: 'Counts split out', lane: 'browser' },
  { icon: PenLine, label: 'You write', lane: 'browser' },
  { icon: Send, label: 'Check sent up', lane: 'server' },
  { icon: BadgeCheck, label: 'Reply validated', lane: 'server' },
  { icon: LayoutList, label: 'Checklist updates', lane: 'browser' },
] as const;

const LANE = {
  browser: { name: 'Browser', color: BLUE, bg: '#e8f0fe' },
  server: { name: 'Server', color: MUTED, bg: '#f1f3f4' },
  model: { name: 'AI model', color: PURPLE, bg: '#f3e8fd' },
} as const;

export function FlowGrid() {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {Object.values(LANE).map((l) => (
          <span key={l.name} className="inline-flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
            {l.name}
          </span>
        ))}
      </div>
      <Group className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FLOW.map(({ icon: Icon, label, lane }, i) => (
          <motion.div
            key={label}
            variants={item}
            className="relative rounded-2xl border border-gray-200 bg-white p-4"
          >
            <span className="absolute top-3 right-3 text-[11px] tabular-nums" style={{ color: '#9aa0a6' }}>{i + 1}</span>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: LANE[lane].bg }}>
              <Icon className="w-4 h-4" style={{ color: LANE[lane].color }} />
            </div>
            <p className="text-sm" style={{ color: INK }}>{label}</p>
          </motion.div>
        ))}
      </Group>
    </div>
  );
}

/* --------------------------------------------------------------- challenges */

const CHALLENGES = [
  { icon: Layers, title: 'Many formats', from: 'PDF, Word, photo', to: 'one text', body: 'Each reader loads only when needed.' },
  { icon: Braces, title: 'Predictable AI', from: 'free text', to: 'a schema', body: 'The UI never gets a shape it cannot draw.' },
  { icon: ShieldCheck, title: 'A public key', from: 'open to all', to: '40 an hour', body: 'Capped by address, and it fails open.' },
  { icon: Gauge, title: 'Felt latency', from: '2 seconds', to: 'instant', body: 'The browser counts. The AI only reads.' },
];

export function ChallengeTiles() {
  return (
    <Group className="grid sm:grid-cols-2 gap-3">
      {CHALLENGES.map(({ icon: Icon, title, from, to, body }) => (
        <motion.div key={title} variants={item} className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <Icon className="w-4 h-4" style={{ color: BLUE }} />
            <p className="text-sm" style={{ color: INK }}>{title}</p>
          </div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs" style={{ color: MUTED }}>{from}</span>
            <span aria-hidden="true" style={{ color: '#9aa0a6' }}>to</span>
            <span className="rounded-full px-3 py-1 text-xs" style={{ background: '#e8f0fe', color: BLUE }}>{to}</span>
          </div>
          <p className="text-xs" style={{ color: MUTED }}>{body}</p>
        </motion.div>
      ))}
    </Group>
  );
}

/* ------------------------------------------------------------------- verify */

const VERIFY = [
  { title: 'Build gate', body: 'Every function is loaded under plain Node before a deploy.', note: 'Born from a real outage' },
  { title: 'One schema', body: 'The model and the screen share it, so a change is a type error.', note: 'Checked on every build' },
  { title: 'Models compared', body: 'The sample essay has no conclusion. Haiku missed it. Sonnet caught it.', note: 'Why Sonnet marks' },
];

export function VerifyRow() {
  return (
    <div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 mb-4 text-sm" style={{ color: INK }}>
        No automated test suite yet. These stand in for one.
      </div>
      <Group className="grid sm:grid-cols-3 gap-3">
        {VERIFY.map(({ title, body, note }) => (
          <motion.div key={title} variants={item} className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="w-7 h-7 rounded-full flex items-center justify-center mb-3" style={{ background: '#34A8531a' }}>
              <Check className="w-3.5 h-3.5" style={{ color: GREEN }} />
            </div>
            <p className="text-sm mb-1" style={{ color: INK }}>{title}</p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: MUTED }}>{body}</p>
            <p className="text-[11px]" style={{ color: BLUE }}>{note}</p>
          </motion.div>
        ))}
      </Group>
    </div>
  );
}

/* --------------------------------------------------------------------- next */

const NEXT = [
  'Automated tests', 'Streaming checks', 'Saved drafts', 'Professor templates',
  'Real citation parser', 'Scored example set',
];

export function NextChips() {
  return (
    <Group className="flex flex-wrap gap-2">
      {NEXT.map((name) => (
        <motion.span
          key={name}
          variants={item}
          className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-gray-300 bg-white px-4 py-1.5 text-sm"
          style={{ color: INK }}
        >
          <Plus className="w-3 h-3" style={{ color: BLUE }} />
          {name}
        </motion.span>
      ))}
    </Group>
  );
}
