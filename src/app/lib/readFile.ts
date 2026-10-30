/**
 * Rubrics and assignments arrive as whatever the lecturer or the student
 * saved, so the file is turned into plain text in the browser and only the
 * text is sent on. The serverless
 * functions stay small and JSON-only, and a 10MB PDF never crosses the wire.
 */

const MAX_BYTES = 10 * 1024 * 1024;

export class FileProblem extends Error {}

export async function readDocumentFile(file: File): Promise<string> {
  if (file.size > MAX_BYTES) {
    throw new FileProblem('That file is over 10MB. Try a smaller one, or paste the text.');
  }

  const name = file.name.toLowerCase();

  if (name.endsWith('.txt') || name.endsWith('.md') || file.type.startsWith('text/')) {
    return file.text();
  }

  if (name.endsWith('.docx')) {
    const { default: mammoth } = await import('mammoth/mammoth.browser');
    const buffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
    if (!value.trim()) throw new FileProblem('That Word file looks empty.');
    return value;
  }

  if (name.endsWith('.pdf')) {
    const pdfjs = await import('pdfjs-dist');
    // Vite hands back a URL for the worker; pdf.js then loads it itself.
    const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

    const buffer = await file.arrayBuffer();
    const doc = await pdfjs.getDocument({ data: buffer }).promise;

    const pages: string[] = [];
    for (let i = 1; i <= doc.numPages; i += 1) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      pages.push(
        content.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ')
          .replace(/\s+/g, ' '),
      );
    }

    const text = pages.join('\n\n').trim();
    if (!text) {
      throw new FileProblem('That PDF has no text in it. It may be a scan, so paste the text instead.');
    }
    return text;
  }

  if (name.endsWith('.doc')) {
    throw new FileProblem('Old .doc files are not supported. Save it as .docx, or paste the text.');
  }

  throw new FileProblem('Use a PDF, a Word file, or plain text.');
}

/** The sidebar's name for it, from before assignments could be opened too. */
export const readRubricFile = readDocumentFile;
