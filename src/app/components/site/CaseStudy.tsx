import { Link } from 'react-router';
import { Hash, Brain, X, Check } from 'lucide-react';

/**
 * The content blocks the public pages share. Each is set in the page's own
 * material (rules, type, the proof sheet) rather than as cards, so a reader
 * meets the facts and not a template.
 */

/* ------------------------------------------------- the problem and the fix */

const PAIRS = [
  ['Read the rubric once', 'Your rubric becomes a checklist'],
  ['Forget parts while you write', 'It updates as you write'],
  ['Find the gaps after you finish', 'Gaps show while you can still fix them'],
];

/**
 * Why anyone should care, before how it works: the same three moments of
 * writing an assignment, without and with, read across a row.
 */
export function ProblemSolution() {
  return (
    <div className="ba">
      <table className="ba__table">
        <thead>
          <tr>
            <th scope="col">Without it</th>
            <th scope="col">With RubricMate</th>
          </tr>
        </thead>
        <tbody>
          {PAIRS.map(([before, after]) => (
            <tr key={before}>
              <td>
                <span className="ba__cell ba__cell--before"><X aria-hidden="true" />{before}</span>
              </td>
              <td>
                <span className="ba__cell ba__cell--after"><Check aria-hidden="true" />{after}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="statement">So you fix it before you submit, not after you get the mark.</p>
    </div>
  );
}

/* ----------------------------------------------------- the idea, concretely */

const SAMPLE_RULES = [
  { rule: 'Write at least 1,000 words', by: 'browser' },
  { rule: 'Use at least 4 sources', by: 'browser' },
  { rule: 'State a clear aim', by: 'ai' },
  { rule: 'End with a conclusion', by: 'ai' },
] as const;

/** The split, shown on four rules anyone has been marked on. */
export function RubricExample() {
  return (
    <figure className="rules-index" style={{ marginInline: 0, marginBottom: 0 }}>
      <ul className="index set">
        {SAMPLE_RULES.map(({ rule, by }) => {
          const ai = by === 'ai';
          const Icon = ai ? Brain : Hash;
          return (
            <li key={rule}>
              <h3>{rule}</h3>
              <span className="who"><Icon aria-hidden="true" />{ai ? 'Read by AI' : 'Counted in your browser'}</span>
            </li>
          );
        })}
      </ul>
      <figcaption className="rules-index__note">A sample rubric. Counts update as you type; the AI check takes a few seconds.</figcaption>
    </figure>
  );
}

/* --------------------------------------------------------------- privacy */

const PRIVACY = [
  ['No account.', 'Open the demo and use it.'],
  ['No database.', 'Your document is held for the session and never written down.'],
  ['Keys stay on the server.', 'Every model call goes through a function that holds the key.'],
  ['Capped by address.', 'Forty requests an hour, so one visitor cannot run up the bill.'],
];

export function Privacy() {
  return (
    <ul className="plain set">
      {PRIVACY.map(([head, tail]) => (
        <li key={head}>
          <h3>{head}</h3>
          <p>{tail}</p>
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------- where to next */

const DEEPER = [
  { to: '/about', title: 'How it was built', body: 'Decisions, request flow, challenges.' },
  { to: '/privacy', title: 'Privacy and limits', body: 'What is kept, and what it will not do.' },
];

/** Where the long text went: an index of the two pages, read as a contents list. */
export function GoDeeper() {
  return (
    <ul className="index set" style={{ marginTop: 'var(--space-2xl)' }}>
      {DEEPER.map(({ to, title, body }) => (
        <li key={to}>
          <Link to={to} className="index__row">
            <h3>{title}</h3>
            <p>{body}</p>
            <span className="go">Read more</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
