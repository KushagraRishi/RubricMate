import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Download, Sparkles, FileText,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { SAMPLE_DRAFT } from '../lib/samples';

interface Props {
  draft: string;
  onDraftChange: (text: string) => void;
  words: number;
  citations: number;
}

/**
 * The original was a picture of Google Docs with grey bars where the text
 * should be. This is the same chrome with a real editor under it.
 *
 * It is contenteditable rather than a textarea for one reason: it lets the
 * toolbar buttons actually do something. Every control left in the toolbar
 * works -- the ones that could only have been decorative were removed instead
 * of being left there to be clicked and do nothing.
 */
export function GoogleDocMock({ draft, onDraftChange, words, citations }: Props) {
  const editor = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('Untitled document');
  const [spacing, setSpacing] = useState([1.5]);

  // Only write into the DOM when the text differs, or every keystroke would
  // reset the caret to the start of the document.
  useEffect(() => {
    const el = editor.current;
    if (el && el.innerText !== draft) el.innerText = draft;
  }, [draft]);

  const exec = (command: string) => {
    editor.current?.focus();
    document.execCommand(command);
    if (editor.current) onDraftChange(editor.current.innerText);
  };

  const download = (extension: 'txt' | 'md') => {
    const blob = new Blob([draft], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^\w\s-]/g, '').trim() || 'document'}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toolbarButton = 'p-1.5 hover:bg-gray-100 rounded';

  return (
    <div className="flex-1 bg-[#F1F3F4] p-8 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-sm max-w-[720px] mx-auto">
        {/* Google Docs Toolbar */}
        <div className="border-b border-gray-200 px-4 py-2 sticky top-0 bg-white z-10 rounded-t-lg">
          <div className="flex items-center gap-1 mb-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm text-[#202124] bg-transparent border border-transparent hover:border-gray-200 focus:border-[#4285F4] rounded px-1.5 py-0.5 outline-none flex-1 max-w-[280px]"
              aria-label="Document title"
            />

            <div className="flex items-center gap-2 ml-auto">
              <div className="flex items-center gap-1.5 text-xs text-[#5f6368] mr-2">
                <FileText className="w-3.5 h-3.5 text-[#34A853]" />
                <span>
                  {words.toLocaleString()} {words === 1 ? 'word' : 'words'}
                  {citations > 0 && ` · ${citations} ${citations === 1 ? 'source' : 'sources'}`}
                </span>
              </div>

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
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => download('txt')}>
                    <Download className="w-4 h-4 mr-2" />
                    Plain text
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => download('md')}>
                    <Download className="w-4 h-4 mr-2" />
                    Markdown
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1">
            <button className={toolbarButton} onClick={() => exec('bold')} title="Bold">
              <Bold className="w-4 h-4 text-[#5f6368]" />
            </button>
            <button className={toolbarButton} onClick={() => exec('italic')} title="Italic">
              <Italic className="w-4 h-4 text-[#5f6368]" />
            </button>
            <button className={toolbarButton} onClick={() => exec('underline')} title="Underline">
              <Underline className="w-4 h-4 text-[#5f6368]" />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            <button className={toolbarButton} onClick={() => exec('justifyLeft')} title="Align left">
              <AlignLeft className="w-4 h-4 text-[#5f6368]" />
            </button>
            <button className={toolbarButton} onClick={() => exec('justifyCenter')} title="Align centre">
              <AlignCenter className="w-4 h-4 text-[#5f6368]" />
            </button>
            <button className={toolbarButton} onClick={() => exec('justifyRight')} title="Align right">
              <AlignRight className="w-4 h-4 text-[#5f6368]" />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            <DropdownMenu>
              <DropdownMenuTrigger className="text-xs px-2 py-1 hover:bg-gray-100 rounded text-[#5f6368]">
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

        {/* The page */}
        <div
          ref={editor}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onDraftChange(e.currentTarget.innerText)}
          data-placeholder="Start writing your assignment here, or load the sample essay above."
          style={{ lineHeight: spacing[0] }}
          className="p-16 min-h-[760px] outline-none text-[#202124] whitespace-pre-wrap
                     empty:before:content-[attr(data-placeholder)] empty:before:text-[#9aa0a6]"
        />
      </div>
    </div>
  );
}
