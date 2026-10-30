import { SiteNav, SiteFooter, Section, PageHead } from '../components/site/Shell';
import {
  WhyThisArchitecture, Decisions, RequestFlow, Challenges, Verification, WhatIsNext,
} from '../components/site/CaseStudy';

/** The long version, for the reader who wants the reasoning. */
export function About() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />
      <PageHead
        title="How RubricMate was built"
        lede="The choices behind it, and what went wrong along the way."
      />

      <Section tint title="Why it is shaped this way">
        <WhyThisArchitecture />
      </Section>

      <Section title="Three decisions" lede="The calls that shaped everything else.">
        <Decisions />
      </Section>

      <Section
        tint
        title="What happens when you press Check"
        lede="Eight steps, and only two trips to the server."
      >
        <RequestFlow />
      </Section>

      <Section title="Challenges" lede="The four that took the longest to get right.">
        <Challenges />
      </Section>

      <Section
        tint
        title="How it is verified"
        lede="There is no automated test suite yet. This is what stands in for one."
      >
        <Verification />
      </Section>

      <Section title="What I would build next">
        <WhatIsNext />
      </Section>

      <SiteFooter />
    </div>
  );
}
