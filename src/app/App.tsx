import { lazy, Suspense } from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { Landing } from './routes/Landing';
import { About } from './routes/About';
import { Privacy } from './routes/Privacy';

/**
 * The landing page is the first thing a stranger loads, and it needs none of
 * the editor, the checklist or the document parsers. Splitting the demo keeps
 * that first paint small; the demo chunk downloads while they read.
 */
const Demo = lazy(() =>
  import('./routes/Demo').then((m) => ({ default: m.Demo })),
);

function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-[#4285F4] rounded-full animate-spin" />
    </div>
  );
}

/** A new page should start at its top, not wherever the last one was scrolled to. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
