import { Link } from 'react-router';
import { Upload, PenLine, ListChecks } from 'lucide-react';
import { ArchitectureDiagram, CostChart } from '../components/site/Diagrams';
import { DemoReel } from '../components/site/DemoReel';
import { ProblemSolution, GoDeeper } from '../components/site/CaseStudy';
import { SitePage, SiteNav, SiteFooter, Section } from '../components/site/Shell';

const STEPS = [
  { icon: Upload, title: 'Drop your assignment', body: 'A PDF, a Word file, or write it here.' },
  { icon: PenLine, title: 'Add your rubric', body: 'It becomes your checklist.' },
  { icon: ListChecks, title: 'Check it', body: 'A score and a reason for each line.' },
];

export function Landing() {
  return (
    <SitePage>
      <SiteNav />

      <header className="hero proof-ground">
        <div className="proof" aria-hidden="true" />
        <div className="container hero__grid">
          <h1 className="hero__head rise">Know exactly what your assignment is missing</h1>
          <div className="hero__side rise rise--2">
            <p className="lead">Drop your assignment. See what is done, and what is not.</p>
            <Link to="/demo" className="btn btn--primary">Try the demo</Link>
          </div>
        </div>
      </header>

      {/* The reel is a document beside a sidebar, the same as the demo, so it
          needs a document's width. A phone gets the three steps in words. */}
      <div className="reel-wrap only-wide">
        <div className="container">
          <DemoReel />
        </div>
      </div>

      <div className="only-narrow">
        <ol className="container steps">
          {STEPS.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <Icon aria-hidden="true" />
              <div>
                <p>{title}</p>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <Section
        id="build"
        band
        title="Stop finding out too late"
        lede="A rubric is the list of things your assignment is marked on."
      >
        <ProblemSolution />
      </Section>

      <Section
        tall
        title="What happens behind the screen"
        lede="Your browser does the counting. A small server asks the AI."
      >
        <figure className="figure-sheet crop" style={{ margin: 'var(--space-2xl) 0 0' }}>
          <ArchitectureDiagram />
        </figure>
      </Section>

      <Section
        band
        title="Performance and cost"
        lede="Counting moved into the browser. Each job got the model it needs."
      >
        <div className="cost">
          <div className="cost__figure">
            <p className="bigfig">80%</p>
            <div className="bigfig-rule" aria-hidden="true" />
            <p>cheaper per session. The model that does the marking never changed.</p>
          </div>
          <div className="cost__chart">
            <CostChart />
          </div>
        </div>
        <p className="cost__note">Also being tested with professors, so the feedback matches real marking.</p>
      </Section>

      <Section title="Go deeper">
        <GoDeeper />
      </Section>

      <SiteFooter />
    </SitePage>
  );
}
