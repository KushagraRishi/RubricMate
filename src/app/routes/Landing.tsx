import { Link } from 'react-router';
import { BookCheck, ArrowRight, Github, Upload, PenLine, ListChecks } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '../components/ui/button';
import { SplitDiagram, ArchitectureDiagram, CostChart } from '../components/site/Diagrams';
import { DemoReel } from '../components/site/DemoReel';

const STEPS = [
  { icon: Upload, title: 'Drop in your rubric', body: 'A PDF, a Word file, or paste it.' },
  { icon: PenLine, title: 'Write', body: 'Counts move as you type.' },
  { icon: ListChecks, title: 'Check it', body: 'A score and a reason for each line.' },
];

const LIMITS = [
  ['It will not write your essay.', 'Ask, and it explains the shape of a paragraph instead.'],
  ['Nothing is saved.', 'Close the tab and the session is gone.'],
  ['The citation counter is a regex.', 'Good enough for live progress, not for marking.'],
];

function Section({
  id, title, lede, children,
}: {
  id?: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  const still = useReducedMotion();
  return (
    <section id={id} className="px-8 py-16 border-t border-gray-200">
      <div className="max-w-[720px] mx-auto">
        <motion.div
          initial={still ? false : { opacity: 0, y: 10 }}
          whileInView={still ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <h2 className="text-[#202124] mb-2">{title}</h2>
          {lede && <p className="text-[#5f6368] mb-8 leading-relaxed">{lede}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
}

export function Landing() {
  const still = useReducedMotion();

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 px-8 py-4 sticky top-0 bg-white/90 backdrop-blur z-30">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4285F4] rounded-lg flex items-center justify-center">
              <BookCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-[#202124]">RubricMate</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="#build" className="hidden sm:inline-block text-sm text-[#5f6368] hover:text-[#4285F4] transition-colors px-3 py-2">
              How it was built
            </a>
            <Link to="/demo">
              <Button className="bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full px-5">Try it</Button>
            </Link>
          </div>
        </div>
      </nav>

      <header className="px-8 pt-24 pb-16">
        <motion.div
          className="max-w-[760px] mx-auto text-center"
          initial={still ? false : { opacity: 0, y: 14 }}
          animate={still ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="text-[#202124] mb-4 text-4xl leading-tight">
            Turn a rubric into a checklist you can tick off
          </h1>
          <p className="text-[#5f6368] mb-8 max-w-[480px] mx-auto">
            Write your draft and see what you have met, what is half done, and what to fix next.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/demo">
              <Button className="bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full px-7 h-11">
                Try the live demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="#build">
              <Button variant="outline" className="rounded-full px-7 h-11 border-gray-300">
                How it was built
              </Button>
            </a>
          </div>
        </motion.div>
      </header>

      {/* The reel is a document beside a sidebar, the same as the demo, so it
          needs the same width. A phone gets the three steps in words. */}
      <motion.div
        className="pb-16 hidden md:block"
        initial={still ? false : { opacity: 0, y: 16 }}
        animate={still ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
      >
        <DemoReel />
      </motion.div>

      <div className="md:hidden px-8 pb-16 space-y-3 max-w-[420px] mx-auto">
        {STEPS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-3 items-start">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-[#4285F4]" />
            </div>
            <div>
              <p className="text-sm text-[#202124]">{title}</p>
              <p className="text-xs text-[#5f6368]">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <Section
        id="build"
        title="Count what can be counted"
        lede="A word count is not a judgement call. Neither is “cite four sources”. Only the rest is worth a model."
      >
        <SplitDiagram />
        <p className="text-sm text-[#5f6368] mt-6 leading-relaxed">
          The first version sent the draft to the model to learn its own word count — a two second
          wait for a number the browser already had. Splitting it made the page feel immediate and
          cut the bill at the same time.
        </p>
      </Section>

      <Section title="How it is built" lede="A React app, three serverless functions, and no database.">
        <ArchitectureDiagram />
        <p className="text-sm text-[#5f6368] mt-6 leading-relaxed">
          Files become text in the browser, so a large PDF never crosses the wire. Both scoring calls
          use a Zod schema as structured output, so a malformed reply is impossible rather than
          unlikely — and the same schema types the code that renders it.
        </p>
      </Section>

      <Section
        title="Measured, not guessed"
        lede="The sample essay ends without a conclusion on purpose. Haiku called the structure done; Sonnet and Opus caught it. So Sonnet marks drafts, and Haiku does the two jobs where all three scored the same."
      >
        <CostChart />
      </Section>

      <Section title="What it does not do">
        <div className="space-y-3">
          {LIMITS.map(([head, tail], i) => (
            <motion.div
              key={head}
              className="flex gap-3 items-baseline"
              initial={still ? false : { opacity: 0, x: -8 }}
              whileInView={still ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] shrink-0 translate-y-[-2px]" />
              <p className="text-sm text-[#5f6368]">
                <span className="text-[#202124]">{head}</span> {tail}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      <footer className="px-8 py-12 border-t border-gray-200 bg-[#F1F3F4]">
        <div className="max-w-[720px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#202124]">RubricMate</p>
            <p className="text-xs text-[#5f6368]">Built by Kushagra Chaudhary</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/KushagraRishi/RubricMate"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#5f6368] hover:text-[#4285F4] transition-colors"
            >
              <Github className="w-4 h-4" />
              Source
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
