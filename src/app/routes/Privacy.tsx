import { SitePage, SiteNav, SiteFooter, Section, PageHead } from '../components/site/Shell';
import { Privacy as PrivacyList } from '../components/site/CaseStudy';

const LIMITS = [
  ['It does not write your work for you.', 'It helps you understand what needs improvement.'],
  ['Your work is not permanently saved.', 'Close the tab and your session is gone.'],
  ['Source counting is an estimate.', 'Use it as a helpful progress check, not as your final citation checker.'],
];

export function Privacy() {
  return (
    <SitePage>
      <SiteNav />
      <PageHead
        title="Privacy and limits"
        lede="Nothing here needs an account, and nothing is kept."
      />

      <Section band title="Privacy">
        <PrivacyList />
      </Section>

      <Section title="What RubricMate does not do">
        <ul className="plain set">
          {LIMITS.map(([head, tail]) => (
            <li key={head}>
              <h3>{head}</h3>
              <p>{tail}</p>
            </li>
          ))}
        </ul>
      </Section>

      <SiteFooter />
    </SitePage>
  );
}
