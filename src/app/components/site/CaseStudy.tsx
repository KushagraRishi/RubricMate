import { motion, useReducedMotion, type Variants } from 'motion/react';

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
