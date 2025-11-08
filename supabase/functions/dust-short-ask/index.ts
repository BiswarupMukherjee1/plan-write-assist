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

    const url = `https://dust.tt/api/v1/w/${workspaceId}/agents/${agentId}/run`;
    
    console.log('Calling Dust Short Ask Agent:', { workspaceId, agentId, textLength: text.length });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          text,
        },
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

    // Extract the text content from the response
    let content = '';
    if (data.actions && data.actions[0] && data.actions[0].content) {
      content = data.actions[0].content;
    } else {
      console.error('Unexpected response format:', data);
      return new Response(
        JSON.stringify({ error: 'Unexpected response format from Dust API' }),
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
