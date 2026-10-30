import { motion, useReducedMotion, type Variants } from 'motion/react';

/**
 * Inline SVG rather than images: these stay sharp, weigh nothing, and are
 * written in the same palette as the app, so the page reads as one thing.
 *
 * Each viewBox is kept narrow with large type, because a wide diagram scaled
 * down to a phone turns its own labels into grey fuzz.
 *
 * The motion here is doing a job rather than decorating. Each diagram builds
 * itself in the order the idea is read: the rubric arrives, it splits, and
 * only then do the two halves get their outcomes. A reader who watches that
 * happen does not need the paragraph underneath, which is the whole reason
 * these replaced six paragraphs in the first place.
 */

const BLUE = '#4285F4';
const GREEN = '#34A853';
const INK = '#202124';
const MUTED = '#5f6368';
const SURFACE = '#F1F3F4';
const LINE = '#dadce0';

/** The strong ease-out. The built-in one is too weak to read as deliberate. */
const EASE = [0.23, 1, 0.32, 1] as const;

const stage: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

/** A part of a diagram arriving. Transform and opacity only. */
const part: Variants = {
  hidden: { opacity: 0, transform: 'translateY(10px)' },
  shown: { opacity: 1, transform: 'translateY(0px)', transition: { duration: 0.42, ease: EASE } },
};

/** A connector drawing itself from start to end. */
const line: Variants = {
  hidden: { opacity: 0, pathLength: 0 },
  shown: { opacity: 1, pathLength: 1, transition: { duration: 0.45, ease: EASE } },
};

/** A bar filling from its left edge. scaleX, never width, so it stays on the GPU. */
const bar: Variants = {
  hidden: { transform: 'scaleX(0)' },
  shown: { transform: 'scaleX(1)', transition: { duration: 0.6, ease: EASE } },
};

/** SVG children need an explicit box for transforms to mean viewBox units. */
const svgBox = { transformBox: 'view-box', transformOrigin: 'center' } as const;

/**
 * Runs a diagram's build once, when it comes into view. Anyone who asked for
 * less motion gets the finished picture immediately instead.
 */
function Stage({
  children, label, viewBox,
}: { children: React.ReactNode; label: string; viewBox: string }) {
  const still = useReducedMotion();
  return (
    <motion.svg
      viewBox={viewBox}
      className="w-full h-auto"
      role="img"
      aria-label={label}
      variants={stage}
      initial={still ? 'shown' : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.svg>
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
    <Stage viewBox="0 0 640 330" label="Countable criteria are measured in the browser on every keystroke; judgement criteria go to the model when you press check.">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={LINE} />
        </marker>
      </defs>

      <motion.g variants={part} style={svgBox}>
        <Box x={200} y={8} w={240} h={46} fill={SURFACE} stroke={LINE} />
        <text x={320} y={37} textAnchor="middle" fontSize={17} fill={INK}>Your rubric, as a checklist</text>
      </motion.g>

      <motion.g variants={line}>
        <motion.path d="M 320 54 L 320 76" stroke={LINE} strokeWidth={1.5} fill="none" variants={line} />
        <motion.path d="M 320 76 L 160 76 L 160 100" stroke={LINE} strokeWidth={1.5} fill="none"
                     markerEnd="url(#arrow)" variants={line} />
        <motion.path d="M 320 76 L 480 76 L 480 100" stroke={LINE} strokeWidth={1.5} fill="none"
                     markerEnd="url(#arrow)" variants={line} />
      </motion.g>

      <motion.g variants={part} style={svgBox}>
        <Box x={30} y={102} w={260} h={92} fill="#e8f0fe" stroke="#c6dafc" />
        <text x={160} y={128} textAnchor="middle" fontSize={17} fill={BLUE}>Can be counted</text>
        <text x={160} y={153} textAnchor="middle" fontSize={15} fill={MUTED}>“At least 1,000 words”</text>
        <text x={160} y={175} textAnchor="middle" fontSize={15} fill={MUTED}>“Cite four sources”</text>
      </motion.g>

      <motion.g variants={part} style={svgBox}>
        <Box x={350} y={102} w={260} h={92} fill="#f3e8fd" stroke="#e0ccf5" />
        <text x={480} y={128} textAnchor="middle" fontSize={17} fill="#8430ce">Needs reading</text>
        <text x={480} y={153} textAnchor="middle" fontSize={15} fill={MUTED}>“Is the thesis arguable?”</text>
        <text x={480} y={175} textAnchor="middle" fontSize={15} fill={MUTED}>“Is there a conclusion?”</text>
      </motion.g>

      <motion.g variants={line}>
        <motion.path d="M 160 194 L 160 228" stroke={LINE} strokeWidth={1.5} fill="none"
                     markerEnd="url(#arrow)" variants={line} />
        <motion.path d="M 480 194 L 480 228" stroke={LINE} strokeWidth={1.5} fill="none"
                     markerEnd="url(#arrow)" variants={line} />
      </motion.g>

      <motion.g variants={part} style={svgBox}>
        <Box x={30} y={230} w={260} h={82} fill="#ffffff" stroke={LINE} />
        <text x={160} y={256} textAnchor="middle" fontSize={16} fill={INK}>In your browser</text>
        <text x={160} y={279} textAnchor="middle" fontSize={14} fill={MUTED}>every keystroke</text>
        <text x={160} y={300} textAnchor="middle" fontSize={14} fill={GREEN}>instant · free · exact</text>
      </motion.g>

      <motion.g variants={part} style={svgBox}>
        <Box x={350} y={230} w={260} h={82} fill="#ffffff" stroke={LINE} />
        <text x={480} y={256} textAnchor="middle" fontSize={16} fill={INK}>One model call</text>
        <text x={480} y={279} textAnchor="middle" fontSize={14} fill={MUTED}>when you press check</text>
        <text x={480} y={300} textAnchor="middle" fontSize={14} fill={MUTED}>a few seconds · 0.8¢</text>
      </motion.g>
    </Stage>
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
    <Stage viewBox="0 0 640 300" label="The browser parses files and counts; three serverless functions hold the API key and call Claude.">
      <defs>
        <marker id="arrow2" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={LINE} />
        </marker>
      </defs>

      {/* Left to right, the way a request actually travels. */}
      <motion.g variants={part} style={svgBox}>
        <text x={95} y={24} textAnchor="middle" fontSize={14} fill={MUTED}>BROWSER</text>
        <Box x={10} y={40} w={170} h={230} fill={SURFACE} stroke={LINE} />
        <text x={95} y={76} textAnchor="middle" fontSize={15} fill={INK}>PDF, Word → text</text>
        <text x={95} y={104} textAnchor="middle" fontSize={15} fill={INK}>word + source counts</text>
        <text x={95} y={132} textAnchor="middle" fontSize={15} fill={INK}>the editor</text>
        <line x1={30} y1={158} x2={160} y2={158} stroke={LINE} strokeWidth={1} />
        <text x={95} y={186} textAnchor="middle" fontSize={14} fill={GREEN}>no key here</text>
        <text x={95} y={224} textAnchor="middle" fontSize={13} fill={MUTED}>parsers load only</text>
        <text x={95} y={243} textAnchor="middle" fontSize={13} fill={MUTED}>if you upload</text>
      </motion.g>

      <motion.g variants={part} style={svgBox}>
        <text x={320} y={24} textAnchor="middle" fontSize={14} fill={MUTED}>VERCEL</text>
        <Box x={210} y={40} w={220} h={230} fill="#ffffff" stroke={LINE} />
        <text x={320} y={76} textAnchor="middle" fontSize={14} fill={MUTED}>serverless functions</text>
        <text x={320} y={256} textAnchor="middle" fontSize={14} fill={GREEN}>the key lives here</text>
      </motion.g>

      {routes.map((r) => (
        <motion.g key={r.name} variants={part} style={svgBox}>
          <rect x={228} y={r.y - 20} width={184} height={34} rx={8} fill="#e8f0fe" />
          <text x={320} y={r.y + 2} textAnchor="middle" fontSize={15} fill={BLUE} fontFamily="ui-monospace, monospace">
            {r.name}
          </text>
        </motion.g>
      ))}

      <motion.g variants={part} style={svgBox}>
        <text x={560} y={24} textAnchor="middle" fontSize={14} fill={MUTED}>ANTHROPIC</text>
        <Box x={460} y={40} w={170} h={230} fill={SURFACE} stroke={LINE} />
        <text x={545} y={76} textAnchor="middle" fontSize={14} fill={MUTED}>one model per job</text>
      </motion.g>

      {routes.map((r) => (
        <motion.g key={r.y} variants={part} style={svgBox}>
          <motion.path d={`M 430 ${r.y - 3} L 458 ${r.y - 3}`} stroke={LINE} strokeWidth={1.5}
                       fill="none" markerEnd="url(#arrow2)" variants={line} />
          <text x={545} y={r.y + 2} textAnchor="middle" fontSize={15} fill={INK}>{r.model}</text>
        </motion.g>
      ))}
    </Stage>
  );
}

/** Three bars. The point lands faster than a paragraph would. */
export function CostChart() {
  const bars = [
    { label: 'Opus on all three routes', cents: 8.3, color: '#c6dafc' },
    { label: 'One model per route', cents: 1.97, color: '#8ab4f8' },
    { label: '+ caching, no reasoning on extract', cents: 1.64, color: BLUE },
  ];
  const max = 8.3;
  const width = 430;

  return (
    <Stage viewBox="0 0 640 210" label="Cost per session fell from 8.3 cents on Opus throughout to 1.64 cents.">
      {bars.map((item, i) => {
        const y = 30 + i * 60;
        const w = (item.cents / max) * width;
        return (
          <motion.g key={item.label} variants={part} style={svgBox}>
            <text x={0} y={y - 8} fontSize={15} fill={MUTED}>{item.label}</text>
            <rect x={0} y={y} width={width} height={22} rx={6} fill={SURFACE} />
            {/* originX, not CSS transform-origin: Motion writes its own
                transform-origin from originX and would overwrite the CSS,
                leaving the bar growing outwards from its middle. fill-box
                pins that origin to the bar's own left edge. */}
            <motion.rect
              x={0} y={y} width={w} height={22} rx={6} fill={item.color}
              variants={bar}
              style={{ transformBox: 'fill-box', originX: 0 }}
            />
            <text x={width + 14} y={y + 17} fontSize={17} fill={i === 2 ? BLUE : INK}>
              {item.cents.toFixed(2)}¢
            </text>
          </motion.g>
        );
      })}
      <motion.text variants={part} x={0} y={200} fontSize={14} fill={MUTED} style={svgBox}>
        per session · one rubric, two checks, two questions
      </motion.text>
    </Stage>
  );
}
