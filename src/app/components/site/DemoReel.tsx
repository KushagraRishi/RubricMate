import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  BookCheck, Check, Clock, X, FileText, FileDown, Loader2, Pause, Play,
  RefreshCw, Brain,
} from 'lucide-react';
import { SAMPLE_DRAFT } from '../../lib/samples';

/**
 * The whole demo, played back at a quarter size, with nobody driving.
 *
 * It is not a screen recording. A recording of this flow is a few megabytes,
 * goes blurry on a retina screen, and is wrong the moment the UI changes. This
 * is the same markup and the same palette as the real thing, scripted off one
 * clock, so it stays sharp, weighs a few kB, and loops forever.
 *
 * It plays the real shape of the product, not a highlight reel. The two
 * criteria that can be counted -- words and sources -- tick over while the
 * essay is still being typed, because in the real app they are counted in the
 * browser on every keystroke. The three that need a judgement sit there
 * pending until the model is actually called. Watching those two halves move
 * at different times is the clearest way to show the idea the app is built on.
 */

const BLUE = '#4285F4';
const GREEN = '#34A853';
const INK = '#202124';
const MUTED = '#5f6368';

/** Scene boundaries in ms. One clock, everything derived from it. */
const DROP = 0;
const READ = 1300;
const LIST = 2600;
const TYPE = 4200;
const CHECK = 8400;
const SCORE = 9600;
const NEXT = 11600;
const FIX = 13400;
const RECHECK = 16600;
const DONE = 17800;
const LOOP = 21600;

const CAPTIONS: [number, string][] = [
  [DROP, 'Drop in the rubric'],
  [READ, 'It reads the rubric'],
  [LIST, 'You get a checklist'],
  [TYPE, 'Words and sources tick off as you type'],
  [CHECK, 'The AI reads the rest'],
  [SCORE, 'A score and a reason for each line'],
  [NEXT, 'And one thing to do next'],
  [FIX, 'Do it, and keep writing'],
  [RECHECK, 'Check again'],
  [DONE + 700, 'All five met'],
];

type Status = 'done' | 'in_progress' | 'missing';

const TONE = {
  done: { card: 'border-green-200 bg-green-50', fill: GREEN, label: 'Done', Icon: Check },
  in_progress: { card: 'border-blue-200 bg-blue-50', fill: BLUE, label: 'In progress', Icon: Clock },
  missing: { card: 'border-red-200 bg-red-50', fill: '#f87171', label: 'Missing', Icon: X },
} as const;

/** Where the first draft lands, and where the revision takes it. */
const DRAFT_WORDS = 579;
const FINAL_WORDS = 1040;
const NEED_WORDS = 1000;
const NEED_SOURCES = 4;

const SUGGESTION = 'Add a fourth source and a real conclusion, and take the essay past 1,000 words.';

const [TITLE, ...REST] = SAMPLE_DRAFT.split('\n\n');
const BODY = REST.join(' ');
const FIRST = BODY.slice(0, 520);
const SECOND = BODY.slice(520, 900);

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const pct = (have: number, need: number) => Math.min(100, Math.round((have / need) * 100));

interface View {
  lit: boolean;
  status: Status;
  detail: string;
  percent: number;
}

export function DemoReel() {
  const still = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [seen, setSeen] = useState(true);
  // Reduced motion gets the last frame of the story and no clock at all.
  const [t, setT] = useState(still ? DONE + 800 : 0);

  // Nothing animates while it is scrolled past. A loop running in a tab nobody
  // is looking at is just battery.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = playing && seen && !still;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setT((x) => (x + 40) % LOOP), 40);
    return () => clearInterval(id);
  }, [running]);

  const between = (from: number, to: number) => t >= from && t < to;

  const typed = clamp((t - TYPE) / (CHECK - TYPE));
  const rewritten = clamp((t - FIX) / (RECHECK - FIX));

  const reading = between(READ, LIST);
  const listed = t >= LIST;
  const writing = between(TYPE, CHECK) || between(FIX, RECHECK);
  const checking = between(CHECK, SCORE) || between(RECHECK, DONE);
  const scored = t >= SCORE;

  // The counters. These are the half of the rubric the browser can settle on
  // its own, so they move while the typing is still happening.
  const words =
    t < TYPE ? 0
      : t < FIX ? Math.round(DRAFT_WORDS * typed)
        : Math.round(DRAFT_WORDS + (FINAL_WORDS - DRAFT_WORDS) * rewritten);
  const sources =
    t < TYPE ? 0
      : t < FIX ? Math.min(3, Math.floor(typed * 3.6))
        : rewritten > 0.5 ? 4 : 3;

  const text =
    t < TYPE ? ''
      : t < FIX ? FIRST.slice(0, Math.round(FIRST.length * typed))
        : FIRST + SECOND.slice(0, Math.round(SECOND.length * rewritten));

  const counted = (have: number, need: number, noun: string): View => ({
    lit: t >= TYPE,
    status: have >= need ? 'done' : have === 0 ? 'missing' : 'in_progress',
    detail: `${have.toLocaleString()} of ${need.toLocaleString()} ${noun}`,
    percent: pct(have, need),
  });

  /** A criterion only a model can settle: nothing until it has been asked. */
  const judged = (i: number, first: [Status, string, number], final: [Status, string, number]): View => {
    const after = t >= DONE + i * 150 ? final : first;
    return {
      lit: t >= SCORE + i * 180,
      status: after[0],
      detail: after[1],
      percent: after[2],
    };
  };

  const views: Record<string, View> = {
    thesis: judged(0, ['done', 'Stated in the opening', 90], ['done', 'Stated in the opening', 90]),
    evidence: counted(sources, NEED_SOURCES, 'sources'),
    structure: judged(1, ['in_progress', 'No conclusion yet', 60], ['done', 'Conclusion added', 90]),
    length: counted(words, NEED_WORDS, 'words'),
    writing: judged(2, ['done', 'Reads cleanly', 90], ['done', 'Reads cleanly', 90]),
  };

  const ROWS = [
    { id: 'thesis', name: 'Thesis and argument', pending: 'Clear, arguable position' },
    { id: 'evidence', name: 'Use of evidence', pending: 'At least four sources' },
    { id: 'structure', name: 'Structure', pending: 'Intro, body, conclusion' },
    { id: 'length', name: 'Length', pending: '1,000 to 1,500 words' },
    { id: 'writing', name: 'Writing quality', pending: 'Grammar and clarity' },
  ];

  const allDone = t >= DONE + 500;
  const showCard = t >= NEXT;
  const caption = CAPTIONS.filter(([ms]) => t >= ms).pop()?.[1] ?? CAPTIONS[0][1];

  return (
    <div className="max-w-[980px] mx-auto px-8">
      <div
        ref={frame}
        className="rounded-2xl border border-gray-200 shadow-xl overflow-hidden bg-white"
      >
        {/* Browser chrome, so it reads as a screen and not a drawing. */}
        <div className="h-9 bg-[#F1F3F4] border-b border-gray-200 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-full px-3 py-0.5 text-[10px] text-[#5f6368] border border-gray-200">
              rubric-mate.vercel.app/demo
            </div>
          </div>
        </div>

        <div className="flex h-[500px] relative">
          {/* The document */}
          <div className="flex-1 bg-[#F1F3F4] p-5 overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm h-full px-7 py-5 overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
                <span className="text-[10px] text-[#5f6368]">Untitled document</span>
                <span
                  className="flex items-center gap-1 text-[10px] transition-colors duration-300"
                  style={{ color: writing ? INK : MUTED }}
                >
                  <FileText className="w-3 h-3" style={{ color: GREEN }} />
                  {words.toLocaleString()} words
                  {sources > 0 && ` · ${sources} sources`}
                </span>
              </div>

              {t >= TYPE ? (
                <>
                  <p className="text-[11px] mb-2" style={{ color: INK }}>{TITLE}</p>
                  <p className="text-[10px] leading-[1.7]" style={{ color: MUTED }}>
                    {text}
                    {writing && <span className="inline-block w-[1px] h-[10px] align-middle bg-[#4285F4] animate-pulse ml-px" />}
                  </p>
                </>
              ) : (
                <p className="text-[10px]" style={{ color: '#9aa0a6' }}>
                  Start writing your assignment here…
                </p>
              )}
            </div>
          </div>

          {/* The sidebar */}
          <div className="w-[272px] border-l border-gray-200 bg-white flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: BLUE }}>
                <BookCheck className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-[11px]" style={{ color: INK }}>RubricMate</p>
                <p className="text-[9px]" style={{ color: MUTED }}>Smart Checklist for Assignments</p>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-hidden relative">
              {/* The row that scrolls out fades rather than being sliced. */}
              <div className="absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
              <div
                className="space-y-2 transition-transform duration-700 ease-out"
                style={{ transform: showCard ? 'translateY(-62px)' : 'none' }}
              >
              {!listed ? (
                <div
                  className={`rounded-xl border-2 border-dashed p-6 flex flex-col items-center gap-2 transition-colors duration-300 ${
                    t >= 650 && t < READ ? 'border-[#4285F4] bg-blue-50' : 'border-gray-300 bg-[#F1F3F4]'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                    {reading
                      ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: BLUE }} />
                      : <FileDown className="w-4 h-4" style={{ color: BLUE }} />}
                  </div>
                  <p className="text-[11px]" style={{ color: INK }}>
                    {reading ? 'Reading your rubric…' : 'Drop your rubric here'}
                  </p>
                  <p className="text-[9px]" style={{ color: MUTED }}>PDF, Word, or plain text</p>
                </div>
              ) : (
                ROWS.map((row, i) => {
                  // Rows arrive one after another. Five things appearing at
                  // once reads as a flicker rather than a list being built.
                  const inAt = LIST + i * 200;
                  if (t < inAt) return <div key={row.id} className="h-[59px]" />;

                  const view = views[row.id];
                  const tone = TONE[view.status];
                  return (
                    <motion.div
                      key={row.id}
                      initial={still ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`rounded-lg border p-2 transition-colors duration-500 ${
                        view.lit ? tone.card : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-sm border flex items-center justify-center shrink-0 transition-colors duration-300"
                          style={{
                            borderColor: view.lit && view.status === 'done' ? GREEN : '#c6c9cc',
                            background: view.lit && view.status === 'done' ? GREEN : 'transparent',
                          }}
                        >
                          {view.lit && view.status === 'done' && <Check className="w-2.5 h-2.5 text-white" />}
                        </span>
                        <span className="flex-1 text-[10px] truncate" style={{ color: INK }}>{row.name}</span>
                        {view.lit ? (
                          <span
                            className="text-[8px] px-1.5 py-0.5 rounded-full text-white flex items-center gap-0.5 shrink-0 transition-colors duration-300"
                            style={{ background: tone.fill }}
                          >
                            <tone.Icon className="w-2 h-2" />
                            {tone.label}
                          </span>
                        ) : (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 shrink-0">
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="pl-5 mt-1">
                        <p className="text-[9px] truncate" style={{ color: MUTED }}>
                          {view.lit ? view.detail : row.pending}
                        </p>
                        <div className="h-1 rounded-full bg-gray-100 mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-[width,background-color] duration-300 ease-out"
                            style={{ width: view.lit ? `${view.percent}%` : '0%', background: tone.fill }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}

              {showCard && (
                <motion.div
                  initial={still ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-lg border-2 p-2 flex gap-2 transition-colors duration-500 ${
                    allDone ? 'border-green-300 bg-green-50' : 'border-purple-300 bg-purple-50'
                  }`}
                >
                  {allDone
                    ? <Check className="w-3 h-3 shrink-0 mt-0.5" style={{ color: GREEN }} />
                    : <Brain className="w-3 h-3 text-purple-600 shrink-0 mt-0.5" />}
                  <div>
                    <p className="text-[10px]" style={{ color: INK }}>
                      {allDone ? 'All five met' : 'Do this next'}
                    </p>
                    <p className="text-[9px] leading-snug" style={{ color: MUTED }}>
                      {allDone ? '1,040 words, 4 sources, and a conclusion.' : SUGGESTION}
                    </p>
                  </div>
                </motion.div>
              )}
              </div>
            </div>

            {listed && (
              <div className="px-4 py-3 border-t border-gray-200">
                <div
                  className="rounded-full h-7 flex items-center justify-center gap-1.5 text-[10px] text-white transition-transform duration-200"
                  style={{ background: checking ? '#3367D6' : BLUE, transform: checking ? 'scale(0.97)' : 'none' }}
                >
                  {checking
                    ? <><Loader2 className="w-3 h-3 animate-spin" />Checking your draft…</>
                    : <><RefreshCw className="w-3 h-3" />{scored ? 'Check again' : 'Check my draft'}</>}
                </div>
              </div>
            )}
          </div>

          {/* The file being dragged in. Mounted only for its scene, so it
              replays itself on every loop without any bookkeeping. */}
          <AnimatePresence>
            {!still && between(DROP, READ) && (
              <motion.div
                initial={{ opacity: 0, x: -120, y: -40, scale: 0.9, rotate: -8 }}
                animate={{ opacity: [0, 1, 1, 0], x: 0, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeInOut', times: [0, 0.2, 0.8, 1] }}
                className="absolute top-[96px] right-[150px] pointer-events-none"
              >
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" style={{ color: BLUE }} />
                  <span className="text-[10px]" style={{ color: INK }}>HIST-201-rubric.docx</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Where we are in the loop. */}
        <div className="h-0.5 bg-gray-100">
          <div
            className="h-full"
            style={{ width: `${(t / LOOP) * 100}%`, background: BLUE, transition: 'width 40ms linear' }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-2">
          {!still && (
            <button
              onClick={() => setPlaying((p) => !p)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
              aria-label={playing ? 'Pause the demo' : 'Play the demo'}
            >
              {playing
                ? <Pause className="w-3.5 h-3.5" style={{ color: MUTED }} />
                : <Play className="w-3.5 h-3.5 ml-0.5" style={{ color: MUTED }} />}
            </button>
          )}
        <p className="text-sm" style={{ color: MUTED }}>
          <span style={{ color: INK }}>{caption}</span>
          {'. '}Real output, no sign-up.
        </p>
      </div>
    </div>
  );
}
