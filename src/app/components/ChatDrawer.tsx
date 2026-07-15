import { Brain, Mic, Send, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';

interface ChatDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatDrawer({ open, onOpenChange }: ChatDrawerProps) {
  const [message, setMessage] = useState('');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4285F4] rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-[#202124]">Ask RubricMate</SheetTitle>
                <p className="text-xs text-[#5f6368]">Get help with feedback or rubric</p>
              </div>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {/* AI Message */}
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#4285F4] rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl rounded-tl-none p-3">
                <p className="text-sm text-[#202124]">
                  Hi! I'm here to help you understand your rubric requirements and feedback. What would you like to know?
                </p>
              </div>
            </div>

            {/* User Message Example */}
            <div className="flex gap-3 justify-end">
              <div className="flex-1 bg-[#F1F3F4] rounded-xl rounded-tr-none p-3 max-w-[80%]">
                <p className="text-sm text-[#202124]">
                  What does "thesis statement" mean?
                </p>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#4285F4] rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl rounded-tl-none p-3">
                <p className="text-sm text-[#202124]">
                  A thesis statement is a clear, concise sentence that expresses the main argument or point of your essay. It typically appears in the introduction and guides the entire paper. For example: "Climate change poses the greatest threat to global food security in the 21st century."
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200 bg-white">
          <p className="text-xs text-[#5f6368] mb-3 text-center">
            Ask about your feedback or rubric
          </p>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your question..."
                className="pr-10 rounded-full bg-[#F1F3F4] border-gray-200"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                <Mic className="w-4 h-4 text-[#5f6368]" />
              </button>
            </div>
            <Button className="rounded-full bg-[#4285F4] hover:bg-[#3367D6] text-white w-10 h-10 p-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
