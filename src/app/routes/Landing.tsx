import { Link } from 'react-router';
import {
  BookCheck, ArrowRight, Upload, PenLine, ListChecks, Github,
  Calculator, Braces, ShieldCheck, Layers,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const STEPS = [
  {
    icon: Upload,
    title: 'Load your rubric',
    body: 'Upload a PDF or Word file, paste the text, or use the sample.',
  },
  {
    icon: PenLine,
    title: 'Write your draft',
    body: 'Word and source counts update as you type. No waiting, no API call.',
  },
  {
    icon: ListChecks,
    title: 'Check it',
    body: 'Every criterion gets a score, a reason, and a quote from your draft.',
  },
];

const DECISIONS = [
  {
    icon: Calculator,
    title: 'Count what can be counted',
    body: `A word count is not a judgement call. Nor is "cite at least four sources".
      Those are measured in the browser on every keystroke, so the bar moves while
      you type and is never wrong. The model is only asked the things that genuinely
      need reading: is this a real thesis, does the essay have a conclusion. Splitting
      the checklist this way makes the demo feel instant and costs a fraction as much
      to run.`,
  },
  {
    icon: Braces,
    title: 'Ask for a shape, not for prose',
    body: `Both model calls use structured outputs with a Zod schema, so the response
      is validated against that schema before it comes back. There is no prompt asking
      politely for JSON and no parser guessing at what came out. The same schema file
      types the React components, so a change to the shape breaks the build rather
      than the page.`,
  },
  {
    icon: Layers,
    title: 'The design came first',
    body: `The starting point was a Figma Make export: three hardcoded screens with
      every score and every line of feedback typed in by hand. The work was building
      an engine underneath it without touching the look. The colours, the cards, the
      status badges and the collapsing feedback panels are the originals. What changed
      is that the numbers in them are now real.`,
  },
  {
    icon: ShieldCheck,
    title: 'A public demo on a personal key',
    body: `Anyone can use this, and it runs on one API key, so the limits are part of
      the design: input is capped before it reaches the model, output is capped
      tightly, and requests are rate limited per visitor. It also will not write the
      assignment for you — ask it to and it explains the shape of a paragraph instead.
      That is a product decision as much as a safety one.`,
  },
];

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="px-8 py-20 border-t border-gray-200">
      <div className="max-w-[900px] mx-auto">
        {eyebrow && (
          <p className="text-xs text-[#4285F4] uppercase tracking-wider mb-3">{eyebrow}</p>
        )}
        <h2 className="text-[#202124] mb-8">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-200 px-8 py-4 sticky top-0 bg-white/90 backdrop-blur z-30">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4285F4] rounded-lg flex items-center justify-center">
              <BookCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-[#202124]">RubricMate</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#writeup"
              className="hidden sm:inline-block text-sm text-[#5f6368] hover:text-[#4285F4] transition-colors px-3 py-2"
            >
              How it was built
            </a>
            <Link to="/demo">
              <Button className="bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full px-5">
                Try it
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="px-8 pt-24 pb-20">
        <div className="max-w-[900px] mx-auto text-center">
          <h1 className="text-[#202124] mb-4 text-4xl leading-tight">
            Turn a rubric into a checklist you can tick off
          </h1>
          <p className="text-[#5f6368] mb-8 max-w-[560px] mx-auto">
            Load the rubric for your assignment. Write your draft. RubricMate tells you
            which parts you have met, which are half done, and what to fix next.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/demo">
              <Button className="bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full px-7 h-11">
                Try the live demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="#writeup">
              <Button variant="outline" className="rounded-full px-7 h-11 border-gray-300">
                How it was built
              </Button>
            </a>
          </div>
          <p className="text-xs text-[#5f6368] mt-5">
            No sign-up. A sample rubric and essay are one click away.
          </p>
        </div>
      </header>

      {/* How it works */}
      <Section title="Three steps">
        <div className="grid md:grid-cols-3 gap-4">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <Card key={title} className="p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[#4285F4]" />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs text-[#5f6368]">{i + 1}</span>
                <h3 className="text-sm text-[#202124]">{title}</h3>
              </div>
              <p className="text-xs text-[#5f6368] leading-relaxed">{body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Write-up */}
      <Section id="writeup" eyebrow="Write-up" title="The idea">
        <div className="space-y-4 text-[#5f6368] leading-relaxed">
          <p>
            Every assignment comes with a rubric, and almost nobody uses it properly. It
            arrives as a PDF, gets skimmed once, and then sits in a folder while the essay
            gets written from memory. Marks get lost on things the rubric said plainly:
            a missing conclusion, three sources where four were asked for, two hundred
            words short.
          </p>
          <p>
            RubricMate reads the rubric and turns it into a checklist that watches the
            draft. The useful part is not the scoring — it is that the requirements stay
            on screen, next to the writing, instead of in a file nobody opens.
          </p>
        </div>
      </Section>

      <Section title="How it is built">
        <div className="space-y-4 text-[#5f6368] leading-relaxed mb-8">
          <p>
            A React and Vite single-page app, with three serverless functions on Vercel's
            free tier. The functions are the only place the API key exists; the browser
            never sees it. There is no database and no accounts — a session lives in
            React state and ends when the tab closes, which for a demo is a feature
            rather than a shortcut.
          </p>
          <p>
            Rubric files are turned into text in the browser before anything is sent, so a
            ten megabyte PDF never crosses the wire and the functions stay small and
            JSON-only.
          </p>
          <p>
            Each route runs on the cheapest model that does its job, which was settled by
            measurement rather than by guessing. Reading a rubric and answering a question
            came out the same on Haiku as on Opus, so both run on Haiku. Marking a draft
            did not: the sample essay ends without a conclusion on purpose, and only the
            larger models noticed. That one runs on Sonnet, which catches it for a quarter
            of the price. The mix costs about 2c a session instead of 8c.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {DECISIONS.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[#4285F4]" />
              </div>
              <h3 className="text-sm text-[#202124] mb-2">{title}</h3>
              <p className="text-sm text-[#5f6368] leading-relaxed">{body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="The part worth stealing">
        <div className="space-y-4 text-[#5f6368] leading-relaxed">
          <p>
            One detail made the whole thing feel different to use. The first version sent
            the draft to the model every time you wanted to know anything, including the
            word count, which meant a two second wait to learn a number the browser
            already knew.
          </p>
          <p>
            Now the rubric extraction marks each criterion as measurable or not. A word
            count or a minimum number of citations comes back with a rule attached, and
            the browser evaluates that rule on every keystroke. Everything else waits for
            a model that is being asked a question only a reader can answer.
          </p>
          <p>
            It is a small change and it moved two things at once: the interface became
            immediate, and the cost per session dropped, because the expensive call now
            happens when you ask for it rather than continuously. The general lesson is
            dull but worth repeating — before reaching for a model, check which parts of
            the problem were never ambiguous to begin with.
          </p>
        </div>
      </Section>

      <Section title="What it does not do">
        <div className="space-y-4 text-[#5f6368] leading-relaxed">
          <p>
            It will not write your assignment. Ask it to and it explains how a paragraph
            is built, or gives an example on a different topic, and leaves the writing to
            you.
          </p>
          <p>
            It is also a demo, not a product. Nothing is saved between visits, there is no
            Google Docs integration despite the interface it borrows from, and the
            citation counter is a pattern match rather than a real parser — good enough to
            show live progress, not good enough to mark on. Those are the honest edges.
          </p>
        </div>
      </Section>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-gray-200 bg-[#F1F3F4]">
        <div className="max-w-[900px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#202124]">RubricMate</p>
            <p className="text-xs text-[#5f6368]">Built by Kushagra Chaudhary</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/KushagraRishi"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#5f6368] hover:text-[#4285F4] transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <Link to="/demo">
              <Button className="bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full px-5">
                Try the demo
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
