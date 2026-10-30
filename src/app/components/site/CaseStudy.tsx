import { motion, useReducedMotion, type Variants } from 'motion/react';
import {
  FileInput, Cpu, ListChecks, ShieldCheck, Gauge, FileSearch,
  Braces, Server, Palette, Brain, Check,
} from 'lucide-react';

/**
 * The case study half of the landing page.
 *
 * The product half shows that the thing works. This half is for the reader
 * who wants to know whether it was engineered or merely assembled, so every
 * block here answers "why", not "what". Each one is deliberately short: a
 * recruiter skims, and a wall of prose gets skipped whatever it says.
 */

const INK = '#202124';
const MUTED = '#5f6368';
const BLUE = '#4285F4';
const EASE = [0.23, 1, 0.32, 1] as const;

const group: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, transform: 'translateY(10px)' },
  shown: { opacity: 1, transform: 'translateY(0px)', transition: { duration: 0.4, ease: EASE } },
};

/** One list that builds itself as it comes into view, or arrives whole. */
function Group({ children, className }: { children: React.ReactNode; className?: string }) {
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

/* ---------------------------------------------------------------- overview */

const PIECES = [
  { icon: FileInput, label: 'Input', body: 'Your rubric, and the draft you are writing.' },
  { icon: Cpu, label: 'Processing', body: 'Counting in the browser, reading by AI.' },
  { icon: ListChecks, label: 'Output', body: 'A checklist with a reason for each line.' },
];

export function OverviewCards() {
  return (
    <Group className="grid sm:grid-cols-3 gap-3">
      {PIECES.map(({ icon: Icon, label, body }) => (
        <motion.div
          key={label}
          variants={item}
          className="rounded-xl border border-gray-200 bg-white p-4"
        >
          <Icon className="w-4 h-4 mb-2" style={{ color: BLUE }} />
          <p className="text-sm mb-1" style={{ color: INK }}>{label}</p>
          <p className="text-xs leading-relaxed" style={{ color: MUTED }}>{body}</p>
        </motion.div>
      ))}
    </Group>
  );
}

/* -------------------------------------------------------------- tech stack */

const STACK = [
  {
    icon: Braces,
    area: 'Frontend',
    tech: 'React 18, TypeScript, Vite',
    body: 'The interface, the editor, the checklist state, and every file the browser reads.',
  },
  {
    icon: Palette,
    area: 'Styling',
    tech: 'Tailwind CSS, Radix UI',
    body: 'Radix brings keyboard support and focus handling with the components.',
  },
  {
    icon: Brain,
    area: 'AI',
    tech: 'Claude API, Haiku 5.5 and Sonnet 5.5',
    body: 'A different model per route, picked by how much reading the job needs.',
  },
  {
    icon: Server,
    area: 'Backend',
    tech: 'Vercel serverless functions',
    body: 'Three endpoints. No database, no session store, and the API key lives here.',
  },
  {
    icon: FileSearch,
    area: 'Documents',
    tech: 'pdf.js, mammoth, heic2any',
    body: 'PDF, Word and photos become text in the browser. Each loads only when used.',
  },
  {
    icon: ShieldCheck,
    area: 'Validation',
    tech: 'Zod',
    body: 'One schema defines the reply, enforces it, and types the code that renders it.',
  },
];

export function TechStack() {
  return (
    <Group className="grid sm:grid-cols-2 gap-3">
      {STACK.map(({ icon: Icon, area, tech, body }) => (
        <motion.div
          key={area}
          variants={item}
          className="rounded-xl border border-gray-200 bg-white p-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-3.5 h-3.5" style={{ color: BLUE }} />
            <p className="text-xs uppercase tracking-wide" style={{ color: MUTED }}>{area}</p>
          </div>
          <p className="text-sm mb-1" style={{ color: INK }}>{tech}</p>
          <p className="text-xs leading-relaxed" style={{ color: MUTED }}>{body}</p>
        </motion.div>
      ))}
    </Group>
  );
}

/* ------------------------------------------------------------ why this way */

const BENEFITS = [
  'Anything countable answers on the keystroke, with no network wait.',
  'Requests carry only what the model has to read, so they cost less.',
  'The API key never reaches the browser.',
  'A slow or failed model call does not stop the counts from updating.',
];

export function WhyThisArchitecture() {
  return (
    <Group className="space-y-2">
      {BENEFITS.map((line) => (
        <motion.div key={line} variants={item} className="flex gap-2 items-baseline">
          <Check className="w-3.5 h-3.5 shrink-0 translate-y-0.5" style={{ color: '#34A853' }} />
          <p className="text-sm" style={{ color: MUTED }}>{line}</p>
        </motion.div>
      ))}
    </Group>
  );
}

/* ------------------------------------------------------------- decisions */

const DECISIONS = [
  {
    n: '01',
    title: 'Do not send everything to the AI',
    body: 'A word count is arithmetic. Counting sources is pattern matching. Neither needs a language model, and asking one costs money and two seconds. The browser does both on every keystroke. The model is asked only where meaning is involved, like whether a thesis is actually arguable.',
  },
  {
    n: '02',
    title: 'A different model for each job',
    body: 'Reading a rubric into a list is close to transcription, so it goes to Haiku. Marking a draft against that list is judgement, so it goes to Sonnet. Questions go to Haiku. One model everywhere is the easy choice, and it is the expensive one.',
  },
  {
    n: '03',
    title: 'Make the reply a shape, not a paragraph',
    body: 'Each criterion comes back as id, status, score, feedback and evidence, defined once as a Zod schema and enforced by the API as structured output. The same schema types the components that render it, so a reply the UI cannot display is not a bug to catch later, it is a thing that cannot be built.',
  },
];

export function Decisions() {
  return (
    <Group className="space-y-5">
      {DECISIONS.map(({ n, title, body }) => (
        <motion.div key={n} variants={item} className="flex gap-4">
          <span className="text-sm tabular-nums shrink-0 pt-0.5" style={{ color: BLUE }}>{n}</span>
          <div>
            <p className="text-sm mb-1" style={{ color: INK }}>{title}</p>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{body}</p>
          </div>
        </motion.div>
      ))}
    </Group>
  );
}

/* ----------------------------------------------------------- request flow */

const FLOW = [
  { step: 'You drop in a rubric', where: 'browser' },
  { step: 'The file becomes plain text', where: 'browser' },
  { step: 'The text becomes a list of criteria', where: 'model' },
  { step: 'Word and source targets split out', where: 'browser' },
  { step: 'You write, and those two update live', where: 'browser' },
  { step: 'On check, the draft and the rest go up', where: 'server' },
  { step: 'The reply is checked against the schema', where: 'server' },
  { step: 'The checklist updates, with reasons', where: 'browser' },
] as const;

const WHERE = {
  browser: { label: 'browser', className: 'bg-blue-50 text-[#4285F4]' },
  server: { label: 'server', className: 'bg-gray-100 text-[#5f6368]' },
  model: { label: 'model', className: 'bg-purple-50 text-[#8430ce]' },
} as const;

export function RequestFlow() {
  return (
    <Group className="relative">
      {/* One line down the left, so eight steps read as one path. */}
      <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gray-200" aria-hidden="true" />
      <div className="space-y-2.5">
        {FLOW.map(({ step, where }, i) => (
          <motion.div key={step} variants={item} className="flex items-center gap-3 relative">
            <span
              className="w-6 h-6 rounded-full border border-gray-200 bg-white text-[10px] flex items-center justify-center shrink-0 tabular-nums"
              style={{ color: MUTED }}
            >
              {i + 1}
            </span>
            <p className="text-sm" style={{ color: INK }}>{step}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ml-auto shrink-0 ${WHERE[where].className}`}>
              {WHERE[where].label}
            </span>
          </motion.div>
        ))}
      </div>
    </Group>
  );
}

/* ------------------------------------------------------------- challenges */

const CHALLENGES = [
  {
    title: 'Three file formats, one piece of text',
    body: 'A rubric arrives as a PDF, a Word file, a photo of a handout, or pasted text. Each needs a different reader, and a photo needs decoding and resizing before anything can use it. All of it happens in the browser, and each reader is only downloaded if you actually hand it that kind of file.',
  },
  {
    title: 'Making the model predictable',
    body: 'A free text answer is a parser you have to write and a crash you have to catch. Structured output plus a Zod schema moves that problem to the edge of the system: the model is given the shape, the API enforces it, and the UI is handed something it already knows how to draw.',
  },
  {
    title: 'A public demo on one personal key',
    body: 'Anyone can use this without signing up, which is the point, and also a way to run up a bill. Each input is capped, and each address gets forty requests an hour, counted in Redis when it is configured and in memory when it is not. A rate limiter that is down must not take the demo down with it, so that fallback fails open.',
  },
  {
    title: 'Latency you can feel',
    body: 'The first version asked the model for the word count, so the page waited two seconds to display a number it already had. Splitting countable from readable removed the wait entirely for half the checklist, and cut the cost of a session at the same time.',
  },
];

export function Challenges() {
  return (
    <Group className="space-y-3">
      {CHALLENGES.map(({ title, body }) => (
        <motion.div
          key={title}
          variants={item}
          className="rounded-xl border border-gray-200 bg-white p-4"
        >
          <p className="text-sm mb-1" style={{ color: INK }}>{title}</p>
          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{body}</p>
        </motion.div>
      ))}
    </Group>
  );
}

/* ----------------------------------------------------------- verification */

const CHECKS = [
  {
    title: 'The build refuses to ship a broken function',
    body: 'The handlers once used imports without file extensions. Vite resolved them, Node did not, so every function died before a line of handler code ran, and the dev server stayed green throughout. Now the build compiles the API and loads each route under plain Node first, and fails there instead of in production.',
  },
  {
    title: 'One schema on both sides',
    body: 'The Zod schema that constrains the model is the same one the client types against, so a field that changes shape is a type error rather than a blank panel. The whole project typechecks on every build.',
  },
  {
    title: 'The models were compared, not assumed',
    body: 'The sample essay ends without a conclusion on purpose. Haiku called the structure finished, Sonnet and Opus both caught it. That one disagreement is why marking goes to Sonnet and the two jobs where all three agreed go to Haiku.',
  },
];

export function Verification() {
  return (
    <Group className="space-y-3">
      {CHECKS.map(({ title, body }) => (
        <motion.div key={title} variants={item} className="flex gap-3">
          <Gauge className="w-4 h-4 shrink-0 mt-0.5" style={{ color: BLUE }} />
          <div>
            <p className="text-sm mb-1" style={{ color: INK }}>{title}</p>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{body}</p>
          </div>
        </motion.div>
      ))}
    </Group>
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

/* ------------------------------------------------------------------- next */

const NEXT = [
  'Automated tests for the counters and the schema boundary',
  'Streaming the check, so feedback arrives line by line',
  'Saved rubrics and a history of drafts',
  'Rubric templates a professor can publish',
  'A real citation parser in place of the pattern match',
  'A scored set of marked essays, to catch a model getting worse',
];

export function WhatIsNext() {
  return (
    <Group className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
      {NEXT.map((line) => (
        <motion.div key={line} variants={item} className="flex gap-2 items-baseline">
          <span className="text-xs shrink-0" style={{ color: BLUE }}>+</span>
          <p className="text-sm" style={{ color: MUTED }}>{line}</p>
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
