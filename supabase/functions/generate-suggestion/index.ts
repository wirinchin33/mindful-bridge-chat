
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chatHistory } = await req.json();

    if (!chatHistory || !Array.isArray(chatHistory) || chatHistory.length === 0) {
      return new Response(JSON.stringify({ suggestion: 'How are you feeling today?' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ suggestion: 'How are you feeling today?' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create context from chat history
    const conversationContext = chatHistory
      .slice(-6) // Last 6 messages for context
      .map(msg => `${msg.sender}: ${msg.content}`)
      .join('\n');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Based on the conversation history, suggest a thoughtful and empathetic response that the user could send. The suggestion should be supportive, understanding, and help continue meaningful dialogue. Keep it concise and natural.'
          },
          {
            role: 'user',
            content: `Conversation history:\n${conversationContext}\n\nSuggest what the user might want to say next:`
          }
        ],
        max_tokens: 100,
        temperature: 0.8
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      return new Response(JSON.stringify({ suggestion: 'How are you feeling today?' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected OpenAI response structure:', data);
      return new Response(JSON.stringify({ suggestion: 'How are you feeling today?' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const suggestion = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ suggestion }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-suggestion function:', error);
    return new Response(JSON.stringify({ suggestion: 'How are you feeling today?' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
