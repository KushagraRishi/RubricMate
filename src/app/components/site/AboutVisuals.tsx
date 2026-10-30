import { Hash, PenLine } from 'lucide-react';

/**
 * The write-up, told in the page's material: figures under a rule, decisions
 * as rows with their proof on a sheet beside them, the request as a numbered
 * run. Each block says one thing, with one line of text to anchor it.
 */

/* ------------------------------------------------------------------ numbers */

const NUMBERS = [
  { n: '80%', label: 'cheaper per session' },
  { n: '3', label: 'serverless functions' },
  { n: '0', label: 'databases' },
  { n: '40', label: 'requests an hour, per visitor' },
];

const WHY = [
  { label: 'Fast', body: 'Counts answer on the keystroke.' },
  { label: 'Cheap', body: 'The AI only reads what it must.' },
  { label: 'Safe', body: 'The key never reaches the browser.' },
  { label: 'Steady', body: 'A slow reply never freezes the counts.' },
];

export function AtAGlance() {
  return (
    <>
      <dl className="figures">
        {NUMBERS.map(({ n, label }) => (
          <div key={label}>
            <dd>{n}</dd>
            <dt>{label}</dt>
          </div>
        ))}
      </dl>
      <div className="why">
        {WHY.map(({ label, body }) => (
          <div key={label}>
            <h3>{label}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- decisions */

function Decision({
  n, title, line, children,
}: { n: string; title: string; line: string; children: React.ReactNode }) {
  return (
    <div className="decision">
      <div className="decision__text">
        <span className="decision__num">{n}</span>
        <h3>{title}</h3>
        <p>{line}</p>
      </div>
      <div className="decision__visual">{children}</div>
    </div>
  );
}

const ROUTES = [
  { route: '/api/extract', model: 'Haiku 5.5', share: 0.05 },
  { route: '/api/check', model: 'Sonnet 5.5', share: 1 },
  { route: '/api/chat', model: 'Haiku 5.5', share: 0.05 },
];

export function Decisions() {
  return (
    <div style={{ marginTop: 'var(--space-2xl)' }}>
      <Decision n="1" title="Do not send everything to the AI" line="Counting is arithmetic. Only meaning needs a model.">
        <div className="sheet crop crop--sm pair">
          <div>
            <p className="label">In your browser</p>
            <ul>
              <li><Hash aria-hidden="true" style={{ display: 'inline', width: 14, height: 14, marginRight: 6 }} />1,040 words</li>
              <li><Hash aria-hidden="true" style={{ display: 'inline', width: 14, height: 14, marginRight: 6 }} />4 sources</li>
            </ul>
            <p className="when">Instant</p>
          </div>
          <div>
            <p className="label">Read by AI</p>
            <ul>
              <li><PenLine aria-hidden="true" style={{ display: 'inline', width: 14, height: 14, marginRight: 6 }} />Is the aim clear?</li>
              <li><PenLine aria-hidden="true" style={{ display: 'inline', width: 14, height: 14, marginRight: 6 }} />Is there a conclusion?</li>
            </ul>
            <p className="when">A few seconds</p>
          </div>
        </div>
      </Decision>

      <Decision n="2" title="A different model for each job" line="Copying a rubric is easy. Marking a draft is not.">
        <div className="sheet crop crop--sm">
          <div className="routes">
            {ROUTES.map((r) => (
              <div key={r.route} className="route">
                <code>{r.route}</code>
                <div className="route__bar">
                  <span className={r.share < 1 ? 'is-light' : undefined} style={{ transform: `scaleX(${Math.max(r.share, 0.02)})` }} />
                </div>
                <span className="route__model">{r.model}</span>
              </div>
            ))}
          </div>
          <p className="routes__note">Bar length is price per million input tokens: Haiku $0.10, Sonnet $2.00.</p>
        </div>
      </Decision>

      <Decision n="3" title="Make the reply a shape, not a paragraph" line="One schema checks the reply and shapes the screen.">
        <pre className="schema">
          <span className="k">id</span>: string{'\n'}
          <span className="k">status</span>: <span className="v">done</span> | <span className="v">in_progress</span> | <span className="v">missing</span>{'\n'}
          <span className="k">score</span>: number{'\n'}
          <span className="k">feedback</span>: string{'\n'}
          <span className="k">evidence</span>: string | null
        </pre>
      </Decision>
    </div>
  );
}

/* --------------------------------------------------------------------- flow */

const FLOW = [
  { label: 'Drop a rubric', where: 'Browser' },
  { label: 'Becomes text', where: 'Browser' },
  { label: 'Becomes criteria', where: 'AI model' },
  { label: 'Counts split out', where: 'Browser' },
  { label: 'You write', where: 'Browser' },
  { label: 'Check sent up', where: 'Server' },
  { label: 'Reply validated', where: 'Server' },
  { label: 'Checklist updates', where: 'Browser' },
];

export function Flow() {
  return (
    <>
      <ol className="flow">
        {FLOW.map(({ label, where }) => (
          <li key={label} className={where === 'Browser' ? undefined : 'is-out'}>
            <h3>{label}</h3>
            <span className="where">{where}</span>
          </li>
        ))}
      </ol>
      <p className="flow__key"><i aria-hidden="true" />Steps that leave your machine</p>
    </>
  );
}

/* --------------------------------------------------------------- challenges */

const HARD = [
  { title: 'Many formats', from: 'PDF, Word, photo', to: 'one text', body: 'Each reader loads only when needed.' },
  { title: 'Predictable AI', from: 'free text', to: 'a schema', body: 'The UI never gets a shape it cannot draw.' },
  { title: 'A public key', from: 'open to all', to: '40 an hour', body: 'Capped by address, and it fails open.' },
  { title: 'Felt latency', from: '2 seconds', to: 'instant', body: 'The browser counts. The AI only reads.' },
];

export function HardParts() {
  return (
    <div className="hard">
      {HARD.map(({ title, from, to, body }) => (
        <div key={title}>
          <p className="label">{title}</p>
          <p className="shift"><s>{from}</s><span>{to}</span></p>
          <p>{body}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------- verify */

const VERIFY = [
  { title: 'Build gate', body: 'Every function is loaded under plain Node before a deploy.', note: 'Born from a real outage' },
  { title: 'One schema', body: 'The model and the screen share it, so a change is a type error.', note: 'Checked on every build' },
  { title: 'Models compared', body: 'The sample essay has no conclusion. Haiku missed it. Sonnet caught it.', note: 'Why Sonnet marks' },
];

const NEXT = [
  'Automated tests', 'Streaming checks', 'Saved drafts', 'Professor templates',
  'Real citation parser', 'Scored example set',
];

export function Verified() {
  return (
    <>
      <p className="honest">No automated test suite yet. These stand in for one.</p>
      <div className="verify">
        {VERIFY.map(({ title, body, note }) => (
          <div key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
            <p className="note">{note}</p>
          </div>
        ))}
      </div>
      <h3 style={{ marginTop: 'var(--space-3xl)' }}>What I would build next</h3>
      <ul className="next">
        {NEXT.map((name) => <li key={name}>{name}</li>)}
      </ul>
    </>
  );
}
