import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Link2, Image, MoreVertical, ImageIcon, Video, Table2, Mic, Download, Share2, User, Cloud, Check } from 'lucide-react';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Slider } from './ui/slider';
import { Label } from './ui/label';

interface GoogleDocMockProps {
  state: 'upload' | 'checklist' | 'progress';
}

export function GoogleDocMock({ state }: GoogleDocMockProps) {
  const [listening, setListening] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [spacingOpen, setSpacingOpen] = useState(false);
  const [spacing, setSpacing] = useState([1.0]);

  return (
    <div className="flex-1 bg-[#F1F3F4] p-8">
      <div className="bg-white rounded-lg shadow-sm max-w-[720px] mx-auto">
        {/* Google Docs Toolbar */}
        <div className="border-b border-gray-200 px-4 py-2">
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm text-[#202124]">Untitled document</span>
            </div>
            
            {/* Top Right Actions */}
            <div className="flex items-center gap-2">
              {/* Auto-save Indicator */}
              <div className="flex items-center gap-1.5 text-xs text-[#5f6368] mr-2">
                <Cloud className="w-3.5 h-3.5 text-[#34A853]" />
                <span>All changes saved</span>
              </div>
              
              {/* Collaborator Avatars */}
              <div className="flex items-center -space-x-2 mr-2">
                <Avatar className="w-7 h-7 border-2 border-white">
                  <AvatarFallback className="bg-blue-500 text-white text-xs">JD</AvatarFallback>
                </Avatar>
                <Avatar className="w-7 h-7 border-2 border-white">
                  <AvatarFallback className="bg-green-500 text-white text-xs">SK</AvatarFallback>
                </Avatar>
              </div>
              
              {/* Share Button */}
              <Button 
                onClick={() => setShareOpen(true)}
                size="sm" 
                className="bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full h-8 px-4"
              >
                <Share2 className="w-3.5 h-3.5 mr-1.5" />
                Share
              </Button>
              
              {/* Export Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-gray-300 bg-background px-4 h-8 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  Export
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    DOCX
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    TXT
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <button className="p-2 hover:bg-gray-100 rounded">
                <MoreVertical className="w-4 h-4 text-[#5f6368]" />
              </button>
            </div>
          </div>
          
          {/* Toolbar */}
          <div className="flex items-center gap-1">
            {/* Speak to Write */}
            <button 
              onClick={() => setListening(!listening)}
              className={`p-1.5 hover:bg-gray-100 rounded relative ${listening ? 'bg-red-50' : ''}`}
            >
              <Mic className={`w-4 h-4 ${listening ? 'text-red-500' : 'text-[#5f6368]'}`} />
              {listening && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
            {listening && (
              <span className="text-xs text-red-500 mr-2 animate-pulse">Listening...</span>
            )}
            
            <div className="w-px h-6 bg-gray-200 mx-2" />
            
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <Bold className="w-4 h-4 text-[#5f6368]" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <Italic className="w-4 h-4 text-[#5f6368]" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <Underline className="w-4 h-4 text-[#5f6368]" />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-2" />
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <AlignLeft className="w-4 h-4 text-[#5f6368]" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <AlignCenter className="w-4 h-4 text-[#5f6368]" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <AlignRight className="w-4 h-4 text-[#5f6368]" />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-2" />
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <Link2 className="w-4 h-4 text-[#5f6368]" />
            </button>
            
            {/* Media Tools */}
            <button className="p-1.5 hover:bg-gray-100 rounded" title="Insert Image">
              <ImageIcon className="w-4 h-4 text-[#5f6368]" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded" title="Insert Video">
              <Video className="w-4 h-4 text-[#5f6368]" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded" title="Insert Table">
              <Table2 className="w-4 h-4 text-[#5f6368]" />
            </button>
            
            <div className="w-px h-6 bg-gray-200 mx-2" />
            
            {/* Spacing & Margins */}
            <DropdownMenu open={spacingOpen} onOpenChange={setSpacingOpen}>
              <DropdownMenuTrigger className="text-xs px-2 py-1 hover:bg-gray-100 rounded text-[#5f6368]">
                Spacing
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-4">
                <Label className="text-xs text-[#5f6368] mb-2 block">Paragraph Spacing</Label>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#5f6368]">0.8x</span>
                  <Slider
                    value={spacing}
                    onValueChange={setSpacing}
                    min={0.8}
                    max={2.0}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-xs text-[#5f6368]">2.0x</span>
                </div>
                <div className="text-xs text-[#202124] mt-2 text-center">
                  {spacing[0].toFixed(1)}x
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Share Dialog */}
        <Dialog open={shareOpen} onOpenChange={setShareOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share with others</DialogTitle>
              <DialogDescription>
                Anyone with the link can view this document
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm mb-2 block">Add people</Label>
                <Input placeholder="Enter email addresses..." className="mb-2" />
              </div>
              <div>
                <Label className="text-sm mb-2 block">Get link</Label>
                <div className="flex gap-2">
                  <Input 
                    value="https://docs.google.com/document/d/abc123..." 
                    readOnly 
                    className="bg-[#F1F3F4]"
                  />
                  <Button className="bg-[#4285F4] hover:bg-[#3367D6] text-white">
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Document Content */}
        <div className="p-16 min-h-[800px]">
          {state === 'upload' && (
            <div className="text-[#5f6368]">
              <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
              <div className="h-3 w-full bg-gray-100 rounded mb-2" />
              <div className="h-3 w-full bg-gray-100 rounded mb-2" />
              <div className="h-3 w-4/5 bg-gray-100 rounded mb-6" />
              
              <div className="h-3 w-full bg-gray-100 rounded mb-2" />
              <div className="h-3 w-full bg-gray-100 rounded mb-2" />
              <div className="h-3 w-3/4 bg-gray-100 rounded mb-6" />
            </div>
          )}

          {state === 'checklist' && (
            <div>
              <h1 className="text-[#202124] mb-4">The Impact of Climate Change on Global Agriculture</h1>
              <p className="text-[#5f6368] leading-relaxed mb-4">
                Climate change represents one of the most significant challenges facing global agriculture in the 21st century. This essay examines the multifaceted impacts of rising temperatures and changing precipitation patterns on food production systems worldwide.
              </p>
              <p className="text-[#5f6368] leading-relaxed mb-4">
                Agricultural systems are inherently vulnerable to climate variability, and recent decades have witnessed unprecedented changes in weather patterns. From prolonged droughts in sub-Saharan Africa to flooding in South Asia...
              </p>
              <p className="text-[#5f6368] leading-relaxed">
                According to Smith et al. (2023), crop yields have declined by an average of 15% in regions experiencing temperature increases...
              </p>
            </div>
          )}

          {state === 'progress' && (
            <div>
              <h1 className="text-[#202124] mb-4">The Impact of Climate Change on Global Agriculture</h1>
              <p className="text-[#5f6368] leading-relaxed mb-4">
                Climate change represents one of the most significant challenges facing global agriculture in the 21st century. This essay examines the multifaceted impacts of rising temperatures and changing precipitation patterns on food production systems worldwide, with particular attention to developing nations most vulnerable to environmental disruption.
              </p>
              <p className="text-[#5f6368] leading-relaxed mb-4">
                Agricultural systems are inherently vulnerable to climate variability, and recent decades have witnessed unprecedented changes in weather patterns. From prolonged droughts in sub-Saharan Africa to flooding in South Asia, farmers worldwide face increasingly unpredictable growing conditions that threaten food security.
              </p>
              <p className="text-[#5f6368] leading-relaxed mb-4">
                According to Smith et al. (2023), crop yields have declined by an average of 15% in regions experiencing temperature increases above 2°C. Similarly, Johnson and Martinez (2022) documented significant shifts in agricultural zones, with traditional growing regions becoming less suitable for staple crops. Brown (2024) further emphasizes the economic impact, noting that developing economies dependent on agriculture face disproportionate challenges.
              </p>
              <p className="text-[#5f6368] leading-relaxed">
                The evidence clearly demonstrates that immediate action is required to develop climate-resilient agricultural practices and support vulnerable farming communities in adapting to our changing environment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
