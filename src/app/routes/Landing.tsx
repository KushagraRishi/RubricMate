import { Link } from 'react-router';
import { Upload, PenLine, ListChecks } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { ArchitectureDiagram, CostChart } from '../components/site/Diagrams';
import { DemoReel } from '../components/site/DemoReel';
import { RubricExample, SavingsCallout, StackChips, GoDeeper } from '../components/site/CaseStudy';
import { SiteNav, SiteFooter, Section } from '../components/site/Shell';

const STEPS = [
  { icon: Upload, title: 'Drop in your rubric', body: 'A PDF, a Word file, or paste it.' },
  { icon: PenLine, title: 'Write', body: 'Counts move as you type.' },
  { icon: ListChecks, title: 'Check it', body: 'A score and a reason for each line.' },
];

export function Landing() {
  const still = useReducedMotion();

  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      <header className="px-8 pt-6 pb-6">
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
        className="pb-8 hidden md:block"
        initial={still ? false : { opacity: 0, y: 16 }}
        animate={still ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
      >
        <DemoReel />
      </motion.div>

      <div className="md:hidden px-8 pb-12 space-y-3 max-w-[420px] mx-auto">
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
        lede="A rubric is the list of things your assignment is marked on. RubricMate sorts each one."
      >
        <RubricExample />
      </Section>

      <Section title="How it fits together" lede="A React app, three functions, no database.">
        <ArchitectureDiagram />
      </Section>

      <Section
        tint
        title="Performance and cost"
        lede="Counting moved into the browser. Each job got the model it needs."
      >
        <CostChart />
        <SavingsCallout />
        <p className="text-xs text-[#5f6368] mt-4">
          Also being tested with professors, so the feedback matches real marking.
        </p>
      </Section>

      <Section title="Built with">
        <StackChips />
      </Section>

      <Section tint title="Go deeper">
        <GoDeeper link={Link} />
      </Section>

      <SiteFooter />
    </div>
  );
}
