import { Brain, Send, Loader2, SquarePen } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useEffect, useRef, useState } from 'react';
import type { ChatMessage, Criterion } from '../lib/types';
import { askQuestion, ApiFailure } from '../lib/api';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: string;
  criteria: Criterion[];
}

const OPENER = "Hi! Ask me about your rubric or your draft. I won't write it for you.";

/** Questions worth a tap when you do not know what to ask yet. */
const STARTERS = [
  'What does "thesis statement" mean?',
  'How am I doing so far?',
  'What should I do next?',
];

export function ChatDrawer({ open, onOpenChange, draft, criteria }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);
  // Counts how many threads we have started. A reply holds the number it was
  // asked under, so a reply that lands after a reset can tell it belongs to a
  // thread the reader has thrown away.
  const thread = useRef(0);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || sending) return;

    const asked = thread.current;
    const history = messages;
    setMessages([...history, { role: 'user', content: question }]);
    setInput('');
    setSending(true);

    try {
      const { answer } = await askQuestion(question, draft, criteria, history);
      if (thread.current !== asked) return;
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (err) {
      if (thread.current !== asked) return;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: err instanceof ApiFailure ? err.message : 'Something went wrong. Try again.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  // The button is disabled while sending, but disabling is a render away and
  // the appends above add to whatever is in state at the time, so a reply could
  // still graft itself onto an emptied thread. Bumping the count closes that.
  const newChat = () => {
    thread.current += 1;
    setMessages([]);
    setInput('');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] p-0 flex flex-col gap-0">
        <SheetHeader className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4285F4] rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-[#202124]">Ask RubricMate</SheetTitle>
                <SheetDescription className="text-xs text-[#5f6368]">
                  Get help with feedback or rubric
                </SheetDescription>
              </div>
            </div>
            {messages.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={newChat}
                      disabled={sending}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                      aria-label="New chat"
                    >
                      <SquarePen className="w-4 h-4 text-[#5f6368]" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent><p className="text-xs">New chat</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-4 p-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#4285F4] rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl rounded-tl-none p-3">
                <p className="text-sm text-[#202124]">{OPENER}</p>
              </div>
            </div>

            {messages.map((message, i) =>
              message.role === 'user' ? (
                <div key={i} className="flex gap-3 justify-end">
                  <div className="bg-[#F1F3F4] rounded-xl rounded-tr-none p-3 max-w-[80%]">
                    <p className="text-sm text-[#202124]">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 bg-[#4285F4] rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl rounded-tl-none p-3">
                    <p className="text-sm text-[#202124] whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ),
            )}

            {sending && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#4285F4] rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl rounded-tl-none p-3">
                  <Loader2 className="w-4 h-4 text-[#4285F4] animate-spin" />
                </div>
              </div>
            )}

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {STARTERS.map((starter) => (
                  <button
                    key={starter}
                    onClick={() => send(starter)}
                    className="text-xs text-[#4285F4] border border-blue-200 bg-blue-50 rounded-full px-3 py-1.5 hover:bg-blue-100 transition-colors"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottom} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Type your question..."
              className="rounded-full bg-[#F1F3F4] border-gray-200"
            />
            <Button
              onClick={() => send(input)}
              disabled={sending || !input.trim()}
              className="rounded-full bg-[#4285F4] hover:bg-[#3367D6] text-white w-10 h-10 p-0 shrink-0"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
