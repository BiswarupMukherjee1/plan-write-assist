import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Settings, ArrowRight, Loader2 } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { callDustAgent } from '@/services/dustApi';
import { toast } from '@/hooks/use-toast';
import SettingsModal from '@/components/SettingsModal';

const TEMPLATES = [
  { value: 'pitch-deck', label: 'Pitch Deck' },
  { value: 'prd', label: 'Product Requirements Document' },
  { value: 'tech-spec', label: 'Technical Specification' },
  { value: 'marketing-copy', label: 'Marketing Copy' },
  { value: 'business-plan', label: 'Business Plan' },
  { value: 'meeting-notes', label: 'Meeting Notes' },
  { value: 'other', label: 'Other' },
];

const DocumentInput = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customInput, setCustomInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const { credentials, setOriginalInput, setDocumentTemplate, setPlanningResult } = useAppContext();

  const handleSubmit = async () => {
    if (!credentials) {
      toast({
        title: 'Missing Credentials',
        description: 'Please configure your Dust API credentials in settings first.',
        variant: 'destructive',
      });
      setShowSettings(true);
      return;
    }

    const input = selectedTemplate 
      ? `Create a ${TEMPLATES.find(t => t.value === selectedTemplate)?.label}: ${customInput}`.trim()
      : customInput;

    if (!input) {
      toast({
        title: 'Input Required',
        description: 'Please select a template or enter custom text.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await callDustAgent(
        {
          workspaceId: credentials.workspaceId,
          apiKey: credentials.apiKey,
          agentId: credentials.planningAgentId,
        },
        input
      );

      setOriginalInput(input);
      setDocumentTemplate(selectedTemplate || null);
      setPlanningResult(result);
      navigate('/execution');
    } catch (error) {
      console.error('Planning Agent error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate plan',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">DocuBoss</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template" className="text-foreground">
                Select document template from a list:
              </Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger id="template" className="bg-background">
                  <SelectValue placeholder="Choose a template..." />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATES.map((template) => (
                    <SelectItem key={template.value} value={template.value}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center py-4">
              <span className="text-muted-foreground">or</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-input" className="text-foreground">
                Tell DocuBoss what product document to build:
              </Label>
              <Textarea
                id="custom-input"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Example: Help me build a 2-minute pitch for a hackathon competition about AI document refinement"
                className="min-h-[150px] bg-background resize-none"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Planning Agent is creating...
                </>
              ) : (
                <>
                  Create Document
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </div>
  );
};

export default DocumentInput;
