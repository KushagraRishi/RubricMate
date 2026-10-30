import { Link } from 'react-router';
import { BookCheck, Github } from 'lucide-react';
import { motion, useReducedMotion, useScroll } from 'motion/react';
import { Button } from '../ui/button';

/**
 * The frame every public page shares: the sticky bar, the footer and the
 * section wrapper. Kept in one place so the landing page and the two text
 * pages cannot drift apart.
 */

export const GITHUB = 'https://github.com/KushagraRishi/RubricMate';

/** Same curve as the diagrams, so the site moves as one thing. */
export const EASE = [0.23, 1, 0.32, 1] as const;

export function SiteNav() {
  const { scrollYProgress } = useScroll();
  return (
    <nav className="border-b border-gray-200 px-8 py-3 sticky top-0 bg-white/90 backdrop-blur z-30">
      {/* How far down the page you are, bound straight to the scroll value. */}
      <motion.div
        className="absolute left-0 bottom-0 h-0.5 w-full bg-[#4285F4] origin-left"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
      <div className="max-w-[1100px] mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#4285F4] rounded-lg flex items-center justify-center">
            <BookCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-[#202124]">RubricMate</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            to="/about"
            className="hidden sm:inline-block text-sm text-[#5f6368] hover:text-[#4285F4] transition-colors px-3 py-2"
          >
            Write-up
          </Link>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#5f6368] hover:text-[#4285F4] transition-colors px-3 py-2"
          >
            <Github className="w-4 h-4" />
            Source
          </a>
          <Link to="/demo" className="ml-2">
            <Button className="bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full px-5">Try it</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="px-8 py-10 border-t border-gray-200 bg-[#F1F3F4]">
      <div className="max-w-[720px] mx-auto flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[#202124]">RubricMate</p>
          <p className="text-xs text-[#5f6368]">Built by Kushagra Chaudhary</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#5f6368]">
          <Link to="/about" className="hover:text-[#4285F4] transition-colors">Write-up</Link>
          <Link to="/privacy" className="hover:text-[#4285F4] transition-colors">Privacy</Link>
          <a href={GITHUB} target="_blank" rel="noreferrer" className="hover:text-[#4285F4] transition-colors">
            Source
          </a>
          <Link to="/demo">
            <Button className="bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full px-5">Try the demo</Button>
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function Section({
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
      className={`px-8 py-14 border-t border-gray-200 ${tint ? 'bg-[#fafbfc]' : ''}`}
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

/** The top of a text page: a way back, a title, one line. */
export function PageHead({ title, lede }: { title: string; lede: string }) {
  return (
    <header className="px-8 pt-10 pb-10">
      <div className="max-w-[720px] mx-auto">
        <Link to="/" className="text-sm text-[#5f6368] hover:text-[#4285F4] transition-colors">
          Back to RubricMate
        </Link>
        <h1 className="text-[#202124] text-3xl leading-tight mt-4 mb-2">{title}</h1>
        <p className="text-[#5f6368]">{lede}</p>
      </div>
    </header>
  );
}
