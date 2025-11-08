import { supabase } from "@/integrations/supabase/client";

interface DustApiConfig {
  workspaceId: string;
  apiKey: string;
  agentId: string;
}

export const callPlanningAgent = async (
  config: DustApiConfig,
  text: string
): Promise<string> => {
  const { data, error } = await supabase.functions.invoke('dust-planning', {
    body: {
      workspaceId: config.workspaceId,
      apiKey: config.apiKey,
      agentId: config.agentId,
      text,
    },
  });

  if (error) {
    console.error('Planning agent error:', error);
    throw new Error(error.message || 'Failed to call planning agent');
  }

  if (!data || !data.content) {
    throw new Error('No content returned from planning agent');
  }

  return data.content;
};

export const callShortAskAgent = async (
  config: DustApiConfig,
  text: string
): Promise<string> => {
  const { data, error } = await supabase.functions.invoke('dust-short-ask', {
    body: {
      workspaceId: config.workspaceId,
      apiKey: config.apiKey,
      agentId: config.agentId,
      text,
    },
  });

  if (error) {
    console.error('Short ask agent error:', error);
    throw new Error(error.message || 'Failed to call short ask agent');
  }

  if (!data || !data.content) {
    throw new Error('No content returned from short ask agent');
  }

  return data.content;
};

export const callGenericAgent = async (
  config: DustApiConfig,
  text: string
): Promise<string> => {
  const { data, error } = await supabase.functions.invoke('dust-generic', {
    body: {
      workspaceId: config.workspaceId,
      apiKey: config.apiKey,
      agentId: config.agentId,
      text,
    },
  });

  if (error) {
    console.error('Generic agent error:', error);
    throw new Error(error.message || 'Failed to call generic agent');
  }

  if (!data || !data.content) {
    throw new Error('No content returned from generic agent');
  }

  return data.content;
};
