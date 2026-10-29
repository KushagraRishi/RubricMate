/**
 * Taking the draft out of the app.
 *
 * Three ways out: plain text, a Word file and a PDF. All three are built from
 * what is already in the browser, because a document editor that drags a PDF
 * renderer and a docx writer into the bundle costs the user hundreds of
 * kilobytes on first load for something they do once at the end.
 */

/** Windows, macOS and Linux between them dislike all of these in a filename. */
const ILLEGAL = /[\\/:*?"<>|\u0000-\u001f]/g;

/**
 * Titles are free text, so they can be empty, padded, or full of characters
 * that would break the download. Capped at 80 so the saved name stays readable
 * in a file picker rather than wrapping across it.
 */
function safeFileName(title: string): string {
  const cleaned = title.replace(ILLEGAL, '').replace(/\s+/g, ' ').trim();
  return cleaned.slice(0, 80).trim() || 'document';
}

/** Titles go into generated markup, so they have to be escaped on the way in. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** One place for the anchor dance, so a failure cannot leak an object URL. */
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

/**
 * This is not real OOXML. It is an HTML document with the Office namespaces and
 * a WordSection wrapper, the format Word has opened since Word 2000 and which
 * Pages and Google Docs also import. Writing genuine .docx would mean zipping
 * XML parts and translating every inline style the editor produces, and the
 * translation is where fidelity is lost: bold and italic would survive, but
 * colours, highlights, font choices and base64 images would need mapping one by
 * one. Word reads those straight out of HTML, so the cheap path is also the
 * faithful one. The cost is the .doc extension and a format warning on opening
 * in some versions of Word, which is a fair trade for zero dependencies.
 */
export function exportWordDoc(title: string, html: string): void {
  const heading = escapeHtml(title.trim() || 'Document');
  const markup = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${heading}</title>
  <!--[if gte mso 9]><xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml><![endif]-->
  <style>
    @page WordSection1 {
      size: 21cm 29.7cm;
      margin: 1in 1in 1in 1in;
    }
    div.WordSection1 { page: WordSection1; }
    body {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000;
    }
    h1 { font-size: 20pt; margin: 0 0 16pt; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <div class="WordSection1">
    <h1>${heading}</h1>
    ${html}
  </div>
</body>
</html>`;

  // The byte order mark is what makes Word trust the utf-8 declaration.
  const blob = new Blob(['﻿', markup], { type: 'application/msword' });
  downloadBlob(blob, `${safeFileName(title)}.doc`);
}

/**
 * Printing is the PDF export. A JS PDF library would have to re-implement text
 * layout, web fonts, colour and image embedding, and would still disagree with
 * what the user sees on screen. The browser's own print engine already renders
 * this exact HTML correctly, so handing it the content and letting the user
 * choose "Save as PDF" keeps full fidelity at no bundle cost.
 *
 * It goes through a hidden iframe rather than window.open because a popup
 * blocker will silently eat the new window and the export looks broken. Note
 * that this returns as soon as the dialog is asked for: the dialog is modal to
 * the browser, not to us, so the caller cannot know whether the user saved or
 * cancelled, and should not show a success message that claims a file exists.
 */
export function exportPdf(title: string, html: string): void {
  const heading = escapeHtml(title.trim() || 'Document');
  const page = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${heading}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: Georgia, 'Times New Roman', 'Helvetica Neue', Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000;
      margin: 0;
    }
    h1 { font-size: 20pt; margin: 0 0 16px; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <h1>${heading}</h1>
  ${html}
</body>
</html>`;

  try {
    const frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    frame.style.cssText = 'position:fixed; right:0; bottom:0; width:0; height:0; border:0';
    frame.srcdoc = page;

    frame.onload = () => {
      // Web fonts and base64 images settle a frame or two after load, and
      // printing before they do produces a blank or unstyled page.
      window.setTimeout(() => {
        try {
          frame.contentWindow?.focus();
          frame.contentWindow?.print();
        } catch {
          // Nothing useful to recover here, and an export must never break the editor.
        }
        // The dialog snapshots the document asynchronously, so the iframe has
        // to outlive the print() call by a good margin.
        window.setTimeout(() => frame.remove(), 60000);
      }, 300);
    };

    document.body.appendChild(frame);
  } catch {
    // Same reasoning as above: a failed export is a non-event for the caller.
  }
}
