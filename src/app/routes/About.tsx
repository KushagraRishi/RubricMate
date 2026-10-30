import { SiteNav, SiteFooter, Section, PageHead } from '../components/site/Shell';
import { RubricExample } from '../components/site/CaseStudy';
import {
  NumberStrip, WhyTiles, DecisionCards, FlowGrid, ChallengeTiles, VerifyRow, NextChips,
} from '../components/site/AboutVisuals';

/** The longer story, told mostly in pictures. */
export function About() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />
      <PageHead title="How RubricMate was built" lede="The choices behind it, at a glance." />

      <section className="px-8 pb-12">
        <div className="max-w-[720px] mx-auto">
          <NumberStrip />
        </div>
      </section>

      <Section
        tint
        title="Two kinds of rules"
        lede="Works on any rubric: essays, journals, reports. Some rules are counted. Some are read."
      >
        <RubricExample />
      </Section>

      <Section title="Why it is shaped this way">
        <WhyTiles />
      </Section>

      <Section tint title="Three decisions">
        <DecisionCards />
      </Section>

      <Section title="What happens when you press Check" lede="Eight steps, two trips to the server.">
        <FlowGrid />
      </Section>

      <Section tint title="Four hard parts">
        <ChallengeTiles />
      </Section>

      <Section title="How it is verified">
        <VerifyRow />
      </Section>

      <Section tint title="What I would build next">
        <NextChips />
      </Section>

      <SiteFooter />
    </div>
  );
}
