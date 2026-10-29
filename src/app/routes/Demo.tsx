import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { MessageCircle, ArrowLeft, Monitor } from 'lucide-react';
import { Button } from '../components/ui/button';
import { GoogleDocMock } from '../components/GoogleDocMock';
import { RubricMateSidebar } from '../components/RubricMateSidebar';
import { ChatDrawer } from '../components/ChatDrawer';
import { useRubricMate } from '../lib/useRubricMate';

const STEP_LABEL = {
  upload: 'Load a rubric to start',
  checklist: 'Write, then check your draft',
  progress: 'Keep writing. Counts update live',
} as const;

/**
 * The demo is a document beside a 360px sidebar. That is the design, and it
 * does not fold down to a phone in any way worth shipping -- so a phone gets an
 * honest signpost instead of a broken layout.
 */
function TooNarrow() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 text-center gap-4">
      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
        <Monitor className="w-6 h-6 text-[#4285F4]" />
      </div>
      <h1 className="text-[#202124]">Open this on a laptop</h1>
      <p className="text-sm text-[#5f6368] max-w-[280px]">
        The demo puts your document next to the checklist, so it needs a wider screen.
      </p>
      <Link to="/" className="text-sm text-[#4285F4] hover:underline">
        Read how it was built
      </Link>
    </div>
  );
}

export function Demo() {
  const rm = useRubricMate();
  const [chatOpen, setChatOpen] = useState(false);
  const [narrow, setNarrow] = useState(() => window.innerWidth < 1024);

  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (narrow) return <TooNarrow />;

  return (
    <div className="h-screen overflow-hidden bg-white flex flex-col">
      <header className="bg-[#F1F3F4] border-b border-gray-200 px-8 py-3 shrink-0">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-[#5f6368] hover:text-[#4285F4] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            RubricMate
          </Link>
          <p className="text-xs text-[#5f6368]">{STEP_LABEL[rm.step]}</p>
        </div>
      </header>

      <div className="flex-1 max-w-[1440px] w-full mx-auto flex relative min-h-0">
        <GoogleDocMock
          draft={rm.draft}
          onDraftChange={rm.setDraft}
          words={rm.words}
          citations={rm.citations}
        />

        <RubricMateSidebar
          step={rm.step}
          rows={rm.rows}
          doneCount={rm.doneCount}
          criteria={rm.criteria}
          suggestion={rm.suggestion}
          busy={rm.busy}
          error={rm.error}
          checkedAt={rm.checkedAt}
          onLoadRubric={rm.loadRubric}
          onCheck={rm.runCheck}
          onReset={rm.reset}
          onDismissError={rm.dismissError}
        />

        <Button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-8 right-[392px] w-14 h-14 rounded-full bg-[#4285F4] hover:bg-[#3367D6] text-white shadow-lg z-20"
          aria-label="Ask RubricMate"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>

        <ChatDrawer
          open={chatOpen}
          onOpenChange={setChatOpen}
          draft={rm.draft}
          criteria={rm.criteria}
        />
      </div>
    </div>
  );
}
