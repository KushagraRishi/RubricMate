import {
  BookCheck, Upload, Check, Clock, X, Brain, RefreshCw, AlertCircle, Info,
  ChevronDown, ChevronUp, Loader2, Sparkles, RotateCcw, FileDown,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Criterion } from '../lib/types';
import type { Row, Step } from '../lib/useRubricMate';
import { SAMPLE_RUBRIC } from '../lib/samples';
import { readRubricFile, FileProblem } from '../lib/readFile';
import { useFileDrop } from '../lib/useFileDrop';

interface Props {
  step: Step;
  rows: Row[];
  doneCount: number;
  criteria: Criterion[];
  suggestion: string | null;
  busy: null | 'extract' | 'check';
  error: string | null;
  checkedAt: string;
  onLoadRubric: (text: string) => void;
  onCheck: () => void;
  onReset: () => void;
  onDismissError: () => void;
}

/** Status drives three things: border, background, and badge. Kept in one place. */
const TONE = {
  done: { card: 'border-green-200 bg-green-50', bar: 'bg-green-200', fill: 'bg-[#34A853]', trigger: 'hover:bg-green-100', border: 'border-green-200' },
  in_progress: { card: 'border-blue-200 bg-blue-50', bar: 'bg-blue-200', fill: 'bg-[#4285F4]', trigger: 'hover:bg-blue-100', border: 'border-blue-200' },
  missing: { card: 'border-red-200 bg-red-50', bar: 'bg-red-200', fill: 'bg-red-400', trigger: 'hover:bg-red-100', border: 'border-red-200' },
} as const;

function StatusBadge({ status }: { status: Row['status'] }) {
  if (status === 'done') {
    return (
      <Badge className="bg-[#34A853] hover:bg-[#34A853] text-white border-0 text-xs">
        <Check className="w-3 h-3 mr-1" />
        Done
      </Badge>
    );
  }
  if (status === 'in_progress') {
    return (
      <Badge className="bg-[#4285F4] hover:bg-[#4285F4] text-white border-0 text-xs">
        <Clock className="w-3 h-3 mr-1" />
        In Progress
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="bg-red-100 text-red-800 border-0 text-xs">
      <X className="w-3 h-3 mr-1" />
      Missing
    </Badge>
  );
}

export function RubricMateSidebar({
  step, rows, doneCount, criteria, suggestion, busy, error, checkedAt,
  onLoadRubric, onCheck, onReset, onDismissError,
}: Props) {
  const [manualPasteOpen, setManualPasteOpen] = useState(false);
  const [pasted, setPasted] = useState('');
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const toggleCard = (id: string) =>
    setExpandedCards((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setFileError(null);
    try {
      onLoadRubric(await readRubricFile(file));
    } catch (err) {
      setFileError(err instanceof FileProblem ? err.message : 'Could not read that file.');
    }
  };

  const extracting = busy === 'extract';
  const checking = busy === 'check';

  // Enabled on every step, not only the empty one. A rubric dropped later just
  // replaces the checklist -- and if we ignored it, the browser would open the
  // file and throw the session away.
  const dragging = useFileDrop(handleFile, !extracting);

  return (
    <div className="w-[360px] bg-white border-l border-gray-200 flex flex-col shadow-lg">
      {/* Covers the whole window, so the file can be let go anywhere. */}
      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm p-6 pointer-events-none"
          >
            <div className="w-full h-full border-2 border-dashed border-[#4285F4] rounded-2xl bg-blue-50/60 flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                <FileDown className="w-7 h-7 text-[#4285F4]" />
              </div>
              <p className="text-[#202124]">Drop your rubric</p>
              <p className="text-sm text-[#5f6368]">PDF, Word, or plain text</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4285F4] rounded-lg flex items-center justify-center">
              <BookCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-[#202124]">RubricMate</h2>
              <p className="text-xs text-[#5f6368]">Smart Checklist for Assignments</p>
            </div>
          </div>
          {step !== 'upload' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onReset}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Start over"
                  >
                    <RotateCcw className="w-4 h-4 text-[#5f6368]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent><p className="text-xs">Start over</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {(error || fileError) && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#202124]">{error ?? fileError}</p>
                <button
                  onClick={() => { onDismissError(); setFileError(null); }}
                  className="text-xs text-[#4285F4] hover:underline mt-2"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload */}
        {step === 'upload' && (
          <>
            <div>
              <Card
                className={`border-2 border-dashed p-8 rounded-xl transition-colors ${
                  dragging ? 'border-[#4285F4] bg-blue-50' : 'border-gray-300 bg-[#F1F3F4]'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    {extracting
                      ? <Loader2 className="w-6 h-6 text-[#4285F4] animate-spin" />
                      : <Upload className="w-6 h-6 text-[#4285F4]" />}
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <p className="text-sm text-[#202124]">
                        {extracting
                          ? 'Reading your rubric…'
                          : dragging
                            ? 'Drop it anywhere'
                            : 'Drop your rubric here'}
                      </p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-[#5f6368] cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">PDF, Word, or plain text</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-xs text-[#5f6368]">or pick one and we'll turn it into a checklist</p>
                  </div>

                  <input
                    ref={fileInput}
                    type="file"
                    accept=".pdf,.docx,.txt,.md,text/plain"
                    className="hidden"
                    onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }}
                  />
                  <Button
                    onClick={() => fileInput.current?.click()}
                    disabled={extracting}
                    className="bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full px-6"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose a file
                  </Button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setManualPasteOpen(true)}
                      disabled={extracting}
                      className="text-xs text-[#4285F4] hover:underline disabled:opacity-50"
                    >
                      Paste rubric manually
                    </button>
                    <span className="text-xs text-gray-300">|</span>
                    {/* A real .docx, so the upload path can be tried without
                        having a rubric of your own to hand. */}
                    <a
                      href="/sample-rubric.docx"
                      download
                      className="text-xs text-[#4285F4] hover:underline"
                    >
                      Get a test file
                    </a>
                  </div>
                </div>
              </Card>
            </div>

            {/* No rubric to hand? One click to see the whole thing work. */}
            <Button
              onClick={() => onLoadRubric(SAMPLE_RUBRIC)}
              disabled={extracting}
              variant="outline"
              className="w-full rounded-full border-[#4285F4] text-[#4285F4] hover:bg-blue-50"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Try a sample rubric
            </Button>

            <Dialog open={manualPasteOpen} onOpenChange={setManualPasteOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Paste Rubric Manually</DialogTitle>
                  <DialogDescription className="text-xs text-[#5f6368]">
                    Paste the grading rubric for your assignment.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    value={pasted}
                    onChange={(e) => setPasted(e.target.value)}
                    placeholder="Paste your rubric text here..."
                    className="min-h-[200px] resize-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setManualPasteOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      disabled={!pasted.trim()}
                      onClick={() => { setManualPasteOpen(false); onLoadRubric(pasted); }}
                      className="bg-[#4285F4] hover:bg-[#3367D6] text-white"
                    >
                      Extract Requirements
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Card className="bg-[#F1F3F4] p-6 rounded-xl border-0">
              <div className="space-y-3">
                {[['3/4', 'w-full'], ['2/3', 'w-5/6'], ['4/5', 'w-3/4']].map(([top, bottom], i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border-2 border-gray-300" />
                    <div className="flex-1">
                      <div className={`h-3 bg-gray-300 rounded mb-1 w-${top}`} />
                      <div className={`h-2 bg-gray-200 rounded ${bottom}`} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-[#4285F4] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#202124] mb-1">How it works</p>
                  <p className="text-xs text-[#5f6368]">
                    Load a rubric, write in the doc, then check your draft against it.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Checklist + progress share the same list; only the framing differs. */}
        {step !== 'upload' && (
          <>
            {step === 'checklist' ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Check className="w-4 h-4 text-[#34A853]" />
                  <p className="text-sm text-[#202124]">Rubric read</p>
                </div>
                <p className="text-xs text-[#5f6368]">
                  {criteria.length} {criteria.length === 1 ? 'criterion' : 'criteria'} found
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-[#4285F4]" />
                  <p className="text-sm text-[#202124]">Checked at {checkedAt}</p>
                </div>
                <p className="text-xs text-[#5f6368]">Counts update live as you write</p>
              </div>
            )}

            <div>
              <div className="mb-3">
                <h3 className="text-sm text-[#202124] mb-1.5">Assignment Requirements</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#34A853]" />
                    <span className="text-xs text-[#5f6368]">Done</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#4285F4]" />
                    <span className="text-xs text-[#5f6368]">In Progress</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-xs text-[#5f6368]">Missing</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {rows.map((row) => {
                  const { criterion, status, percent, result, live } = row;
                  const tone = TONE[status];
                  const open = expandedCards.includes(criterion.id);
                  const hasDetail = Boolean(result);
                  const plain = step === 'checklist' && !result && !live;

                  return (
                    <Collapsible
                      key={criterion.id}
                      open={open}
                      onOpenChange={() => hasDetail && toggleCard(criterion.id)}
                    >
                      <Card
                        className={`rounded-xl shadow-sm overflow-hidden border ${
                          plain ? 'border-gray-200' : tone.card
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={status === 'done'}
                              className="mt-0.5 shrink-0 pointer-events-none"
                              tabIndex={-1}
                            />
                            <span className="flex-1 min-w-0 text-sm text-[#202124]">
                              {criterion.name}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {plain ? (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-0 text-xs">
                                  Pending
                                </Badge>
                              ) : (
                                <StatusBadge status={status} />
                              )}
                              {hasDetail && (
                                <CollapsibleTrigger className={`p-1 rounded ${tone.trigger}`}>
                                  {open
                                    ? <ChevronUp className="w-4 h-4 text-[#5f6368]" />
                                    : <ChevronDown className="w-4 h-4 text-[#5f6368]" />}
                                </CollapsibleTrigger>
                              )}
                            </div>
                          </div>

                          <div className="pl-7 mt-1">
                            <p className="text-xs text-[#5f6368]">{live ?? criterion.description}</p>
                            {live && !open && <Progress value={percent} className="h-1.5 mt-2" />}
                            {!plain && !open && !live && (
                              <div className={`mt-2 h-1 rounded-full overflow-hidden ${tone.bar}`}>
                                <div className={`h-full ${tone.fill}`} style={{ width: `${percent}%` }} />
                              </div>
                            )}
                          </div>
                        </div>

                        <CollapsibleContent>
                          <AnimatePresence>
                            {open && result && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`border-t bg-white p-4 ${tone.border}`}
                              >
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-[#5f6368]">AI Score</span>
                                    <span
                                      className={`text-sm ${
                                        status === 'done'
                                          ? 'text-[#34A853]'
                                          : status === 'in_progress'
                                            ? 'text-[#4285F4]'
                                            : 'text-red-600'
                                      }`}
                                    >
                                      {result.score} / 10
                                    </span>
                                  </div>
                                  <Progress value={result.score * 10} className="h-2" />
                                  <p className="text-xs text-[#202124]">{result.feedback}</p>
                                  {result.evidence && (
                                    <p className="text-xs text-[#5f6368] border-l-2 border-gray-200 pl-2 italic">
                                      “{result.evidence}”
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  );
                })}
              </div>
            </div>

            <Card
              className={`p-4 rounded-xl border ${
                step === 'progress'
                  ? 'bg-gradient-to-r from-blue-50 to-green-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#202124]">Overall Progress</span>
                <span className={`text-xs ${doneCount > 0 ? 'text-[#34A853]' : 'text-[#5f6368]'}`}>
                  {doneCount} of {rows.length} completed
                </span>
              </div>
              <Progress
                value={rows.length ? Math.round((doneCount / rows.length) * 100) : 0}
                className="h-2 mb-2"
              />
              <div className="flex items-center gap-1.5">
                {rows.map((row) =>
                  row.status === 'done' ? (
                    <Check key={row.criterion.id} className="w-3.5 h-3.5 text-[#34A853]" />
                  ) : (
                    <div key={row.criterion.id} className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
                  ),
                )}
              </div>
            </Card>

            {suggestion && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <Card className="bg-purple-50 border-2 border-purple-300 p-4 rounded-xl shadow-md">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm text-[#202124] mb-1">Do this next</h4>
                      <p className="text-xs text-[#5f6368] mb-3">{suggestion}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Check button lives in the footer so it is always reachable. */}
      {step !== 'upload' && (
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <Button
            onClick={onCheck}
            disabled={checking}
            className="w-full rounded-full bg-[#4285F4] hover:bg-[#3367D6] text-white"
          >
            {checking ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Checking your draft…</>
            ) : (
              <><RefreshCw className="w-4 h-4 mr-2" />{step === 'progress' ? 'Check again' : 'Check my draft'}</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
