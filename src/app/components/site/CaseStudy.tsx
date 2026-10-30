import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Hash, Brain, X, Check } from 'lucide-react';

/**
 * The case study half of the landing page.
 *
 * The product half shows that the thing works. This half is for the reader
 * who wants to know whether it was engineered or merely assembled, so every
 * block here answers "why", not "what". Each one is deliberately short: a
 * recruiter skims, and a wall of prose gets skipped whatever it says.
 */

export const INK = '#202124';
export const MUTED = '#5f6368';
export const BLUE = '#4285F4';
export const EASE = [0.23, 1, 0.32, 1] as const;

export const group: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06 } },
};

export const item: Variants = {
  hidden: { opacity: 0, transform: 'translateY(10px)' },
  shown: { opacity: 1, transform: 'translateY(0px)', transition: { duration: 0.4, ease: EASE } },
};

/** One list that builds itself as it comes into view, or arrives whole. */
export function Group({ children, className }: { children: React.ReactNode; className?: string }) {
  const still = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={group}
      initial={still ? 'shown' : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------------------------------------- privacy */

const PRIVACY = [
  ['No account.', 'Open the demo and use it.'],
  ['No database.', 'Your document is held for the session and never written down.'],
  ['Keys stay on the server.', 'Every model call goes through a function that holds the key.'],
  ['Capped by address.', 'Forty requests an hour, so one visitor cannot run up the bill.'],
];

export function Privacy() {
  return (
    <Group className="space-y-2">
      {PRIVACY.map(([head, tail]) => (
        <motion.div key={head} variants={item} className="flex gap-3 items-baseline">
          <span className="w-1.5 h-1.5 rounded-full shrink-0 translate-y-[-2px]" style={{ background: BLUE }} />
          <p className="text-sm" style={{ color: MUTED }}>
            <span style={{ color: INK }}>{head}</span> {tail}
          </p>
        </motion.div>
      ))}
    </Group>
  );
}

/* ------------------------------------------------- landing page, visual */

/** The saving as one number, because that is the whole point of the chart. */
export function SavingsCallout() {
  return (
    <motion.div
      className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 px-6 py-6 flex items-center gap-6"
      initial={{ opacity: 0, transform: 'translateY(10px)' }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <span className="text-5xl leading-none tabular-nums" style={{ color: BLUE }}>80%</span>
      <p className="text-sm" style={{ color: INK }}>
        cheaper per session. The model that does the marking never changed.
      </p>
    </motion.div>
  );
}

const CHIPS = [
  'React', 'TypeScript', 'Vite', 'Tailwind', 'Radix UI',
  'Claude API', 'Zod', 'Vercel',
];

/** Names only. The reasoning for each lives on the write-up page. */
export function StackChips() {
  return (
    <Group className="flex flex-wrap gap-2">
      {CHIPS.map((name) => (
        <motion.span
          key={name}
          variants={item}
          className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm"
          style={{ color: INK }}
        >
          {name}
        </motion.span>
      ))}
    </Group>
  );
}

const DEEPER = [
  { to: '/about', title: 'How it was built', body: 'Decisions, request flow, challenges.' },
  { to: '/privacy', title: 'Privacy and limits', body: 'What is kept, and what it will not do.' },
];

/** Where the long text went. Cards, so it reads as a place to go, not a footnote. */
export function GoDeeper({ link }: { link: React.ComponentType<any> }) {
  const Link = link;
  return (
    <Group className="grid sm:grid-cols-2 gap-3">
      {DEEPER.map(({ to, title, body }) => (
        <motion.div key={to} variants={item}>
          <Link
            to={to}
            className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-[#4285F4] transition-colors"
          >
            <p className="text-sm mb-1" style={{ color: INK }}>{title}</p>
            <p className="text-xs mb-3" style={{ color: MUTED }}>{body}</p>
            <span className="text-xs" style={{ color: BLUE }}>Read more</span>
          </Link>
        </motion.div>
      ))}
    </Group>
  );
}

/* ----------------------------------------------------- the idea, concretely */

const SAMPLE_RULES = [
  { rule: 'Write at least 1,000 words', by: 'browser' },
  { rule: 'Use at least 4 sources', by: 'browser' },
  { rule: 'State a clear aim', by: 'ai' },
  { rule: 'End with a conclusion', by: 'ai' },
] as const;

/**
 * The split, shown on a rubric a stranger can read. A diagram of "simple
 * checks" and "AI checks" only makes sense to someone who already knows what
 * RubricMate does, so this starts from four rules anyone has been marked on.
 */
export function RubricExample() {
  return (
    <div>
      <Group className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-[#fafbfc]">
          <p className="text-xs" style={{ color: MUTED }}>A sample rubric</p>
        </div>
        {SAMPLE_RULES.map(({ rule, by }) => {
          const ai = by === 'ai';
          const Icon = ai ? Brain : Hash;
          return (
            <motion.div
              key={rule}
              variants={item}
              className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 last:border-b-0"
            >
              <p className="text-sm" style={{ color: INK }}>{rule}</p>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs shrink-0"
                style={ai ? { background: '#f3e8fd', color: '#8430ce' } : { background: '#e8f0fe', color: BLUE }}
              >
                <Icon className="w-3 h-3" />
                {ai ? 'Read by AI' : 'Counted in your browser'}
              </span>
            </motion.div>
          );
        })}
      </Group>
      <p className="text-xs mt-4" style={{ color: MUTED }}>
        Counts update as you type. The AI check takes a few seconds.
      </p>
    </div>
  );
}

/* ------------------------------------------------- the problem and the fix */

const WITHOUT = [
  'Read the rubric once',
  'Forget parts while you write',
  'Find the gaps after you finish',
];

const WITH = [
  'Your rubric becomes a checklist',
  'It updates as you write',
  'Gaps show while you can still fix them',
];

/**
 * Why anyone should care, before how it works. The old order explained the
 * mechanism first, which only makes sense to someone already convinced.
 */
export function ProblemSolution() {
  return (
    <div>
      <Group className="grid sm:grid-cols-2 gap-3">
        <motion.div variants={item} className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs mb-4" style={{ color: MUTED }}>Without it</p>
          <div className="space-y-3">
            {WITHOUT.map((line) => (
              <div key={line} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: '#ea43351a' }}>
                  <X className="w-3.5 h-3.5" style={{ color: '#d93025' }} />
                </span>
                <p className="text-sm" style={{ color: INK }}>{line}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-xs mb-4" style={{ color: BLUE }}>With RubricMate</p>
          <div className="space-y-3">
            {WITH.map((line) => (
              <div key={line} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: '#34A8531f' }}>
                  <Check className="w-3.5 h-3.5" style={{ color: '#1e8e3e' }} />
                </span>
                <p className="text-sm" style={{ color: INK }}>{line}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </Group>
      <p className="text-sm mt-5" style={{ color: INK }}>
        So you fix it before you submit, not after you get the mark.
      </p>
    </div>
  );
}
