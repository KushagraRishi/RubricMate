import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Landing } from './routes/Landing';

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

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
