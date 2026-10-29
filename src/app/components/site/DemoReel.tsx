import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  BookCheck, Check, Clock, FileText, FileDown, Loader2, Pause, Play,
  RefreshCw, Brain, ArrowRight,
} from 'lucide-react';
import { Button } from '../ui/button';
import { SAMPLE_DRAFT } from '../../lib/samples';

/**
 * The whole demo, played back at a quarter size, with nobody driving.
 *
 * It is not a screen recording. A recording of this flow is a few megabytes,
 * goes blurry on a retina screen, and is wrong the moment the UI changes. This
 * is the same markup and the same palette as the real thing, scripted off one
 * clock, so it stays sharp, weighs a few kB, and loops forever.
 *
 * Every number in it is the real result of running the sample rubric against
 * the sample essay -- including the three criteria that do not pass.
 */

const BLUE = '#4285F4';
const GREEN = '#34A853';
const INK = '#202124';
const MUTED = '#5f6368';

/** Scene boundaries in ms. One clock, everything derived from it. */
const DROP = 0;
const READ = 1400;
const LIST = 2800;
const TYPE = 4600;
const CHECK = 9000;
const SCORE = 10400;
const NEXT = 12400;
const LOOP = 16600;

const CAPTIONS: [number, string][] = [
  [DROP, 'Drop in the rubric'],
  [READ, 'It reads the rubric'],
  [LIST, 'You get a checklist'],
  [TYPE, 'Counts move as you type'],
  [CHECK, 'Then it checks the draft'],
  [SCORE, 'A score and a reason for each line'],
  [NEXT, 'And one thing to do next'],
];

type Status = 'done' | 'in_progress';

const TONE = {
  done: { card: 'border-green-200 bg-green-50', fill: GREEN, text: 'text-[#34A853]', label: 'Done', Icon: Check },
  in_progress: { card: 'border-blue-200 bg-blue-50', fill: BLUE, text: 'text-[#4285F4]', label: 'In progress', Icon: Clock },
} as const;

const ROWS: { id: string; name: string; pending: string; detail: string; status: Status; percent: number }[] = [
  { id: 'thesis', name: 'Thesis and argument', pending: 'Clear, arguable position', detail: 'Stated in the opening', status: 'done', percent: 90 },
  { id: 'evidence', name: 'Use of evidence', pending: 'At least four sources', detail: '3 of 4 sources', status: 'in_progress', percent: 75 },
  { id: 'structure', name: 'Structure', pending: 'Intro, body, conclusion', detail: 'No conclusion yet', status: 'in_progress', percent: 60 },
  { id: 'length', name: 'Length', pending: '1,000 to 1,500 words', detail: '579 of 1,000 words', status: 'in_progress', percent: 58 },
  { id: 'writing', name: 'Writing quality', pending: 'Grammar and clarity', detail: 'Reads cleanly', status: 'done', percent: 90 },
];

const WORDS = 579;
const SUGGESTION = 'Add a fourth source and a real conclusion, and take the essay past 1,000 words.';

const [TITLE, ...REST] = SAMPLE_DRAFT.split('\n\n');
const BODY = REST.join(' ').slice(0, 540);

const clamp = (n: number) => Math.max(0, Math.min(1, n));

export function DemoReel() {
  const still = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [seen, setSeen] = useState(true);
  // Reduced motion gets the last frame of the story and no clock at all.
  const [t, setT] = useState(still ? NEXT + 600 : 0);

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

  const at = (from: number, to: number) => t >= from && t < to;
  const typed = clamp((t - TYPE) / (CHECK - TYPE));

  const reading = at(READ, LIST);
  const listed = t >= LIST;
  const writing = at(TYPE, CHECK);
  const checking = at(CHECK, SCORE);
  const scored = t >= SCORE;
  const showNext = t >= NEXT;

  const words = writing ? Math.round(WORDS * typed) : t >= CHECK ? WORDS : 0;
  const sources = Math.min(3, Math.floor(typed * 3.6));
  const text = writing ? BODY.slice(0, Math.round(BODY.length * typed)) : t >= CHECK ? BODY : '';

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
                <span className="flex items-center gap-1 text-[10px] text-[#5f6368]">
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
                style={{ transform: showNext ? 'translateY(-62px)' : 'none' }}
              >
              {!listed ? (
                <div
                  className={`rounded-xl border-2 border-dashed p-6 flex flex-col items-center gap-2 transition-colors duration-300 ${
                    t >= 700 && t < READ ? 'border-[#4285F4] bg-blue-50' : 'border-gray-300 bg-[#F1F3F4]'
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
                  // Rows arrive one after another, then each one flips to its
                  // real status on its own beat. Five things changing at once
                  // reads as a flicker.
                  const inAt = LIST + i * 220;
                  const scoreAt = SCORE + i * 220;
                  if (t < inAt) return <div key={row.id} className="h-[59px]" />;
                  const lit = t >= scoreAt;
                  const tone = TONE[row.status];
                  return (
                    <motion.div
                      key={row.id}
                      initial={still ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`rounded-lg border p-2 transition-colors duration-500 ${
                        lit ? tone.card : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-sm border flex items-center justify-center shrink-0"
                          style={{
                            borderColor: lit && row.status === 'done' ? GREEN : '#c6c9cc',
                            background: lit && row.status === 'done' ? GREEN : 'transparent',
                          }}
                        >
                          {lit && row.status === 'done' && <Check className="w-2.5 h-2.5 text-white" />}
                        </span>
                        <span className="flex-1 text-[10px] truncate" style={{ color: INK }}>{row.name}</span>
                        {lit ? (
                          <span
                            className="text-[8px] px-1.5 py-0.5 rounded-full text-white flex items-center gap-0.5 shrink-0"
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
                          {lit ? row.detail : row.pending}
                        </p>
                        <div className="h-1 rounded-full bg-gray-100 mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-[width] duration-700 ease-out"
                            style={{ width: lit ? `${row.percent}%` : '0%', background: tone.fill }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}

              <AnimatePresence>
                {showNext && (
                  <motion.div
                    initial={still ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-lg border-2 border-purple-300 bg-purple-50 p-2 flex gap-2"
                  >
                    <Brain className="w-3 h-3 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px]" style={{ color: INK }}>Do this next</p>
                      <p className="text-[9px] leading-snug" style={{ color: MUTED }}>{SUGGESTION}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
            {!still && at(DROP, READ) && (
              <motion.div
                initial={{ opacity: 0, x: -120, y: -40, scale: 0.9, rotate: -8 }}
                animate={{ opacity: [0, 1, 1, 0], x: 0, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.3, ease: 'easeInOut', times: [0, 0.2, 0.8, 1] }}
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

      <div className="flex items-center justify-between gap-4 mt-4 flex-wrap">
        <div className="flex items-center gap-3">
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
            {' — '}real output, no sign-up
          </p>
        </div>

        <Link to="/demo">
          <Button variant="outline" className="rounded-full border-gray-300 h-9">
            Try it yourself
            <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
