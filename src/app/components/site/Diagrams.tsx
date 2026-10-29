import { motion, useReducedMotion } from 'motion/react';

/**
 * Inline SVG rather than images: these stay sharp, weigh nothing, and are
 * written in the same palette as the app, so the page reads as one thing.
 *
 * Each viewBox is kept narrow with large type, because a wide diagram scaled
 * down to a phone turns its own labels into grey fuzz.
 */

const BLUE = '#4285F4';
const GREEN = '#34A853';
const INK = '#202124';
const MUTED = '#5f6368';
const SURFACE = '#F1F3F4';
const LINE = '#dadce0';

/** Fades a diagram in once, and not at all for anyone who asked for less motion. */
function Reveal({ children }: { children: React.ReactNode }) {
  const still = useReducedMotion();
  return (
    <motion.div
      initial={still ? false : { opacity: 0, y: 12 }}
      whileInView={still ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function Box({
  x, y, w, h, fill, stroke,
}: { x: number; y: number; w: number; h: number; fill: string; stroke: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={12} fill={fill} stroke={stroke} strokeWidth={1.5} />;
}

/** The one idea worth a picture: what gets counted and what gets read. */
export function SplitDiagram() {
  return (
    <Reveal>
      <svg viewBox="0 0 640 330" className="w-full h-auto" role="img"
           aria-label="Countable criteria are measured in the browser on every keystroke; judgement criteria go to the model when you press check.">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={LINE} />
          </marker>
        </defs>

        <Box x={200} y={8} w={240} h={46} fill={SURFACE} stroke={LINE} />
        <text x={320} y={37} textAnchor="middle" fontSize={17} fill={INK}>Your rubric, as a checklist</text>

        <path d="M 320 54 L 320 76" stroke={LINE} strokeWidth={1.5} fill="none" />
        <path d="M 320 76 L 160 76 L 160 100" stroke={LINE} strokeWidth={1.5} fill="none" markerEnd="url(#arrow)" />
        <path d="M 320 76 L 480 76 L 480 100" stroke={LINE} strokeWidth={1.5} fill="none" markerEnd="url(#arrow)" />

        {/* Countable */}
        <Box x={30} y={102} w={260} h={92} fill="#e8f0fe" stroke="#c6dafc" />
        <text x={160} y={128} textAnchor="middle" fontSize={17} fill={BLUE}>Can be counted</text>
        <text x={160} y={153} textAnchor="middle" fontSize={15} fill={MUTED}>“At least 1,000 words”</text>
        <text x={160} y={175} textAnchor="middle" fontSize={15} fill={MUTED}>“Cite four sources”</text>

        {/* Judgement */}
        <Box x={350} y={102} w={260} h={92} fill="#f3e8fd" stroke="#e0ccf5" />
        <text x={480} y={128} textAnchor="middle" fontSize={17} fill="#8430ce">Needs reading</text>
        <text x={480} y={153} textAnchor="middle" fontSize={15} fill={MUTED}>“Is the thesis arguable?”</text>
        <text x={480} y={175} textAnchor="middle" fontSize={15} fill={MUTED}>“Is there a conclusion?”</text>

        <path d="M 160 194 L 160 228" stroke={LINE} strokeWidth={1.5} fill="none" markerEnd="url(#arrow)" />
        <path d="M 480 194 L 480 228" stroke={LINE} strokeWidth={1.5} fill="none" markerEnd="url(#arrow)" />

        <Box x={30} y={230} w={260} h={82} fill="#ffffff" stroke={LINE} />
        <text x={160} y={256} textAnchor="middle" fontSize={16} fill={INK}>In your browser</text>
        <text x={160} y={279} textAnchor="middle" fontSize={14} fill={MUTED}>every keystroke</text>
        <text x={160} y={300} textAnchor="middle" fontSize={14} fill={GREEN}>instant · free · exact</text>

        <Box x={350} y={230} w={260} h={82} fill="#ffffff" stroke={LINE} />
        <text x={480} y={256} textAnchor="middle" fontSize={16} fill={INK}>One model call</text>
        <text x={480} y={279} textAnchor="middle" fontSize={14} fill={MUTED}>when you press check</text>
        <text x={480} y={300} textAnchor="middle" fontSize={14} fill={MUTED}>a few seconds · 0.8¢</text>
      </svg>
    </Reveal>
  );
}

/** Where the work happens, and where the key is not. */
export function ArchitectureDiagram() {
  const routes = [
    { y: 120, name: '/api/extract', model: 'Haiku 5.5' },
    { y: 170, name: '/api/check', model: 'Sonnet 5.5' },
    { y: 220, name: '/api/chat', model: 'Haiku 5.5' },
  ];

  return (
    <Reveal>
      <svg viewBox="0 0 640 300" className="w-full h-auto" role="img"
           aria-label="The browser parses files and counts; three serverless functions hold the API key and call Claude.">
        <defs>
          <marker id="arrow2" viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={LINE} />
          </marker>
        </defs>

        <text x={95} y={24} textAnchor="middle" fontSize={14} fill={MUTED}>BROWSER</text>
        <text x={320} y={24} textAnchor="middle" fontSize={14} fill={MUTED}>VERCEL</text>
        <text x={560} y={24} textAnchor="middle" fontSize={14} fill={MUTED}>ANTHROPIC</text>

        <Box x={10} y={40} w={170} h={230} fill={SURFACE} stroke={LINE} />
        <text x={95} y={76} textAnchor="middle" fontSize={15} fill={INK}>PDF, Word → text</text>
        <text x={95} y={104} textAnchor="middle" fontSize={15} fill={INK}>word + source counts</text>
        <text x={95} y={132} textAnchor="middle" fontSize={15} fill={INK}>the editor</text>
        <line x1={30} y1={158} x2={160} y2={158} stroke={LINE} strokeWidth={1} />
        <text x={95} y={186} textAnchor="middle" fontSize={14} fill={GREEN}>no key here</text>
        <text x={95} y={224} textAnchor="middle" fontSize={13} fill={MUTED}>parsers load only</text>
        <text x={95} y={243} textAnchor="middle" fontSize={13} fill={MUTED}>if you upload</text>

        <Box x={210} y={40} w={220} h={230} fill="#ffffff" stroke={LINE} />
        {routes.map((r) => (
          <g key={r.name}>
            <rect x={228} y={r.y - 20} width={184} height={34} rx={8} fill="#e8f0fe" />
            <text x={320} y={r.y + 2} textAnchor="middle" fontSize={15} fill={BLUE} fontFamily="ui-monospace, monospace">
              {r.name}
            </text>
          </g>
        ))}
        <text x={320} y={76} textAnchor="middle" fontSize={14} fill={MUTED}>serverless functions</text>
        <text x={320} y={256} textAnchor="middle" fontSize={14} fill={GREEN}>the key lives here</text>

        <Box x={460} y={40} w={170} h={230} fill={SURFACE} stroke={LINE} />
        {routes.map((r) => (
          <g key={r.y}>
            <path d={`M 430 ${r.y - 3} L 458 ${r.y - 3}`} stroke={LINE} strokeWidth={1.5}
                  fill="none" markerEnd="url(#arrow2)" />
            <text x={545} y={r.y + 2} textAnchor="middle" fontSize={15} fill={INK}>{r.model}</text>
          </g>
        ))}
        <text x={545} y={76} textAnchor="middle" fontSize={14} fill={MUTED}>one model per job</text>
      </svg>
    </Reveal>
  );
}

/** Three bars. The point lands faster than a paragraph would. */
export function CostChart() {
  const still = useReducedMotion();
  const bars = [
    { label: 'Opus on all three routes', cents: 8.3, color: '#c6dafc' },
    { label: 'One model per route', cents: 1.97, color: '#8ab4f8' },
    { label: '+ caching, no reasoning on extract', cents: 1.64, color: BLUE },
  ];
  const max = 8.3;
  const width = 430;

  return (
    <Reveal>
      <svg viewBox="0 0 640 210" className="w-full h-auto" role="img"
           aria-label="Cost per session fell from 8.3 cents on Opus throughout to 1.64 cents.">
        {bars.map((bar, i) => {
          const y = 30 + i * 60;
          const w = (bar.cents / max) * width;
          return (
            <g key={bar.label}>
              <text x={0} y={y - 8} fontSize={15} fill={MUTED}>{bar.label}</text>
              <rect x={0} y={y} width={width} height={22} rx={6} fill={SURFACE} />
              <motion.rect
                x={0} y={y} height={22} rx={6} fill={bar.color}
                initial={still ? false : { width: 0 }}
                whileInView={still ? undefined : { width: w }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: 'easeOut' }}
                width={still ? w : undefined}
              />
              <text x={width + 14} y={y + 17} fontSize={17} fill={i === 2 ? BLUE : INK}>
                {bar.cents.toFixed(2)}¢
              </text>
            </g>
          );
        })}
        <text x={0} y={200} fontSize={14} fill={MUTED}>
          per session · one rubric, two checks, two questions
        </text>
      </svg>
    </Reveal>
  );
}
