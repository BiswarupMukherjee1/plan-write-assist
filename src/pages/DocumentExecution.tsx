import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, RefreshCw, Edit, Loader2, Send, Download } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { callPlanningAgent, callShortAskAgent, callGenericAgent } from '@/services/dustApi';
import { toast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const DocumentExecution = () => {
  const navigate = useNavigate();
  const { credentials, planningResult, originalInput, setPlanningResult } = useAppContext();
  const [editablePlan, setEditablePlan] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [documentText, setDocumentText] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    if (!planningResult || !credentials) {
      navigate('/');
      return;
    }
    setEditablePlan(planningResult);
  }, [planningResult, credentials, navigate]);

  const handleRegeneratePlan = async () => {
    if (!credentials || !originalInput) return;

    setIsRegenerating(true);
    try {
      const result = await callPlanningAgent(
        {
          workspaceId: credentials.workspaceId,
          apiKey: credentials.apiKey,
          agentId: credentials.planningAgentId,
        },
        originalInput
      );
      setPlanningResult(result);
      setEditablePlan(result);
      toast({
        title: 'Plan Regenerated',
        description: 'The execution plan has been regenerated successfully.',
      });
    } catch (error) {
      console.error('Regenerate error:', error);
      toast({
        title: 'Error',
        description: 'Failed to regenerate plan',
        variant: 'destructive',
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleRefineText = async () => {
    if (!credentials || !documentText.trim()) {
      toast({
        title: 'No Text',
        description: 'Please enter some text to refine.',
        variant: 'destructive',
      });
      return;
    }

    setIsRefining(true);
    try {
      const result = await callShortAskAgent(
        {
          workspaceId: credentials.workspaceId,
          apiKey: credentials.apiKey,
          agentId: credentials.shortAskAgentId,
        },
        documentText
      );
      setDocumentText(result);
      toast({
        title: 'Text Refined',
        description: 'Your text has been refined successfully.',
      });
    } catch (error) {
      console.error('Refine error:', error);
      toast({
        title: 'Error',
        description: 'Failed to refine text',
        variant: 'destructive',
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!credentials || !chatInput.trim()) return;

    const userMessage: Message = { role: 'user', content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const result = await callGenericAgent(
        {
          workspaceId: credentials.workspaceId,
          apiKey: credentials.apiKey,
          agentId: credentials.genericAgentId,
        },
        chatInput
      );
      const assistantMessage: Message = { role: 'assistant', content: result };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response',
        variant: 'destructive',
      });
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([documentText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Exported',
      description: 'Document exported successfully.',
    });
  };

  const characterCount = documentText.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-primary">DocuBoss</h1>
          </div>
          <Button
            onClick={handleExport}
            disabled={!documentText.trim()}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-120px)]">
          {/* Left Column - Execution Plan */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Execution Plan</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  {isEditMode ? 'Done' : 'Edit'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegeneratePlan}
                  disabled={isRegenerating}
                  className="gap-2"
                >
                  {isRegenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Regenerate
                </Button>
              </div>
            </div>
            <Textarea
              value={editablePlan}
              onChange={(e) => setEditablePlan(e.target.value)}
              disabled={!isEditMode}
              className="flex-1 resize-none font-mono text-sm bg-muted/50"
            />
          </div>

          {/* Right Column - Editor and Chat */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <div className="flex flex-col space-y-4 flex-1">
              {/* Text Editor Section */}
              <div className="flex-1 flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Document Editor</h2>
                  <span className="text-sm text-muted-foreground">{characterCount} characters</span>
                </div>
                <Textarea
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault();
                      handleRefineText();
                    }
                  }}
                  placeholder="Start writing your document here, or paste text to refine..."
                  className="flex-1 resize-none bg-background min-h-[200px]"
                />
                <Button
                  onClick={handleRefineText}
                  disabled={isRefining || !documentText.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full gap-2"
                >
                  {isRefining ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Refining...
                    </>
                  ) : (
                    'Refine Text'
                  )}
                </Button>
              </div>

              {/* Chat Section */}
              <div className="flex-1 flex flex-col space-y-2">
                <h2 className="text-xl font-semibold text-foreground">Chat with Execution Plan</h2>
                <div className="flex-1 border border-border rounded-md bg-muted/30 p-4 overflow-y-auto space-y-3 min-h-[200px]">
                  {chatMessages.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-8">
                      Ask questions about your document or execution plan...
                    </p>
                  )}
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card text-card-foreground border border-border'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-card text-card-foreground border border-border rounded-lg px-4 py-2">
                        <p className="text-sm text-muted-foreground">Generic Agent is thinking...</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAskQuestion();
                      }
                    }}
                    placeholder="Ask a question..."
                    disabled={isChatLoading}
                    className="flex-1 bg-background"
                  />
                  <Button
                    onClick={handleAskQuestion}
                    disabled={isChatLoading || !chatInput.trim()}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Ask
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentExecution;
