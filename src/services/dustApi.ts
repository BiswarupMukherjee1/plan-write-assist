interface DustApiConfig {
  workspaceId: string;
  apiKey: string;
  agentId: string;
}

interface DustRequest {
  input: {
    text: string;
  };
}

export const callDustAgent = async (
  config: DustApiConfig,
  text: string
): Promise<string> => {
  const url = `https://dust.tt/api/v1/w/${config.workspaceId}/agents/${config.agentId}/run`;

  const request: DustRequest = {
    input: {
      text,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Dust API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  // Extract the text content from the response
  // Dust API returns content in actions[0].content
  if (data.actions && data.actions[0] && data.actions[0].content) {
    return data.actions[0].content;
  }
  
  throw new Error('Unexpected response format from Dust API');
};
