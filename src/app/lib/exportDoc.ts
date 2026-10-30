import { readDocument, pdfFamily, wordFamily, type Block, type Run } from './docModel';

/**
 * Taking the draft out of the app: plain text, a Word file, a PDF.
 *
 * Both of the rich formats are built here rather than handed to the browser,
 * so clicking Export downloads a file instead of opening a dialog. The two
 * libraries that do the real work are imported only when their format is
 * chosen, which keeps them off the first load for everyone who never exports.
 */

export interface Look {
  lineHeight?: number;
}

/** Windows, macOS and Linux between them dislike all of these in a filename. */
const ILLEGAL = /[\\/:*?"<>|\u0000-\u001f]/g;

function safeFileName(title: string): string {
  const cleaned = title.replace(ILLEGAL, '').replace(/\s+/g, ' ').trim();
  return cleaned.slice(0, 80).trim() || 'document';
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    // Revoking too early can cancel the download in Safari, so give it a tick.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export function exportPlainText(title: string, text: string): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, `${safeFileName(title)}.txt`);
}

const rgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

/**
 * A real PDF, written as text rather than a picture of text.
 *
 * The obvious route is html2canvas, which screenshots the page and drops the
 * bitmap in. That gives a file several megabytes heavy, blurry when zoomed,
 * and impossible to select or search. Laying the runs out by hand is more
 * code, but the words stay words.
 */
export async function exportPdf(title: string, editor: HTMLElement, look?: Look): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const blocks = readDocument(editor);
  const spacing = look?.lineHeight && look.lineHeight > 0 ? look.lineHeight : 1.5;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 56;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const right = pageWidth - margin;
  const maxWidth = right - margin;

  let y = margin;
  const room = (height: number) => {
    if (y + height <= pageHeight - margin) return;
    doc.addPage();
    y = margin;
  };

  const heading = title.trim() || 'Document';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text(heading, margin, y + 20);
  y += 44;

  const style = (run: Run) => {
    const weight = run.bold && run.italic ? 'bolditalic' : run.bold ? 'bold' : run.italic ? 'italic' : 'normal';
    doc.setFont(pdfFamily(run.family), weight);
    doc.setFontSize(run.sizePt);
    doc.setTextColor(...rgb(run.color));
  };

  for (const block of blocks) {
    if (block.kind === 'image') {
      const scale = Math.min(1, maxWidth / block.width);
      const w = block.width * scale;
      const h = block.height * scale;
      room(h + 12);
      try {
        doc.addImage(block.src, margin, y, w, h);
      } catch {
        // An image the renderer will not take should not lose the essay.
      }
      y += h + 12;
      continue;
    }

    const tallest = Math.max(...block.runs.map((r) => r.sizePt), 12);
    const lineHeight = tallest * spacing;
    // Lay each line out by hand, because a line can change font mid-way and
    // the width of what has already been placed decides where the break goes.
    let x = margin;
    const indent = () => {
      if (block.align === 'left') return margin;
      return margin;
    };

    const lines: { run: Run; text: string; x: number; width: number }[][] = [[]];
    for (const run of block.runs) {
      style(run);
      for (const token of run.text.split(/(\s+)/)) {
        if (!token) continue;
        const width = doc.getTextWidth(token);
        const line = lines[lines.length - 1];
        const used = line.reduce((n, piece) => n + piece.width, 0);
        if (used + width > maxWidth && !/^\s+$/.test(token) && used > 0) {
          lines.push([{ run, text: token, x: 0, width }]);
        } else {
          line.push({ run, text: token, x: 0, width });
        }
      }
    }

    for (const line of lines) {
      if (!line.length) continue;
      room(lineHeight);
      const used = line.reduce((n, piece) => n + piece.width, 0);
      x = block.align === 'center' ? margin + (maxWidth - used) / 2
        : block.align === 'right' ? right - used
          : indent();
      for (const piece of line) {
        style(piece.run);
        if (piece.run.highlight) {
          doc.setFillColor(...rgb(piece.run.highlight));
          doc.rect(x, y - piece.run.sizePt * 0.8, piece.width, piece.run.sizePt * 1.1, 'F');
          doc.setTextColor(...rgb(piece.run.color));
        }
        doc.text(piece.text, x, y);
        if (piece.run.underline) {
          doc.setDrawColor(...rgb(piece.run.color));
          doc.setLineWidth(0.5);
          doc.line(x, y + 1.5, x + piece.width, y + 1.5);
        }
        x += piece.width;
      }
      y += lineHeight;
    }
    y += tallest * 0.4;
  }

  downloadBlob(doc.output('blob'), `${safeFileName(title)}.pdf`);
}

/** Base64 out of a data URL, as the bytes Word wants to embed. */
function bytesOf(dataUrl: string): Uint8Array {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  const binary = atob(base64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
  return out;
}

/**
 * A genuine .docx: zipped OOXML, the format the extension claims. The earlier
 * version wrote the HTML that Word has opened since Word 2000, which avoided a
 * dependency but made some versions of Word warn that the file was not what it
 * said it was. Worth the kilobytes not to hand someone a file their marker's
 * Word complains about.
 */
export async function exportDocx(title: string, editor: HTMLElement, look?: Look): Promise<void> {
  const { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, HeadingLevel } = await import('docx');
  const blocks = readDocument(editor);
  const spacing = look?.lineHeight && look.lineHeight > 0 ? look.lineHeight : 1.5;

  const alignment = {
    left: AlignmentType.LEFT,
    center: AlignmentType.CENTER,
    right: AlignmentType.RIGHT,
  } as const;

  const children = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: title.trim() || 'Document', bold: true, size: 40 })],
    }),
    ...blocks.map((block: Block) => {
      if (block.kind === 'image') {
        const scale = Math.min(1, 600 / block.width);
        return new Paragraph({
          children: [
            new ImageRun({
              type: block.src.includes('image/png') ? 'png' : 'jpg',
              data: bytesOf(block.src),
              transformation: { width: block.width * scale, height: block.height * scale },
            }),
          ],
        });
      }
      return new Paragraph({
        alignment: alignment[block.align],
        // Word counts line spacing in twentieths of a point, where 240 is single.
        spacing: { line: Math.round(240 * spacing), after: 120 },
        children: block.runs.map((run) => new TextRun({
          text: run.text,
          bold: run.bold,
          italics: run.italic,
          underline: run.underline ? {} : undefined,
          color: run.color.replace('#', ''),
          shading: run.highlight ? { fill: run.highlight.replace('#', '') } : undefined,
          size: Math.round(run.sizePt * 2),
          font: wordFamily(run.family),
        })),
      });
    }),
  ];

  const doc = new Document({ sections: [{ children }] });
  downloadBlob(await Packer.toBlob(doc), `${safeFileName(title)}.docx`);
}
