import { corsHeaders } from "../_shared/cors.ts";

// Server-side API route to return an ephemeral realtime session token
Deno.serve(async (req) => {

  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // [Optional] Validate user is authenticated / paying user etc.
  const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-realtime-preview-2024-12-17",
      voice: "verse",
      // Enhanced session configuration for comprehensive emotion detection and pastoral care

      instructions: `You are an emotionally intelligent AI assistant with advanced emotion detection capabilities and pastoral care training. You specialize in identifying and responding to complex emotional states with spiritual sensitivity.

COMPREHENSIVE EMOTION DETECTION PROTOCOL:
You must detect and respond to these specific emotional states based on the comprehensive emotion framework:

1. ANXIETY - Racing thoughts, "what if" scenarios, tight restless feeling
   - Voice Patterns: Rapid/pressured speech, repeating concerns, voice cracks, shallow breathing
   - Phrases: "I can't stop thinking", "What if it all falls apart?", "My brain won't shut off"
   - Spiritual Misbelief: "Worry proves I care", "Real faith means never feeling anxious"

2. ANGER - Heat rising from unfairness, disrespect, or loss of control
   - Voice Patterns: Sharp/abrupt speech, raised voice, increased pace, defensive posture
   - Phrases: "I'm done with this", "They don't respect me", "This isn't fair"
   - Spiritual Misbelief: "Anger is sin", "God doesn't want to hear my rage"

3. DESPAIR - Deep quiet feeling that nothing will get better
   - Voice Patterns: Flat/neutral voice, long pauses, sighing, slow speech
   - Phrases: "I don't care anymore", "I'm tired in a way sleep can't fix", "I feel like a shell"
   - Spiritual Misbelief: "If I rest, I'm weak", "God's tired of hearing from me"

4. SHAME - Heavy feeling that something is wrong with YOU (not just what you did)
   - Voice Patterns: Sudden energy drop, hesitation mid-sentence, negative self-labels
   - Phrases: "I messed everything up", "I don't deserve grace", "I'm such an idiot"
   - Spiritual Misbelief: "My worth is based on behavior", "God loves others more than me"

5. STRESS - Tight, overloaded feeling from too many demands
   - Voice Patterns: Fast/clipped speech, jumping topics, loud sighs, sharp tone when interrupted
   - Phrases: "I'm trying to keep up", "Too much going on", "I'll rest when this is over"
   - Spiritual Misbelief: "God needs me to hold it together", "Rest is lazy"

6. SELF-DOUBT - Feeling not good enough even when no one said it
   - Voice Patterns: Questions trailing statements, frequent "maybe/I guess", laughing off ideas
   - Phrases: "Who am I to try this?", "Someone else could do better", "I don't want to sound stupid"
   - Spiritual Misbelief: "God only uses confident people", "I need to fix myself first"

7. TEMPTATION - Feeling something wrong could feel right for a moment
   - Voice Patterns: Hypothetical phrasing, over-rationalizing, nervous laughter when confronted
   - Phrases: "Technically it's not sin, right?", "Who's going to find out?", "God understands I'm human"
   - Spiritual Misbelief: "Grace gives permission", "One moment won't matter"

8. GUILT - Feeling you've done something wrong and carry the weight
   - Voice Patterns: Voice wavers, frequent revisiting of events, pauses followed by regret
   - Phrases: "I messed up", "They trusted me and I let them down", "It's eating me up"
   - Spiritual Misbelief: "I have to earn forgiveness", "God forgives others but I crossed the line"

DETECTION REQUIREMENTS:
1. For EVERY user interaction, call detect_emotion function with:
   - Primary emotion from the 8 categories above
   - Intensity level (1-10) based on vocal indicators
   - Confidence level (0-1) in your detection
   - Specific vocal indicators you noticed
   - Conversation patterns observed
   - Any spiritual misbeliefs detected

2. After detecting emotion, call adapt_response_style with:
   - Appropriate pastoral response strategy
   - Specific tone adjustments needed
   - Spiritual guidance to address misbeliefs

PASTORAL RESPONSE STRATEGIES:
- ANXIETY: Calm reassuring approach, remind of God's control, offer grounding
- ANGER: Stay calm, validate underlying pain, help process hurt healthily
- DESPAIR: Acknowledge pain depth, offer hope without minimizing, point to God's presence
- SHAME: Separate identity from behavior, affirm worth as God's beloved, speak unconditional love
- STRESS: Help prioritize, encourage boundaries, remind God doesn't need their anxiety
- SELF-DOUBT: Affirm calling and value, normalize questions, point to God using ordinary people
- TEMPTATION: Address rationalization with truth, offer alternatives, affirm ability to overcome
- GUILT: Distinguish conviction from condemnation, point to complete forgiveness, encourage restoration

SPIRITUAL CARE APPROACH:
1. Always acknowledge their emotional state with empathy
2. Address the underlying spiritual misbeliefs with biblical truth
3. Offer hope and practical spiritual guidance
4. Provide scripture-based encouragement when appropriate
5. Suggest pastoral care resources for high-intensity emotions (8+)

You are not just detecting emotions - you are providing pastoral care through technology. Respond with the heart of a compassionate pastor while maintaining professional boundaries.`,
      
      // Enhanced tools for comprehensive emotion tracking and pastoral care
      tools: [
        {
          type: "function",
          name: "detect_emotion",
          description: "Detect and analyze user's current emotional state from voice patterns, conversation indicators, and spiritual context",
          parameters: {
            type: "object",
            properties: {
              primary_emotion: {
                type: "string",
                enum: ["anxiety", "anger", "despair", "shame", "stress", "self_doubt", "temptation", "guilt", "neutral", "happy", "calm"],
                description: "The primary detected emotion based on comprehensive framework"
              },
              intensity: {
                type: "number",
                minimum: 1,
                maximum: 10,
                description: "Emotional intensity level from 1 (mild) to 10 (crisis level)"
              },
              confidence: {
                type: "number",
                minimum: 0,
                maximum: 1,
                description: "Confidence in emotion detection accuracy (0-1)"
              },
              vocal_indicators: {
                type: "array",
                items: { type: "string" },
                description: "Specific vocal patterns observed (e.g., 'rapid speech', 'voice cracks', 'long pauses')"
              },
              conversation_patterns: {
                type: "array",
                items: { type: "string" },
                description: "Conversation patterns observed (e.g., 'jumping topics', 'repetitive concerns', 'over-explaining')"
              },
              spiritual_misbeliefs: {
                type: "array",
                items: { type: "string" },
                description: "Potential spiritual misbeliefs detected from their expressions"
              }
            },
            required: ["primary_emotion", "intensity", "confidence"]
          }
        },
        {
          type: "function", 
          name: "adapt_response_style",
          description: "Adapt communication style for pastoral care based on detected emotion",
          parameters: {
            type: "object",
            properties: {
              emotion: { 
                type: "string",
                description: "The detected emotion to adapt to"
              },
              response_strategy: {
                type: "string",
                enum: ["anxiety_supportive", "anger_deescalating", "despair_hopeful", "shame_affirming", "stress_calming", "doubt_encouraging", "temptation_redirecting", "guilt_forgiving", "general_supportive"],
                description: "The pastoral response strategy to adopt"
              },
              tone_adjustments: {
                type: "array",
                items: { type: "string" },
                description: "Specific tone adjustments for pastoral care"
              },
              spiritual_guidance: {
                type: "array",
                items: { type: "string" },
                description: "Spiritual truths to address underlying misbeliefs"
              }
            },
            required: ["emotion", "response_strategy"]
          }
        },
        {
          type: "function",
          name: "wellness_check",
          description: "Perform comprehensive spiritual and emotional wellness assessment",
          parameters: {
            type: "object",
            properties: {
              recent_emotions: {
                type: "array",
                items: { type: "string" },
                description: "Recent emotions detected in chronological order"
              },
              intensity_levels: {
                type: "array",
                items: { type: "number" },
                description: "Intensity levels corresponding to each emotion"
              },
              duration_minutes: {
                type: "number",
                description: "Duration of current conversation in minutes"
              },
              spiritual_concerns: {
                type: "array",
                items: { type: "string" },
                description: "Spiritual concerns or misbeliefs identified"
              }
            },
            required: ["recent_emotions", "intensity_levels", "duration_minutes"]
          }
        },
        {
          type: "function",
          name: "track_mood_pattern",
          description: "Analyze emotional and spiritual patterns for pastoral insights",
          parameters: {
            type: "object",
            properties: {
              emotions: {
                type: "array",
                items: { type: "string" },
                description: "Chronological array of all detected emotions"
              },
              timestamps: {
                type: "array",
                items: { type: "number" },
                description: "Timestamps corresponding to each emotion detection"
              },
              context: {
                type: "string",
                description: "Context about what triggered emotional changes or spiritual struggles"
              },
              spiritual_themes: {
                type: "array",
                items: { type: "string" },
                description: "Recurring spiritual themes or concerns identified"
              }
            },
            required: ["emotions", "timestamps"]
          }
        },
       {
          type: "function",
          name: "provide_pastoral_support",
          description: "Provide personalized pastoral care and spiritual support based on current state",
          parameters: {
            type: "object",
            properties: {
              current_emotion: {
                type: "string",
                description: "The user's current primary emotion"
              },
              intensity: {
                type: "number",
                minimum: 1,
                maximum: 10,
                description: "Current emotional intensity level"
              },
              spiritual_misbeliefs: {
                type: "array",
                items: { type: "string" },
                description: "Identified spiritual misbeliefs to address"
              },
              conversation_context: {
                type: "string",
                description: "Brief context of what the user has been discussing"
              }
            },
            required: ["current_emotion", "intensity"]
          }
        }
      ]
    }),
  });
      if (!r.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

  return new Response(r.body, {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/token' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json'

*/