import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { MessageCircle, ArrowLeft, Monitor, FileText, ListChecks } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { GoogleDocMock } from '../components/GoogleDocMock';
import { RubricMateSidebar } from '../components/RubricMateSidebar';
import { ChatDrawer } from '../components/ChatDrawer';
import { useRubricMate } from '../lib/useRubricMate';
import { Toaster, toast } from 'sonner';
import { readDocumentFile, FileProblem } from '../lib/readFile';
import { useFileDrop } from '../lib/useFileDrop';

const STEP_LABEL = {
  upload: 'Load a rubric to start',
  checklist: 'Write, then check your draft',
  progress: 'Looking good. Keep going',
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

type Zone = 'assignment' | 'rubric';

/** Where the sidebar starts. Left of it is the document, right of it the checklist. */
const sidebarLeft = () =>
  document.querySelector('[data-drop="rubric"]')?.getBoundingClientRect().left ?? window.innerWidth - 360;

const zoneOf = (e: DragEvent): Zone => (e.clientX >= sidebarLeft() ? 'rubric' : 'assignment');

const problem = (err: unknown) =>
  err instanceof FileProblem ? err.message : 'Could not read that file.';

/**
 * While a file is being dragged, the window shows the two places it can go,
 * lined up with the parts of the page they fill, and lights the one under the
 * pointer. Letting go over the document opens it as the assignment; over the
 * sidebar, as the rubric.
 */
function DropTargets({ zone }: { zone: Zone | null }) {
  const left = zone ? sidebarLeft() : 0;
  const panel = (on: boolean) =>
    `absolute inset-y-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-colors duration-150 ${
      on ? 'border-[#4285F4] bg-blue-50/80' : 'border-gray-300 bg-white/60'
    }`;
  return (
    <AnimatePresence>
      {zone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 bg-white/70 backdrop-blur-sm pointer-events-none"
        >
          <div className={panel(zone === 'assignment')} style={{ left: 24, width: Math.max(left - 36, 0) }}>
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
              <FileText className="w-7 h-7 text-[#4285F4]" />
            </div>
            <p className="text-[#202124]">Drop your assignment</p>
            <p className="text-sm text-[#5f6368]">It opens in the document. PDF, Word, or plain text</p>
          </div>
          <div className={panel(zone === 'rubric')} style={{ left: left + 12, right: 24 }}>
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
              <ListChecks className="w-7 h-7 text-[#4285F4]" />
            </div>
            <p className="text-[#202124]">Drop your rubric</p>
            <p className="text-sm text-[#5f6368] text-center px-4">It becomes your checklist</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Demo() {
  const rm = useRubricMate();
  const [chatOpen, setChatOpen] = useState(false);
  const [narrow, setNarrow] = useState(() => window.innerWidth < 1024);

  // An opened file replaces what is in the editor, so the old text is kept
  // one step back and the toast offers it again.
  const openAssignment = async (file: File) => {
    try {
      const text = await readDocumentFile(file);
      const before = rm.draft;
      rm.setDraft(text);
      toast.success(`Opened ${file.name}`, before.trim()
        ? { action: { label: 'Undo', onClick: () => rm.setDraft(before) } }
        : undefined);
    } catch (err) {
      toast.error(problem(err));
    }
  };

  const openRubric = async (file: File) => {
    if (rm.busy === 'extract') {
      toast('Still reading the last rubric. Try again in a moment.');
      return;
    }
    try {
      await rm.loadRubric(await readDocumentFile(file));
    } catch (err) {
      toast.error(problem(err));
    }
  };

  const zone = useFileDrop<Zone>(
    (file, where) => (where === 'rubric' ? openRubric(file) : openAssignment(file)),
    zoneOf,
    !narrow,
  );

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
        <GoogleDocMock draft={rm.draft} onDraftChange={rm.setDraft} onOpenFile={openAssignment} />

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

        <DropTargets zone={zone} />

        <Toaster position="bottom-center" richColors closeButton />

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
