/**
 * Reads what is actually in the editor into something both exporters can use.
 *
 * The alternative is each exporter walking the DOM itself, and then the PDF
 * and the Word file quietly disagree about what the document said. Styles are
 * read from getComputedStyle rather than inline attributes, because the editor
 * produces a mix of <b>, <font>, inline styles and nesting, and the computed
 * value is the only place all of that has already been resolved.
 */

export interface Run {
  text: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  /** #rrggbb. */
  color: string;
  /** #rrggbb, or null when nothing is behind the text. */
  highlight: string | null;
  sizePt: number;
  family: string;
}

export type Align = 'left' | 'center' | 'right';

export type Block =
  | { kind: 'paragraph'; runs: Run[]; align: Align }
  | { kind: 'image'; src: string; width: number; height: number };

const PT_PER_PX = 0.75;

function hex(colour: string): string | null {
  const m = colour.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a] = m[1].split(',').map((n) => parseFloat(n));
  // Fully transparent is the browser's way of saying there is no background.
  if (a !== undefined && a < 0.05) return null;
  const to = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

function align(value: string): Align {
  if (value === 'center' || value === 'right') return value;
  return 'left';
}

function runFrom(el: HTMLElement, text: string): Run {
  const s = getComputedStyle(el);
  return {
    text,
    bold: (parseInt(s.fontWeight, 10) || 400) >= 600,
    italic: s.fontStyle === 'italic',
    underline: s.textDecorationLine.includes('underline'),
    color: hex(s.color) ?? '#000000',
    highlight: hex(s.backgroundColor),
    sizePt: Math.round(parseFloat(s.fontSize) * PT_PER_PX) || 12,
    family: s.fontFamily,
  };
}

/** Turns the editor's contents into blocks, in reading order. */
export function readDocument(root: HTMLElement): Block[] {
  const blocks: Block[] = [];
  let runs: Run[] = [];
  let current: HTMLElement = root;

  const flush = () => {
    const text = runs.map((r) => r.text).join('').trim();
    if (text) blocks.push({ kind: 'paragraph', runs, align: align(getComputedStyle(current).textAlign) });
    runs = [];
  };

  const walk = (node: Node, block: HTMLElement) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? '';
        const parent = child.parentElement;
        if (text && parent) runs.push(runFrom(parent, text));
        continue;
      }
      if (!(child instanceof HTMLElement)) continue;

      if (child instanceof HTMLImageElement) {
        flush();
        blocks.push({
          kind: 'image',
          src: child.src,
          width: child.naturalWidth || 600,
          height: child.naturalHeight || 400,
        });
        continue;
      }

      if (child.tagName === 'BR') {
        flush();
        continue;
      }

      // A div or p starts a line of its own, and carries its own alignment.
      const blocky = getComputedStyle(child).display.startsWith('block');
      if (blocky) {
        flush();
        current = child;
        walk(child, child);
        flush();
        current = block;
        continue;
      }

      walk(child, block);
    }
  };

  walk(root, root);
  current = root;
  flush();
  return blocks;
}

/** The three families a PDF can rely on without embedding a font file. */
export function pdfFamily(family: string): 'helvetica' | 'times' | 'courier' {
  const f = family.toLowerCase();
  if (f.includes('courier') || f.includes('mono')) return 'courier';
  if (f.includes('times') || f.includes('georgia') || f.includes('serif')) {
    return f.includes('sans-serif') ? 'helvetica' : 'times';
  }
  return 'helvetica';
}

/** The first real name in a CSS stack, for Word, which wants one font. */
export function wordFamily(family: string): string {
  const first = family.split(',')[0].trim().replace(/^["']|["']$/g, '');
  if (!first || first.startsWith('ui-') || first === 'system-ui') return 'Calibri';
  return first;
}
