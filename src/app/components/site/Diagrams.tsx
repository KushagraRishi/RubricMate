/**
 * Inline SVG rather than images: these stay sharp, weigh nothing, and take
 * their colours and faces from the site's tokens through classes in site.css,
 * so the drawings and the page are one material.
 *
 * Each viewBox is kept narrow with large type, because a wide diagram scaled
 * down to a phone turns its own labels into grey fuzz.
 */

/** Where the work happens, and where the key is not. */
export function ArchitectureDiagram() {
  const routes = [
    { y: 128, name: '/api/extract', model: 'Haiku 5.5' },
    { y: 178, name: '/api/check', model: 'Sonnet 5.5' },
    { y: 228, name: '/api/chat', model: 'Haiku 5.5' },
  ];

  return (
    <svg
      viewBox="0 0 640 300"
      className="diagram"
      role="img"
      aria-label="Your browser reads the file and counts. The RubricMate server holds the AI key and calls the AI models."
    >
      <defs>
        <marker id="arrow2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="arrowhead" />
        </marker>
      </defs>

      {/* Left to right, the way a request actually travels. */}
      <text x={95} y={22} textAnchor="middle" fontSize={14} className="t-muted">Your browser</text>
      <rect x={10} y={40} width={170} height={240} rx={3} className="box" />
      <text x={95} y={80} textAnchor="middle" fontSize={14} className="t-ink">Reads your PDF or</text>
      <text x={95} y={98} textAnchor="middle" fontSize={14} className="t-ink">Word file</text>
      <text x={95} y={136} textAnchor="middle" fontSize={14} className="t-ink">Counts words</text>
      <text x={95} y={154} textAnchor="middle" fontSize={14} className="t-ink">and sources</text>
      <text x={95} y={192} textAnchor="middle" fontSize={14} className="t-ink">Shows your document</text>
      <text x={95} y={210} textAnchor="middle" fontSize={14} className="t-ink">in the editor</text>
      <line x1={30} y1={234} x2={160} y2={234} className="rule" />
      <text x={95} y={260} textAnchor="middle" fontSize={14} className="t-accent">Updates as you type</text>

      <path d="M 180 160 L 208 160" className="wire" markerEnd="url(#arrow2)" />

      <text x={320} y={22} textAnchor="middle" fontSize={14} className="t-muted">RubricMate server</text>
      <rect x={210} y={40} width={220} height={240} rx={3} className="box box--key" />
      <text x={320} y={80} textAnchor="middle" fontSize={14} className="t-ink2">Passes your text to the AI</text>
      {routes.map((r) => (
        <g key={r.name}>
          <rect x={228} y={r.y - 20} width={184} height={34} rx={2} className="route" />
          <text x={320} y={r.y + 2} textAnchor="middle" fontSize={14} className="t-ink mono">{r.name}</text>
        </g>
      ))}
      <text x={320} y={266} textAnchor="middle" fontSize={14} className="t-accent">Keeps the AI key private</text>

      <text x={545} y={22} textAnchor="middle" fontSize={14} className="t-muted">AI models</text>
      <rect x={460} y={40} width={170} height={240} rx={3} className="box" />
      <text x={545} y={74} textAnchor="middle" fontSize={14} className="t-ink2">A different model</text>
      <text x={545} y={92} textAnchor="middle" fontSize={14} className="t-ink2">for each task</text>
      {routes.map((r) => (
        <g key={r.y}>
          <path d={`M 430 ${r.y - 3} L 458 ${r.y - 3}`} className="wire" markerEnd="url(#arrow2)" />
          <text x={545} y={r.y + 3} textAnchor="middle" fontSize={17} className="t-ink t-display">{r.model}</text>
        </g>
      ))}
    </svg>
  );
}

/** Three bars. The point lands faster than a paragraph would. */
export function CostChart() {
  const bars = [
    { label: 'Using the most expensive model for everything', cents: 8.3 },
    { label: 'Using the right model for each task', cents: 1.97 },
    { label: 'With additional optimization', cents: 1.64 },
  ];
  const max = 8.3;
  const width = 430;

  return (
    <svg viewBox="0 0 560 200" className="diagram" role="img" aria-label="Cost per session fell from 8.3 cents, using the most expensive model for everything, to 1.64 cents.">
      {bars.map((item, i) => {
        const y = 30 + i * 62;
        const w = (item.cents / max) * width;
        return (
          <g key={item.label}>
            <text x={0} y={y - 9} fontSize={14} className="t-ink2">{item.label}</text>
            <rect x={0} y={y} width={width} height={18} rx={1} className="bar-track" />
            <rect x={0} y={y} width={w} height={18} rx={1} className={`bar-${i}`} />
            <text x={width + 16} y={y + 15} fontSize={18} className="t-ink t-display">
              {item.cents.toFixed(2)}¢
            </text>
          </g>
        );
      })}
      <text x={0} y={196} fontSize={13} className="t-muted">Per session: 1 rubric, 2 checks, and 2 questions.</text>
    </svg>
  );
}
