
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// List of words to flag as inappropriate
const badWords = ['badword1', 'badword2', 'inappropriate']; // Replace with actual bad words

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();
    
    // Simple word-based filtering
    const normalizedContent = content.toLowerCase();
    for (const word of badWords) {
      if (normalizedContent.includes(word.toLowerCase())) {
        return new Response(
          JSON.stringify({ 
            isFlagged: true, 
            reason: "Contains inappropriate language" 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }
    }
    
    // For future enhancement: Add OpenAI API integration here
    // This would require adding OPENAI_API_KEY to Supabase secrets
    
    return new Response(
      JSON.stringify({ isFlagged: false }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in moderation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
