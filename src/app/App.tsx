import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { GoogleDocMock } from './components/GoogleDocMock';
import { RubricMateSidebar } from './components/RubricMateSidebar';
import { ChatDrawer } from './components/ChatDrawer';
import { MessageCircle } from 'lucide-react';
import { Button } from './components/ui/button';

export default function App() {
  const [currentState, setCurrentState] = useState<'upload' | 'checklist' | 'progress'>('upload');
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* State Navigation */}
      <div className="bg-[#F1F3F4] border-b border-gray-200 px-8 py-4">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-[#202124] mb-4">RubricMate Design States</h1>
          <Tabs value={currentState} onValueChange={(v) => setCurrentState(v as any)} className="w-full">
            <TabsList className="bg-white">
              <TabsTrigger value="upload">1. Initial State (Upload)</TabsTrigger>
              <TabsTrigger value="checklist">2. Checklist Generated</TabsTrigger>
              <TabsTrigger value="progress">3. Progress Tracking</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto h-[1024px] flex relative">
        <GoogleDocMock state={currentState} />
        <RubricMateSidebar state={currentState} />
        
        {/* Floating Chat Button */}
        <Button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-8 right-[400px] w-14 h-14 rounded-full bg-[#4285F4] hover:bg-[#3367D6] text-white shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        
        {/* Chat Drawer */}
        <ChatDrawer open={chatOpen} onOpenChange={setChatOpen} />
      </div>
    </div>
  );
}
