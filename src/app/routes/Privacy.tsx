import { motion } from 'motion/react';
import { SiteNav, SiteFooter, Section, PageHead } from '../components/site/Shell';
import { Privacy as PrivacyList } from '../components/site/CaseStudy';

const LIMITS = [
  ['It does not write your work for you.', 'It helps you understand what needs improvement.'],
  ['Your work is not permanently saved.', 'Close the tab and your session is gone.'],
  ['Source counting is an estimate.', 'Use it as a helpful progress check, not as your final citation checker.'],
];

export function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />
      <PageHead
        title="Privacy and limits"
        lede="Nothing here needs an account, and nothing is kept."
      />

      <Section tint title="Privacy">
        <PrivacyList />
      </Section>

      <Section title="What RubricMate does not do">
        <div className="space-y-3">
          {LIMITS.map(([head, tail]) => (
            <motion.div key={head} className="flex gap-3 items-baseline">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] shrink-0 translate-y-[-2px]" />
              <p className="text-sm text-[#5f6368]">
                <span className="text-[#202124]">{head}</span> {tail}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
