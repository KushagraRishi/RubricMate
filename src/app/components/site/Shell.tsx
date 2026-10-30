import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
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

/** What rises in as it scrolls into view. The hero is never in this list. */
const REVEAL = [
  '.section .headblock', '.ba__table tbody tr', '.statement', '.figure-sheet',
  '.cost__figure', '.cost__chart', '.bigfig-rule', '.cost__note', '.index > li',
  '.rules-index li', '.plain li', '.figures > div', '.why > div', '.decision',
  '.flow li', '.hard > div', '.verify > div', '.honest', '.next li',
].join(', ');

/**
 * Plays each block's rise-in the first time it nears the screen. The
 * animation starts just below the fold, so the block is already moving when
 * it comes into view; siblings in one group follow each other by 90ms so a
 * list builds rather than appearing at once. Nothing is hidden in CSS, so with
 * scripting off the page is whole. With reduced motion asked for, it only
 * fades.
 */
function useReveal(root: React.RefObject<HTMLDivElement | null>) {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = root.current;
    if (!page || !('IntersectionObserver' in window) || !page.animate) return;
    const gentle = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = Array.from(page.querySelectorAll<HTMLElement>(REVEAL));

    const play = (el: HTMLElement) => {
      const siblings = el.parentElement ? Array.from(el.parentElement.children) : [el];
      const delay = gentle ? 0 : Math.min(Math.max(siblings.indexOf(el), 0), 5) * 90;
      const rule = el.classList.contains('bigfig-rule');
      const frames: Keyframe[] = gentle
        ? [{ opacity: 0 }, { opacity: 1 }]
        : rule
          ? [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }]
          : [{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'none' }];
      el.animate(frames, {
        duration: gentle ? 400 : rule ? 900 : 700,
        delay: rule && !gentle ? delay + 250 : delay,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'backwards',
      });
    };

    // Only what is still below the screen animates; what the reader can
    // already see stays put.
    const seen = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        play(entry.target as HTMLElement);
        seen.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px 8% 0px' });
    const fold = window.innerHeight;
    items.forEach((el) => {
      if (el.getBoundingClientRect().top > fold) seen.observe(el);
    });
    return () => seen.disconnect();
  }, [root, pathname]);
}

/** The whole page, on the theme's block. */
export function SitePage({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  return <div ref={root} className="site">{children}</div>;
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
