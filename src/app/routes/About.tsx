import { SitePage, SiteNav, SiteFooter, Section, PageHead } from '../components/site/Shell';
import { RubricExample } from '../components/site/CaseStudy';
import { AtAGlance, Decisions, Flow, HardParts, Verified } from '../components/site/AboutVisuals';

/** The longer story, told mostly in the page's material. */
export function About() {
  return (
    <SitePage>
      <SiteNav />
      <PageHead title="How RubricMate was built" lede="The choices behind it, at a glance." />

      <section className="section">
        <div className="container">
          <AtAGlance />
        </div>
      </section>

      <Section
        band
        title="Two kinds of rules"
        lede="Works on any rubric: essays, journals, reports. Some rules are counted. Some are read."
      >
        <RubricExample />
      </Section>

      <Section title="Three decisions">
        <Decisions />
      </Section>

      <Section band title="What happens when you press Check" lede="Eight steps, two trips to the server.">
        <Flow />
      </Section>

      <Section title="Four hard parts">
        <HardParts />
      </Section>

      <Section band title="How it is verified">
        <Verified />
      </Section>

      <SiteFooter />
    </SitePage>
  );
}
