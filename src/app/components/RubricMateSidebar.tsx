import { Settings, BookCheck, Upload, FileText, Check, Clock, X, Brain, RefreshCw, AlertCircle, Info, ChevronDown, ChevronUp, FileType, Code } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface RubricMateSidebarProps {
  state: 'upload' | 'checklist' | 'progress';
}

export function RubricMateSidebar({ state }: RubricMateSidebarProps) {
  const [manualPasteOpen, setManualPasteOpen] = useState(false);
  const [rubricStructureOpen, setRubricStructureOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState<number[]>([]);

  const toggleCard = (index: number) => {
    setExpandedCards(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="w-[360px] bg-white border-l border-gray-200 flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4285F4] rounded-lg flex items-center justify-center">
              <BookCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-[#202124]">RubricMate</h2>
              <p className="text-xs text-[#5f6368]">Smart Checklist for Assignments</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-[#5f6368]" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Upload Section */}
        {state === 'upload' && (
          <>
            <div>
              <Card className="border-2 border-dashed border-gray-300 bg-[#F1F3F4] p-8 rounded-xl">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-[#4285F4]" />
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <p className="text-sm text-[#202124]">Upload your rubric</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-[#5f6368] cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Supports PDF, DOCX, and Canvas exports</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-xs text-[#5f6368]">We'll extract key requirements automatically</p>
                  </div>
                  <Button className="bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full px-6">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <button 
                    onClick={() => setManualPasteOpen(true)}
                    className="text-xs text-[#4285F4] hover:underline"
                  >
                    Paste rubric manually
                  </button>
                </div>
              </Card>
            </div>
            
            {/* Manual Paste Dialog */}
            <Dialog open={manualPasteOpen} onOpenChange={setManualPasteOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Paste Rubric Manually</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Paste your rubric text here..."
                    className="min-h-[200px] resize-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setManualPasteOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-[#4285F4] hover:bg-[#3367D6] text-white">
                      Extract Requirements
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Empty State Illustration */}
            <Card className="bg-[#F1F3F4] p-6 rounded-xl border-0">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded border-2 border-gray-300" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-300 rounded w-3/4 mb-1" />
                    <div className="h-2 bg-gray-200 rounded w-full" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded border-2 border-gray-300" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-300 rounded w-2/3 mb-1" />
                    <div className="h-2 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded border-2 border-gray-300" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-300 rounded w-4/5 mb-1" />
                    <div className="h-2 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              </div>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-[#4285F4] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#202124] mb-1">How it works</p>
                  <p className="text-xs text-[#5f6368]">Upload your assignment rubric, and RubricMate will analyze requirements and track your progress in real-time as you write.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Checklist Generated State */}
        {state === 'checklist' && (
          <>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Check className="w-4 h-4 text-[#34A853]" />
                <p className="text-sm text-[#202124]">Rubric extracted successfully</p>
              </div>
              <p className="text-xs text-[#5f6368] mb-3">5 criteria detected</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setRubricStructureOpen(true)}
                className="w-full rounded-full text-xs h-7 border-green-300 text-[#34A853] hover:bg-green-50"
              >
                <Code className="w-3 h-3 mr-1.5" />
                View Rubric Structure
              </Button>
            </div>
            
            {/* Rubric Structure Dialog */}
            <Dialog open={rubricStructureOpen} onOpenChange={setRubricStructureOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Rubric Structure</DialogTitle>
                </DialogHeader>
                <div className="bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                  <pre className="text-xs text-[#202124] whitespace-pre-wrap font-mono">
{`{
  "criteria": [
    {
      "id": 1,
      "name": "Thesis Statement",
      "description": "Clear, focused argument",
      "weight": 20,
      "status": "pending"
    },
    {
      "id": 2,
      "name": "Word Count",
      "description": "Minimum 1000 words",
      "weight": 15,
      "status": "pending"
    },
    {
      "id": 3,
      "name": "Academic References",
      "description": "At least 3 citations",
      "weight": 25,
      "status": "pending"
    },
    {
      "id": 4,
      "name": "Structure",
      "description": "Intro & conclusion",
      "weight": 20,
      "status": "pending"
    },
    {
      "id": 5,
      "name": "Grammar & Spelling",
      "description": "Polished writing",
      "weight": 20,
      "status": "pending"
    }
  ]
}`}
                  </pre>
                </div>
              </DialogContent>
            </Dialog>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-[#202124]">Assignment Requirements</h3>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#34A853]" />
                    <span className="text-xs text-[#5f6368]">Done</span>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <div className="w-2 h-2 rounded-full bg-[#4285F4]" />
                    <span className="text-xs text-[#5f6368]">In Progress</span>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-xs text-[#5f6368]">Missing</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Card className="p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Checkbox id="req1" className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <label htmlFor="req1" className="text-sm text-[#202124] cursor-pointer block mb-1">
                        Thesis statement present in introduction
                      </label>
                      <p className="text-xs text-[#5f6368]">Clear, focused argument stating essay's main point</p>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-0 text-xs shrink-0">
                      Pending
                    </Badge>
                  </div>
                </Card>

                <Card className="p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Checkbox id="req2" className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <label htmlFor="req2" className="text-sm text-[#202124] cursor-pointer block mb-1">
                        Minimum 1000 words
                      </label>
                      <p className="text-xs text-[#5f6368]">Current count: 0 words</p>
                      <Progress value={0} className="h-1.5 mt-2" />
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-0 text-xs shrink-0">
                      Pending
                    </Badge>
                  </div>
                </Card>

                <Card className="p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Checkbox id="req3" className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <label htmlFor="req3" className="text-sm text-[#202124] cursor-pointer block mb-1">
                        At least 3 academic references cited
                      </label>
                      <p className="text-xs text-[#5f6368]">Properly formatted citations required</p>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-0 text-xs shrink-0">
                      Pending
                    </Badge>
                  </div>
                </Card>

                <Card className="p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Checkbox id="req4" className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <label htmlFor="req4" className="text-sm text-[#202124] cursor-pointer block mb-1">
                        Introduction and conclusion sections
                      </label>
                      <p className="text-xs text-[#5f6368]">Both sections clearly structured</p>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-0 text-xs shrink-0">
                      Pending
                    </Badge>
                  </div>
                </Card>

                <Card className="p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Checkbox id="req5" className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <label htmlFor="req5" className="text-sm text-[#202124] cursor-pointer block mb-1">
                        Proper grammar and spelling
                      </label>
                      <p className="text-xs text-[#5f6368]">Document should be polished and error-free</p>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-0 text-xs shrink-0">
                      Pending
                    </Badge>
                  </div>
                </Card>
              </div>
            </div>

            <Card className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#202124]">Overall Progress</span>
                <span className="text-xs text-[#5f6368]">0 of 5 completed</span>
              </div>
              <Progress value={0} className="h-2" />
            </Card>
          </>
        )}

        {/* Progress Tracking State */}
        {state === 'progress' && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-[#4285F4]" />
                <p className="text-sm text-[#202124]">Live tracking active</p>
              </div>
              <p className="text-xs text-[#5f6368]">RubricMate is monitoring your progress in real-time</p>
            </div>

            <div>
              <h3 className="text-sm text-[#202124] mb-3">Assignment Requirements</h3>
              <div className="space-y-3">
                {/* Requirement 1 - Done with Collapsible Feedback */}
                <Collapsible open={expandedCards.includes(1)} onOpenChange={() => toggleCard(1)}>
                  <Card className="rounded-xl border border-green-200 bg-green-50 shadow-sm overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox id="req1-done" checked className="mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <label htmlFor="req1-done" className="text-sm text-[#202124] cursor-pointer block mb-1">
                            Thesis statement present in introduction
                          </label>
                          <p className="text-xs text-[#5f6368]">Clear, focused argument stating essay's main point</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className="bg-[#34A853] hover:bg-[#34A853] text-white border-0 text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Done
                          </Badge>
                          <CollapsibleTrigger className="p-1 hover:bg-green-100 rounded">
                            {expandedCards.includes(1) ? (
                              <ChevronUp className="w-4 h-4 text-[#5f6368]" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#5f6368]" />
                            )}
                          </CollapsibleTrigger>
                        </div>
                      </div>
                      {!expandedCards.includes(1) && (
                        <div className="mt-2 h-1 bg-green-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#34A853]" style={{ width: '90%' }} />
                        </div>
                      )}
                    </div>
                    <CollapsibleContent>
                      <AnimatePresence>
                        {expandedCards.includes(1) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-green-200 bg-white p-4"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-[#5f6368]">AI Score</span>
                                <span className="text-sm text-[#34A853]">9 / 10</span>
                              </div>
                              <Progress value={90} className="h-2" />
                              <p className="text-xs text-[#202124]">
                                Excellent thesis statement. Your argument is clear and directly addresses the topic of climate change's impact on agriculture.
                              </p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full rounded-full text-xs h-7"
                              >
                                <RefreshCw className="w-3 h-3 mr-1.5" />
                                Recheck
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* Requirement 2 - In Progress */}
                <Collapsible open={expandedCards.includes(2)} onOpenChange={() => toggleCard(2)}>
                  <Card className="rounded-xl border border-blue-200 bg-blue-50 shadow-sm overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox id="req2-progress" className="mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <label htmlFor="req2-progress" className="text-sm text-[#202124] cursor-pointer block mb-1">
                            Minimum 1000 words
                          </label>
                          <p className="text-xs text-[#5f6368]">Current count: 723 words</p>
                          {!expandedCards.includes(2) && (
                            <Progress value={72} className="h-1.5 mt-2" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className="bg-[#4285F4] hover:bg-[#4285F4] text-white border-0 text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            In Progress
                          </Badge>
                          <CollapsibleTrigger className="p-1 hover:bg-blue-100 rounded">
                            {expandedCards.includes(2) ? (
                              <ChevronUp className="w-4 h-4 text-[#5f6368]" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#5f6368]" />
                            )}
                          </CollapsibleTrigger>
                        </div>
                      </div>
                      {!expandedCards.includes(2) && (
                        <div className="mt-2 h-1 bg-blue-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#4285F4]" style={{ width: '72%' }} />
                        </div>
                      )}
                    </div>
                    <CollapsibleContent>
                      <AnimatePresence>
                        {expandedCards.includes(2) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-blue-200 bg-white p-4"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-[#5f6368]">AI Score</span>
                                <span className="text-sm text-[#4285F4]">7 / 10</span>
                              </div>
                              <Progress value={72} className="h-2" />
                              <p className="text-xs text-[#202124]">
                                You're 72% there! Keep writing to reach the minimum word count. You need 277 more words.
                              </p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full rounded-full text-xs h-7"
                              >
                                <RefreshCw className="w-3 h-3 mr-1.5" />
                                Recheck
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* Requirement 3 - Done */}
                <Collapsible open={expandedCards.includes(3)} onOpenChange={() => toggleCard(3)}>
                  <Card className="rounded-xl border border-green-200 bg-green-50 shadow-sm overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox id="req3-done" checked className="mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <label htmlFor="req3-done" className="text-sm text-[#202124] cursor-pointer block mb-1">
                            At least 3 academic references cited
                          </label>
                          <p className="text-xs text-[#5f6368]">Found: Smith et al. (2023), Johnson & Martinez (2022), Brown (2024)</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className="bg-[#34A853] hover:bg-[#34A853] text-white border-0 text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Done
                          </Badge>
                          <CollapsibleTrigger className="p-1 hover:bg-green-100 rounded">
                            {expandedCards.includes(3) ? (
                              <ChevronUp className="w-4 h-4 text-[#5f6368]" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#5f6368]" />
                            )}
                          </CollapsibleTrigger>
                        </div>
                      </div>
                      {!expandedCards.includes(3) && (
                        <div className="mt-2 h-1 bg-green-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#34A853]" style={{ width: '100%' }} />
                        </div>
                      )}
                    </div>
                    <CollapsibleContent>
                      <AnimatePresence>
                        {expandedCards.includes(3) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-green-200 bg-white p-4"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-[#5f6368]">AI Score</span>
                                <span className="text-sm text-[#34A853]">10 / 10</span>
                              </div>
                              <Progress value={100} className="h-2" />
                              <p className="text-xs text-[#202124]">
                                Perfect! You've included 3 properly formatted academic citations. All references follow correct citation format.
                              </p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full rounded-full text-xs h-7"
                              >
                                <RefreshCw className="w-3 h-3 mr-1.5" />
                                Recheck
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* Requirement 4 - Missing */}
                <Collapsible open={expandedCards.includes(4)} onOpenChange={() => toggleCard(4)}>
                  <Card className="rounded-xl border border-red-200 bg-red-50 shadow-sm overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox id="req4-missing" className="mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <label htmlFor="req4-missing" className="text-sm text-[#202124] cursor-pointer block mb-1">
                            Introduction and conclusion sections
                          </label>
                          <p className="text-xs text-[#5f6368]">Missing conclusion section</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="secondary" className="bg-red-100 text-red-800 border-0 text-xs">
                            <X className="w-3 h-3 mr-1" />
                            Missing
                          </Badge>
                          <CollapsibleTrigger className="p-1 hover:bg-red-100 rounded">
                            {expandedCards.includes(4) ? (
                              <ChevronUp className="w-4 h-4 text-[#5f6368]" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#5f6368]" />
                            )}
                          </CollapsibleTrigger>
                        </div>
                      </div>
                      {!expandedCards.includes(4) && (
                        <div className="mt-2 h-1 bg-red-200 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400" style={{ width: '50%' }} />
                        </div>
                      )}
                    </div>
                    <CollapsibleContent>
                      <AnimatePresence>
                        {expandedCards.includes(4) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-red-200 bg-white p-4"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-[#5f6368]">AI Score</span>
                                <span className="text-sm text-red-600">5 / 10</span>
                              </div>
                              <Progress value={50} className="h-2" />
                              <p className="text-xs text-[#202124]">
                                Your essay has an introduction but is missing a conclusion section. Add a closing paragraph that summarizes your main points.
                              </p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full rounded-full text-xs h-7"
                              >
                                <RefreshCw className="w-3 h-3 mr-1.5" />
                                Recheck
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* Requirement 5 - Done */}
                <Collapsible open={expandedCards.includes(5)} onOpenChange={() => toggleCard(5)}>
                  <Card className="rounded-xl border border-green-200 bg-green-50 shadow-sm overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox id="req5-done" checked className="mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <label htmlFor="req5-done" className="text-sm text-[#202124] cursor-pointer block mb-1">
                            Proper grammar and spelling
                          </label>
                          <p className="text-xs text-[#5f6368]">No major issues detected</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className="bg-[#34A853] hover:bg-[#34A853] text-white border-0 text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Done
                          </Badge>
                          <CollapsibleTrigger className="p-1 hover:bg-green-100 rounded">
                            {expandedCards.includes(5) ? (
                              <ChevronUp className="w-4 h-4 text-[#5f6368]" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#5f6368]" />
                            )}
                          </CollapsibleTrigger>
                        </div>
                      </div>
                      {!expandedCards.includes(5) && (
                        <div className="mt-2 h-1 bg-green-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#34A853]" style={{ width: '95%' }} />
                        </div>
                      )}
                    </div>
                    <CollapsibleContent>
                      <AnimatePresence>
                        {expandedCards.includes(5) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-green-200 bg-white p-4"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-[#5f6368]">AI Score</span>
                                <span className="text-sm text-[#34A853]">9.5 / 10</span>
                              </div>
                              <Progress value={95} className="h-2" />
                              <p className="text-xs text-[#202124]">
                                Excellent writing quality! Your essay is well-polished with proper grammar and spelling throughout. No major issues detected.
                              </p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full rounded-full text-xs h-7"
                              >
                                <RefreshCw className="w-3 h-3 mr-1.5" />
                                Recheck
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              </div>
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#202124]">Overall Progress</span>
                <span className="text-xs text-[#34A853]">3 of 5 completed</span>
              </div>
              <Progress value={60} className="h-2 mb-2" />
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#34A853]" />
                <Check className="w-3.5 h-3.5 text-[#34A853]" />
                <Check className="w-3.5 h-3.5 text-[#34A853]" />
                <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
                <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
              </div>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Card className="bg-purple-50 border-2 border-purple-300 p-4 rounded-xl shadow-md">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm text-[#202124] mb-1">AI Review Suggestion</h4>
                    <p className="text-xs text-[#5f6368] mb-3">You're missing a conclusion section. Add a closing paragraph that summarizes your main arguments and reinforces your thesis.</p>
                    <Button variant="outline" size="sm" className="rounded-full text-xs h-8">
                      <RefreshCw className="w-3 h-3 mr-1.5" />
                      Re-check Document
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-[#F1F3F4]">
        <div className="flex items-center justify-between text-xs text-[#5f6368]">
          <span>RubricMate by YourName</span>
          <button className="hover:text-[#4285F4] transition-colors">Report issue</button>
        </div>
      </div>
    </div>
  );
}
