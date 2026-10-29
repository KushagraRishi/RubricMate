import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Download, Sparkles, Baseline, Highlighter, ImagePlus, ChevronDown,
  FileText, FileType, FileDown,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { FileText as FileCount } from 'lucide-react';
import { SAMPLE_DRAFT } from '../lib/samples';
import { exportPdf, exportWordDoc, exportPlainText } from '../lib/exportDoc';

interface Props {
  draft: string;
  onDraftChange: (text: string) => void;
  /**
   * Set only when the checklist is not already counting words. A rubric that
   * asks for a word count gets one in the sidebar against its target, which is
   * the more useful number; this is the fallback for rubrics that do not.
   */
  count: string | null;
}

/** Fonts people actually ask for by name, in the order they look for them. */
const FONTS = [
  'Calibri', 'Arial', 'Times New Roman', 'Georgia',
  'Verdana', 'Trebuchet MS', 'Courier New',
];

const SIZES = ['10pt', '11pt', '12pt', '14pt', '18pt', '24pt', '32pt'];

const TEXT_COLORS = [
  '#202124', '#5f6368', '#9aa0a6', '#EA4335', '#F29900',
  '#34A853', '#4285F4', '#9334E6', '#A50E0E', '#1E8E3E',
];

const HIGHLIGHTS = [
  '#FFF475', '#CCFF90', '#A7FFEB', '#CBF0F8', '#D7AEFB',
  '#FDCFE8', '#FFC8AA', '#E6E6E6', '#FFFFFF',
];

/**
 * The original was a picture of Google Docs with grey bars where the text
 * should be. This is the same chrome with a real editor under it.
 *
 * It is contenteditable rather than a textarea so the toolbar can do something.
 * Every control left in the toolbar works; the ones that could only ever have
 * been decorative were removed rather than left there to be clicked.
 */
export function GoogleDocMock({ draft, onDraftChange, count }: Props) {
  const editor = useRef<HTMLDivElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('Untitled document');
  const [spacing, setSpacing] = useState([1.5]);

  /**
   * The last text this editor reported upward. Anything else arriving in
   * `draft` came from outside, such as the sample essay button or a reset.
   */
  const mine = useRef<string | null>(null);

  /**
   * Writing to innerText rebuilds every child node, which drops the caret back
   * to the start of the document and throws away the selection. Doing that on
   * each keystroke is what made backspace at the start of a line feel broken:
   * the character went, then the caret jumped. So the DOM is only written when
   * the new text did not come from typing in here.
   */
  useEffect(() => {
    const el = editor.current;
    if (!el) return;
    if (draft === mine.current) return;
    if (el.innerText === draft) return;
    el.innerText = draft;
  }, [draft]);

  const sync = () => {
    const el = editor.current;
    if (!el) return;
    mine.current = el.innerText;
    onDraftChange(el.innerText);
  };

  /**
   * Off by default, execCommand still emits <font> tags. On, it writes inline
   * styles, which is what both export paths need to carry the formatting over.
   */
  const exec = (command: string, value?: string) => {
    editor.current?.focus();
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand(command, false, value);
    sync();
  };

  /**
   * execCommand only knows the seven legacy HTML sizes, so ask for the largest
   * and rewrite whatever it produced into a real point size. Roundabout, but it
   * is the only way to get an arbitrary size out of the browser's own selection
   * handling.
   *
   * styleWithCSS is a document-wide flag, so whichever button was pressed last
   * decides whether this emits a <font> tag or a span sized xxx-large. Forcing
   * it off here makes the output predictable instead of depending on history,
   * and the span is still swept up in case a browser ignores the flag.
   */
  const setSize = (size: string) => {
    const el = editor.current;
    if (!el) return;
    el.focus();
    document.execCommand('styleWithCSS', false, 'false');
    document.execCommand('fontSize', false, '7');
    el.querySelectorAll('font[size="7"], span[style*="xxx-large"]').forEach((tag) => {
      const span = document.createElement('span');
      span.style.fontSize = size;
      span.innerHTML = tag.innerHTML;
      tag.replaceWith(span);
    });
    sync();
  };

  const insertImage = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.current?.focus();
      document.execCommand('insertImage', false, String(reader.result));
      sync();
    };
    reader.readAsDataURL(file);
  };

  /**
   * A contenteditable pastes whatever the clipboard holds, markup and all. Copy
   * a paragraph out of a Word document or a web page and the inline background
   * and colour come with it, which is how a pasted draft ends up as blocks of
   * blue you cannot read. Only the text is wanted here, so only the text is
   * taken. insertText goes through the undo stack, so ctrl-Z still works.
   */
  const paste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    if (!text) return;
    document.execCommand('insertText', false, text);
    sync();
  };

  const html = () => editor.current?.innerHTML ?? '';
  const text = () => editor.current?.innerText ?? '';

  const tool = 'p-1.5 hover:bg-gray-100 rounded text-[#5f6368]';
  const menu = 'flex items-center gap-1 text-xs px-2 py-1 hover:bg-gray-100 rounded text-[#5f6368]';

  return (
    <div className="flex-1 min-h-0 bg-[#F1F3F4] p-8 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-sm max-w-[720px] mx-auto">
        <div className="border-b border-gray-200 px-4 py-2 sticky top-0 bg-white z-10 rounded-t-lg">
          <div className="flex items-center gap-1 mb-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm text-[#202124] bg-transparent border border-transparent hover:border-gray-200 focus:border-[#4285F4] rounded px-1.5 py-0.5 outline-none flex-1 max-w-[280px]"
              aria-label="Document title"
            />

            <div className="flex items-center gap-2 ml-auto">
              {count && (
                <span className="flex items-center gap-1.5 text-xs text-[#5f6368] mr-1">
                  <FileCount className="w-3.5 h-3.5 text-[#34A853]" />
                  {count}
                </span>
              )}

              <Button
                onClick={() => onDraftChange(SAMPLE_DRAFT)}
                size="sm"
                variant="outline"
                className="rounded-full h-8 px-4 border-gray-300"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Sample essay
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-gray-300 bg-background px-4 h-8 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  Export
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => exportPdf(title, html())}>
                    <FileDown className="w-4 h-4 mr-2" />
                    PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportWordDoc(title, html())}>
                    <FileType className="w-4 h-4 mr-2" />
                    Word
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportPlainText(title, text())}>
                    <FileText className="w-4 h-4 mr-2" />
                    Plain text
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center gap-0.5 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger className={menu} title="Font">
                <span className="w-[86px] text-left truncate">Font</span>
                <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {FONTS.map((font) => (
                  <DropdownMenuItem key={font} onClick={() => exec('fontName', font)}>
                    <span style={{ fontFamily: font }}>{font}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className={menu} title="Font size">
                <span>Size</span>
                <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-28">
                {SIZES.map((size) => (
                  <DropdownMenuItem key={size} onClick={() => setSize(size)}>
                    {size.replace('pt', '')}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-6 bg-gray-200 mx-1.5" />

            <button className={tool} onClick={() => exec('bold')} title="Bold">
              <Bold className="w-4 h-4" />
            </button>
            <button className={tool} onClick={() => exec('italic')} title="Italic">
              <Italic className="w-4 h-4" />
            </button>
            <button className={tool} onClick={() => exec('underline')} title="Underline">
              <Underline className="w-4 h-4" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger className={tool} title="Text colour">
                <Baseline className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-auto p-2">
                <div className="grid grid-cols-5 gap-1.5">
                  {TEXT_COLORS.map((colour) => (
                    <button
                      key={colour}
                      onClick={() => exec('foreColor', colour)}
                      style={{ background: colour }}
                      className="w-5 h-5 rounded border border-gray-300 hover:scale-110 transition-transform"
                      aria-label={`Text colour ${colour}`}
                    />
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className={tool} title="Highlight">
                <Highlighter className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-auto p-2">
                <div className="grid grid-cols-5 gap-1.5">
                  {HIGHLIGHTS.map((colour) => (
                    <button
                      key={colour}
                      onClick={() => exec('hiliteColor', colour)}
                      style={{ background: colour }}
                      className="w-5 h-5 rounded border border-gray-300 hover:scale-110 transition-transform"
                      aria-label={`Highlight ${colour}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => exec('hiliteColor', 'transparent')}
                  className="w-full text-xs text-[#5f6368] hover:bg-gray-100 rounded mt-2 py-1"
                >
                  None
                </button>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-6 bg-gray-200 mx-1.5" />

            <button className={tool} onClick={() => exec('justifyLeft')} title="Align left">
              <AlignLeft className="w-4 h-4" />
            </button>
            <button className={tool} onClick={() => exec('justifyCenter')} title="Align centre">
              <AlignCenter className="w-4 h-4" />
            </button>
            <button className={tool} onClick={() => exec('justifyRight')} title="Align right">
              <AlignRight className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-1.5" />

            <input
              ref={picker}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { insertImage(e.target.files?.[0]); e.target.value = ''; }}
            />
            <button className={tool} onClick={() => picker.current?.click()} title="Insert image">
              <ImagePlus className="w-4 h-4" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger className={menu} title="Line spacing">
                Spacing
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-4">
                <Label className="text-xs text-[#5f6368] mb-2 block">Line spacing</Label>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#5f6368]">1.0x</span>
                  <Slider
                    value={spacing}
                    onValueChange={setSpacing}
                    min={1.0}
                    max={2.5}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-xs text-[#5f6368]">2.5x</span>
                </div>
                <div className="text-xs text-[#202124] mt-2 text-center">{spacing[0].toFixed(1)}x</div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div
          ref={editor}
          contentEditable
          suppressContentEditableWarning
          onInput={sync}
          onPaste={paste}
          data-placeholder="Start writing your assignment here, or load the sample essay above."
          style={{ lineHeight: spacing[0] }}
          className="p-16 min-h-[760px] outline-none text-[#202124] whitespace-pre-wrap
                     [&_img]:max-w-full [&_img]:rounded
                     empty:before:content-[attr(data-placeholder)] empty:before:text-[#9aa0a6]"
        />
      </div>
    </div>
  );
}
