import { Link } from 'react-router';
import { BookCheck, Github, Upload, PenLine, ListChecks } from 'lucide-react';
import { motion, useReducedMotion, useScroll } from 'motion/react';
import { Button } from '../components/ui/button';
import { SplitDiagram, ArchitectureDiagram, CostChart } from '../components/site/Diagrams';
import { DemoReel } from '../components/site/DemoReel';

/** Same curve as the diagrams, so the page moves as one thing. */
const EASE = [0.23, 1, 0.32, 1] as const;

const STEPS = [
  { icon: Upload, title: 'Drop in your rubric', body: 'A PDF, a Word file, or paste it.' },
  { icon: PenLine, title: 'Write', body: 'Counts move as you type.' },
  { icon: ListChecks, title: 'Check it', body: 'A score and a reason for each line.' },
];

const LIMITS = [
  ['It does not write your essay for you.', 'It helps you understand what needs improvement.'],
  ['Your work is not permanently saved.', 'Close the tab and your session is gone.'],
  ['Source counting is an estimate.', 'Use it as a helpful progress check, not as your final citation checker.'],
];

function Section({
  id, title, lede, tint, children,
}: {
  id?: string;
  title: string;
  lede?: string;
  tint?: boolean;
  children?: React.ReactNode;
}) {
  const still = useReducedMotion();
  // The heading leads and the lede follows a beat later, so the eye is given
  // an order to read them in rather than a block that appears at once.
  const rise = (delay: number) => ({
    initial: still ? false : { opacity: 0, transform: 'translateY(12px)' },
    whileInView: still ? undefined : { opacity: 1, transform: 'translateY(0px)' },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.45, delay, ease: EASE },
  });

  return (
    <section
      id={id}
      className={`px-8 py-20 border-t border-gray-200 ${tint ? 'bg-[#fafbfc]' : ''}`}
    >
      <div className="max-w-[720px] mx-auto">
        <motion.h2 className="text-[#202124] mb-2" {...rise(0)}>{title}</motion.h2>
        {lede && (
          <motion.p className="text-[#5f6368] mb-8 leading-relaxed" {...rise(0.08)}>
            {lede}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  );
}

export function Landing() {
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 px-8 py-4 sticky top-0 bg-white/90 backdrop-blur z-30">
        {/* How far down the page you are. Bound straight to the scroll value,
            so it tracks the thumb exactly rather than animating after it. */}
        <motion.div
          className="absolute left-0 bottom-0 h-0.5 w-full bg-[#4285F4] origin-left"
          style={{ scaleX: scrollYProgress }}
          aria-hidden="true"
        />
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4285F4] rounded-lg flex items-center justify-center">
              <BookCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-[#202124]">RubricMate</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="#build" className="hidden sm:inline-block text-sm text-[#5f6368] hover:text-[#4285F4] transition-colors px-3 py-2">
              How it works
            </a>
            <Link to="/demo">
              <Button className="bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full px-5">Try it</Button>
            </Link>
          </div>
        </div>
      </nav>

      <header className="px-8 pt-20 pb-10">
        <motion.div
          className="max-w-[760px] mx-auto text-center"
          initial={still ? false : { opacity: 0, y: 14 }}
          animate={still ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="text-[#202124] mb-4 text-4xl leading-tight">
            Know exactly what your assignment is missing
          </h1>
          <p className="text-[#5f6368] max-w-[560px] mx-auto">
            Upload your rubric and start writing. RubricMate shows what you have completed,
            what still needs work, and what to fix next.
          </p>
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
        tint
        title="Check simple things instantly"
        lede="Some rubric requirements do not need AI. Word count, number of sources, and other simple checks can be done directly in your browser."
      >
        <SplitDiagram />
        <p className="text-sm text-[#5f6368] mt-6 leading-relaxed">
          This makes RubricMate faster and reduces unnecessary AI costs.
        </p>
      </Section>

      <Section title="How RubricMate works" lede="RubricMate keeps the process simple.">
        <ArchitectureDiagram />
        <p className="text-sm text-[#5f6368] mt-6 leading-relaxed">
          Your document is converted to text in your browser, so large files do not need to be
          uploaded to our server.
        </p>
      </Section>

      <Section
        tint
        title="Tested, not guessed"
        lede="We tested different AI models to see which ones were best for each task. Some smaller models missed important details, such as a missing conclusion. Stronger models caught them. So RubricMate uses the right model for each job instead of using the most expensive model for everything."
      >
        <CostChart />
        <p className="text-sm text-[#5f6368] mt-6 leading-relaxed">
          We are also testing RubricMate with professors to make sure the feedback matches how
          real assignments are graded.
        </p>
      </Section>

      <Section title="What RubricMate does not do">
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
