import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  const { credentials, setCredentials } = useAppContext();
  const [workspaceId, setWorkspaceId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [planningAgentId, setPlanningAgentId] = useState('');
  const [shortAskAgentId, setShortAskAgentId] = useState('');
  const [genericAgentId, setGenericAgentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      loadCredentials();
    }
  }, [open]);

  useEffect(() => {
    // Pre-fill with provided credentials if fields are empty
    if (open && !workspaceId) {
      setWorkspaceId('Ok5SXUOks3');
      setApiKey('sk-9a11d3f1788f63342ebaaa0a4758a2e1');
      setPlanningAgentId('gC4Uf22x4k');
      setShortAskAgentId('JFAPoTat6j');
      setGenericAgentId('0XTp7gGuBD');
    }
  }, [open, workspaceId]);

  const loadCredentials = async () => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem('dust_credentials');
      if (stored) {
        const data = JSON.parse(stored);
        setWorkspaceId(data.workspaceId);
        setApiKey(data.apiKey);
        setPlanningAgentId(data.planningAgentId);
        setShortAskAgentId(data.shortAskAgentId);
        setGenericAgentId(data.genericAgentId);
        setCredentials(data);
      }
    } catch (error) {
      console.error('Load credentials error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!workspaceId || !apiKey || !planningAgentId || !shortAskAgentId || !genericAgentId) {
      toast({
        title: 'Incomplete',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const credentialData = {
        workspaceId,
        apiKey,
        planningAgentId,
        shortAskAgentId,
        genericAgentId,
      };

      localStorage.setItem('dust_credentials', JSON.stringify(credentialData));
      setCredentials(credentialData);

      toast({
        title: 'Saved',
        description: 'Credentials saved successfully.',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Save credentials error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save credentials',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Dust API Settings</DialogTitle>
          <DialogDescription>
            Configure your Dust workspace and agent IDs to enable DocuBoss functionality.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-id">Dust Workspace ID</Label>
              <Input
                id="workspace-id"
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
                placeholder="Ok5SXUOks3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">Dust API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="planning-agent">Planning Agent ID</Label>
              <Input
                id="planning-agent"
                value={planningAgentId}
                onChange={(e) => setPlanningAgentId(e.target.value)}
                placeholder="gC4Uf22x4k"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short-ask-agent">Short Ask Agent ID</Label>
              <Input
                id="short-ask-agent"
                value={shortAskAgentId}
                onChange={(e) => setShortAskAgentId(e.target.value)}
                placeholder="JFAPoTat6j"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="generic-agent">Generic Agent ID</Label>
              <Input
                id="generic-agent"
                value={genericAgentId}
                onChange={(e) => setGenericAgentId(e.target.value)}
                placeholder="0XTp7gGuBD"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Credentials'
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
