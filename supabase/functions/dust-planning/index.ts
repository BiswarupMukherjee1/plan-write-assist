import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { workspaceId, apiKey, agentId, text } = await req.json();

    if (!workspaceId || !apiKey || !agentId || !text) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = `https://dust.tt/api/v1/w/${workspaceId}/assistant/conversations`;
    
    console.log('Calling Dust Planning Agent:', { workspaceId, agentId, textLength: text.length });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: null,
        visibility: 'unlisted',
        message: {
          content: text,
          mentions: [
            {
              configurationId: agentId,
            },
          ],
          context: {
            timezone: 'UTC',
            username: 'User',
            origin: 'api',
          },
        },
        blocking: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dust API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Dust API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Dust API response received');

    // Extract the agent's response content
    let content = '';
    if (data.conversation?.content) {
      // Flatten the nested array structure and find agent messages
      const allMessages = data.conversation.content.flat();
      const agentMessages = allMessages.filter((msg: any) => 
        msg.type === 'agent_message' && msg.content
      );
      
      if (agentMessages.length > 0) {
        content = agentMessages[agentMessages.length - 1].content;
      }
    }

    if (!content) {
      console.error('No content found in response:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'No content returned from Dust API' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
