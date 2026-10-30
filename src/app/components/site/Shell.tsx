import { Link } from 'react-router';
import '../../../styles/site.css';

/**
 * The frame every public page shares: the masthead, the footer and the
 * section wrapper. Kept in one place so the home page and the two text pages
 * cannot drift apart. Everything is styled by site.css on the .site block,
 * which keeps these pages' tokens away from the demo app's Tailwind theme.
 */

export const GITHUB = 'https://github.com/KushagraRishi/RubricMate';

const STACK = ['React', 'TypeScript', 'Vite', 'Tailwind', 'Radix UI', 'Claude API', 'Zod', 'Vercel'];

/** The checklist mark, drawn in the ink so it sits in the type. */
function Mark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="4.5" y="3.5" width="15" height="17" rx="1.5" />
      <path d="M8.5 12.2l2.4 2.4 4.6-5.1" />
    </svg>
  );
}

export function Wordmark({ size }: { size?: 'large' }) {
  return (
    <Link to="/" className="wordmark" aria-label="RubricMate home" style={size ? { fontSize: 'var(--text-2xl)' } : undefined}>
      <Mark />
      RubricMate
    </Link>
  );
}

/** The whole page, on the theme's block. */
export function SitePage({ children }: { children: React.ReactNode }) {
  return <div className="site">{children}</div>;
}

export function SiteNav() {
  return (
    <header className="masthead proof-ground">
      <div className="proof" aria-hidden="true" />
      <div className="container masthead__row">
        <nav className="masthead__links" aria-label="Pages">
          <Link to="/about" className="link">How it was built</Link>
          <Link to="/privacy" className="link">Privacy</Link>
        </nav>
        <Wordmark />
        <nav className="masthead__links masthead__links--end" aria-label="Product">
          <a href={GITHUB} target="_blank" rel="noreferrer" className="link">Source</a>
          <Link to="/demo" className="link">Try it</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__mast">
          <Wordmark size="large" />
          <p>Built by Kushagra Chaudhary</p>
        </div>
        <div className="footer__col">
          <p className="label">Read</p>
          <ul>
            <li><Link to="/about" className="link">How it was built</Link></li>
            <li><Link to="/privacy" className="link">Privacy</Link></li>
          </ul>
        </div>
        <div className="footer__col">
          <p className="label">Use</p>
          <ul>
            <li><Link to="/demo" className="link">Try the demo</Link></li>
            <li><a href={GITHUB} target="_blank" rel="noreferrer" className="link">Source</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <p className="label">Built with</p>
          <ul>
            {STACK.map((name) => <li key={name}>{name}</li>)}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export function Section({
  id, title, lede, band, tall, children,
}: {
  id?: string;
  title: string;
  lede?: string;
  band?: boolean;
  tall?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className={`section${band ? ' section--band' : ''}${tall ? ' section--tall' : ''}`}>
      <div className="container">
        <div className="headblock">
          <h2>{title}</h2>
          {lede && <p className="lead">{lede}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

/** The top of a text page: a way back, a title, one line. */
export function PageHead({ title, lede }: { title: string; lede: string }) {
  return (
    <div className="page-head proof-ground">
      <div className="proof" aria-hidden="true" />
      <div className="container">
        <Link to="/" className="back link">Back to RubricMate</Link>
        <h1 className="rise">{title}</h1>
        <p className="lead rise rise--2">{lede}</p>
      </div>
    </div>
  );
}
