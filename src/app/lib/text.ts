/**
 * The deterministic half of the checker.
 *
 * Anything that can be counted is counted here, in the browser, on every
 * keystroke. It costs nothing and it is never wrong, which is the whole reason
 * to keep it away from the model.
 */

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/** "Smith", "Smith & Jones", "Smith et al.": the name part of a citation. */
const AUTHOR = String.raw`[A-Z][A-Za-z'’-]+(?:\s+(?:et\s+al\.?|(?:&|and)\s+[A-Z][A-Za-z'’-]+))?`;

/** Smith (2019), where the author sits outside the brackets. */
const NARRATIVE = new RegExp(String.raw`(${AUTHOR})\s*\((\d{4})[a-z]?\)`, 'g');

/** (Smith, 2019) or (Smith 2019), where the whole thing is bracketed. */
const PARENTHETICAL = new RegExp(String.raw`\((${AUTHOR}),?\s+(\d{4})[a-z]?\)`, 'g');

/**
 * Counts distinct in-text citations in either style, deduplicated by author
 * and year so citing one source three times still counts once.
 *
 * This is a heuristic, not a parser. It is good enough to show live progress
 * towards "cite at least four sources" while you type; the model still has the
 * last word on whether they are real sources, properly used.
 */
export function countCitations(text: string): number {
  const seen = new Set<string>();

  for (const pattern of [NARRATIVE, PARENTHETICAL]) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      const author = match[1].toLowerCase().replace(/\s+/g, ' ').replace(/\.$/, '');
      seen.add(`${author}|${match[2]}`);
    }
  }

  return seen.size;
}
