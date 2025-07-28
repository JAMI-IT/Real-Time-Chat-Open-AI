import * as Battery from "expo-battery";
import * as Brightness from "expo-brightness";

// Enhanced client tools schema with comprehensive emotion detection capabilities
const clientToolsSchema = [
  {
    type: "function",
    name: "getBatteryLevel",
    description: "Gets the device battery level as decimal point percentage.",
  },
  {
    type: "function",
    name: "changeBrightness",
    description: "Changes the brightness of the device screen.",
    parameters: {
      type: "object",
      properties: {
        brightness: {
          type: "number",
          description:
            "A number between 0 and 1, inclusive, representing the desired screen brightness.",
        },
      },
    },
  },
  {
    type: "function",
    name: "flashScreen",
    description: "Quickly flashes the screen on and off.",
  },
  // Enhanced emotion detection tools based on counseling framework
  {
    type: "function",
    name: "detect_emotion",
    description: "Detect and analyze user's current emotional state from voice patterns, tone, and speech characteristics. Call this function for every user interaction to analyze their emotional state based on the comprehensive emotion framework.",
    parameters: {
      type: "object",
      properties: {
        primary_emotion: {
          type: "string",
          enum: ["anxiety", "anger", "despair", "shame", "stress", "self_doubt", "temptation", "guilt", "neutral", "happy", "calm"],
          description: "The primary detected emotion based on voice analysis and conversation patterns"
        },
        intensity: {
          type: "number",
          minimum: 1,
          maximum: 10,
          description: "Emotional intensity level from 1 (very mild) to 10 (extremely intense)"
        },
        confidence: {
          type: "number",
          minimum: 0,
          maximum: 1,
          description: "Confidence in emotion detection accuracy (0.0 to 1.0)"
        },
        vocal_indicators: {
          type: "array",
          items: { type: "string" },
          description: "Specific vocal patterns that indicated this emotion (e.g., 'rapid speech', 'long pauses', 'voice cracks', 'pressured speech')"
        },
        conversation_patterns: {
          type: "array",
          items: { type: "string" },
          description: "Conversation patterns observed (e.g., 'jumping between topics', 'repetitive concerns', 'self-corrections')"
        },
        spiritual_misbeliefs: {
          type: "array",
          items: { type: "string" },
          description: "Potential spiritual misbeliefs detected based on the user's expressions"
        }
      },
      required: ["primary_emotion", "intensity", "confidence"]
    }
  },
  {
    type: "function", 
    name: "adapt_response_style",
    description: "Adapt your communication style based on the detected user emotion using pastoral care principles. Call this after detecting emotion to adjust your response approach.",
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
          description: "The specific response strategy to adopt based on the detected emotion"
        },
        tone_adjustments: {
          type: "array",
          items: { type: "string" },
          description: "Specific tone adjustments to make in the response"
        },
        spiritual_guidance: {
          type: "array",
          items: { type: "string" },
          description: "Spiritual truths or guidance to address underlying misbeliefs"
        }
      },
      required: ["emotion", "response_strategy"]
    }
  },
  {
    type: "function",
    name: "wellness_check", 
    description: "Perform a comprehensive wellness assessment based on recent emotional patterns and spiritual state. Use this to evaluate the user's overall emotional and spiritual wellbeing.",
    parameters: {
      type: "object",
      properties: {
        recent_emotions: {
          type: "array",
          items: { type: "string" },
          description: "Array of recent emotions detected in chronological order"
        },
        intensity_levels: {
          type: "array", 
          items: { type: "number" },
          description: "Array of intensity levels corresponding to each emotion"
        },
        duration_minutes: {
          type: "number",
          description: "Duration of the current conversation in minutes"
        },
        spiritual_concerns: {
          type: "array",
          items: { type: "string" },
          description: "Spiritual concerns or misbeliefs identified during the conversation"
        }
      },
      required: ["recent_emotions", "intensity_levels", "duration_minutes"]
    }
  },
  {
    type: "function",
    name: "track_mood_pattern",
    description: "Analyze mood patterns and emotional trajectories over the conversation to identify trends and provide pastoral insights.",
    parameters: {
      type: "object", 
      properties: {
        emotions: {
          type: "array",
          items: { type: "string" },
          description: "Chronological array of all detected emotions in the conversation"
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
    description: "Provide personalized pastoral care and spiritual support based on current emotional state and identified spiritual misbeliefs.",
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
];

// Enhanced emotion framework data based on the counseling document
const emotionFramework = {
  anxiety: {
    description: "The restless, tight feeling when your mind keeps racing and your heart won't settle. Like carrying a backpack full of invisible problems.",
    conversational_patterns: [
      "trying to solve everything out loud",
      "jumping between topics",
      "spiraling into worst-case scenarios",
      "thoughts moving faster than words",
      "questions rarely waiting for answers",
      "apologizing too much",
      "second-guessing their own faith"
    ],
    vocal_patterns: [
      "rapid or pressured speech",
      "repeating or rephrasing same concerns",
      "asking questions but struggling to receive reassurance",
      "dramatic hypothetical thinking",
      "voice cracks",
      "shallow breathing",
      "verbal self-corrections mid-sentence",
      "long pauses followed by sudden info-dumping"
    ],
    common_phrases: [
      "I just can't stop thinking about it",
      "I know I'm overthinking, but…",
      "What if it all falls apart?",
      "I'm scared of what might happen",
      "I feel like I'm drowning and no one can tell",
      "I'm praying, but I don't feel peace",
      "It's like my brain won't shut off"
    ],
    spiritual_misbeliefs: [
      "Worry proves I care — if I stop, I'm being irresponsible",
      "If I don't think it all through, something will go wrong",
      "I can't trust God to handle this the way I need Him to",
      "Real faith means never feeling anxious",
      "God's silence means I have to figure it out alone"
    ],
    response_guidance: [
      "Validate their concerns without feeding anxiety",
      "Encourage slower, deeper breathing",
      "Help break down overwhelming thoughts",
      "Remind them that God is in control",
      "Offer grounding techniques"
    ]
  },
  anger: {
    description: "The heat that rises inside when something feels unfair, disrespectful, or out of control. Like having a fire alarm go off in your soul.",
    conversational_patterns: [
      "tension in tone, word choice, or rhythm",
      "sometimes loud, other times chillingly calm",
      "sarcasm or short answers",
      "cutting remarks",
      "aggressive defense of boundaries",
      "sounds like frustration or disappointment",
      "voice of someone tired of not being heard"
    ],
    vocal_patterns: [
      "abrupt or sharp speech",
      "raised voice or clipped tone",
      "increased pace or intensity",
      "interrupting or challenging the listener",
      "defensive posture even before being attacked",
      "sarcastic or cynical tone masking deeper hurt"
    ],
    common_phrases: [
      "I'm done with this",
      "They don't respect me",
      "I'm not going to let anyone walk over me again",
      "Why does no one ever listen?",
      "I've held my tongue long enough",
      "I'm sick of always being the one who has to let it go",
      "This isn't fair, and I'm not pretending anymore"
    ],
    spiritual_misbeliefs: [
      "Anger is a sin, so I must be bad for feeling this",
      "God doesn't want to hear my rage",
      "If I forgive, it means what they did was okay",
      "If I'm not in control, I'll be hurt again",
      "If I stay angry, at least I won't feel weak"
    ],
    response_guidance: [
      "Stay calm and composed",
      "Acknowledge their pain underneath the anger",
      "Validate their feelings without condoning harmful actions",
      "Help them find constructive outlets",
      "Address spiritual misconceptions about anger"
    ]
  },
  despair: {
    description: "The deep, quiet feeling that nothing will get better, no matter what you do. Like shouting into the wind and realizing the wind doesn't care.",
    conversational_patterns: [
      "sound flat, detached, or overly sarcastic",
      "downplay exhaustion and mask discouragement",
      "signal they've let go of hope but not responsibility",
      "lowered expectations for themselves, others, and God",
      "describe functioning through emptiness",
      "speak as if moving but not living"
    ],
    vocal_patterns: [
      "flat or neutral voice, even when describing pain",
      "long pauses, sighing, or slow speech",
      "repeated phrases signaling weariness or numbness",
      "talking about getting through rather than believing in",
      "frequent use of 'whatever', 'it is what it is', 'I don't even care anymore'"
    ],
    common_phrases: [
      "I don't care anymore",
      "I just need to get through the day",
      "I'm tired in a way sleep can't fix",
      "I feel like a shell of myself",
      "I can't remember the last time I felt peace",
      "If I stop, everything falls apart, but I've already fallen apart inside",
      "Even praying feels pointless right now"
    ],
    spiritual_misbeliefs: [
      "If I rest, I'm weak. If I break, I've failed",
      "My burnout disqualifies me from being used",
      "God's tired of hearing from me",
      "If I were truly faithful, I wouldn't feel this way"
    ],
    response_guidance: [
      "Acknowledge the depth of their exhaustion",
      "Offer hope without minimizing their pain",
      "Remind them of God's persistent love",
      "Encourage small steps rather than big changes",
      "Validate their struggle as normal, not failure"
    ]
  },
  shame: {
    description: "The heavy, sinking feeling when you believe something is wrong with you, not just what you did. Like wanting to hide even if no one is chasing you.",
    conversational_patterns: [
      "quiet voice, hesitation to speak",
      "sudden over-explaining",
      "shows up after failure, rejection, or sin",
      "says 'I am bad', not just 'I did something bad'",
      "comparing themselves to others doing better spiritually"
    ],
    vocal_patterns: [
      "sudden drop in energy or pace",
      "hesitation mid-sentence",
      "repetition of negative self-labels",
      "speaking in extremes (always, never, nobody, everything)",
      "defensive sarcasm or deflection that feels emotionally loaded",
      "questions that disguise pain"
    ],
    common_phrases: [
      "I messed everything up",
      "I can't believe I did that",
      "I'm such an idiot",
      "I don't deserve grace",
      "They'll never look at me the same"
    ],
    spiritual_misbeliefs: [
      "My worth is based on my behavior",
      "God loves other people more than me",
      "I have to fix myself before I can be used"
    ],
    response_guidance: [
      "Separate their identity from their actions",
      "Affirm their worth as God's beloved",
      "Address the lie that they are beyond grace",
      "Speak truth about God's unconditional love",
      "Help them see the difference between conviction and condemnation"
    ]
  },
  stress: {
    description: "The tight, overloaded feeling when too many things need attention at once. Like trying to hold a hundred glass plates while someone keeps handing you more.",
    conversational_patterns: [
      "sound rushed, irritated, or emotionally short",
      "words often multitask, talking about three things at once",
      "might joke about 'being fine' while listing 14 undone things",
      "signs of internal tension between responsibility and personal need"
    ],
    vocal_patterns: [
      "fast, clipped, or fragmented speech",
      "jumping between topics without transitions",
      "loud sighs, self-interruptions, or trailing off",
      "sharp tone when interrupted or challenged",
      "repetitive use of 'need to', 'have to', 'can't stop', 'no time'"
    ],
    common_phrases: [
      "I'm just trying to keep up",
      "I've got too much going on",
      "I don't have time to think",
      "It's one thing after another",
      "If one more thing hits, I'm going to snap",
      "I can't afford to slow down",
      "I'll rest when this is over"
    ],
    spiritual_misbeliefs: [
      "God needs me to hold it all together",
      "Rest is lazy, I should be stronger than this",
      "If I stop, everything will fall apart",
      "My worth is in what I accomplish",
      "God helps those who help themselves — so I better keep going"
    ],
    response_guidance: [
      "Help them prioritize and simplify",
      "Encourage healthy boundaries",
      "Remind them that God doesn't need their stress",
      "Validate the feeling while challenging the belief",
      "Suggest practical stress management techniques"
    ]
  },
  self_doubt: {
    description: "The feeling that maybe you're not good enough, even when no one has said it. Like standing in front of a locked door and assuming it's your fault it won't open.",
    conversational_patterns: [
      "second-guessing themselves in subtle ways",
      "downplay achievements",
      "hesitate to share thoughts",
      "defer constantly to others",
      "pre-apologize, hedge statements",
      "seek repeated validation",
      "tone carries more uncertainty than words admit"
    ],
    vocal_patterns: [
      "phrases trailed with questions (you know?, right?)",
      "frequent use of 'maybe', 'I guess', 'I'm not sure but…'",
      "repeating themselves or revisiting same concern",
      "laughing off own ideas before finishing them",
      "reversing course mid-thought",
      "compliments met with discomfort or deflection"
    ],
    common_phrases: [
      "Who am I to even try this?",
      "I don't think I have what it takes",
      "I probably misunderstood",
      "I don't want to sound stupid, but…",
      "Someone else could do this better",
      "They're probably just being nice",
      "What if I'm not really called to this?"
    ],
    spiritual_misbeliefs: [
      "God only uses confident, qualified people",
      "If I'm questioning myself, I must not have faith",
      "I need to fix myself before I can be useful",
      "God made a mistake choosing me",
      "It's pride to believe I have something to offer"
    ],
    response_guidance: [
      "Affirm their value and calling",
      "Remind them God uses ordinary people",
      "Challenge perfectionist thinking",
      "Encourage them to see doubt as normal, not disqualifying",
      "Help them recognize their unique gifts"
    ]
  },
  temptation: {
    description: "The feeling that something wrong could feel right just for a moment. Like standing at the edge of a cliff, knowing the fall will hurt but wondering if the wind might catch you.",
    conversational_patterns: [
      "wrestling between desire and conviction",
      "may sound agitated, uncertain, or oddly calm",
      "speak vaguely, test boundaries",
      "spiritualize decisions that don't align with truth",
      "hint at scenarios without naming them",
      "waiting for permission to give in"
    ],
    vocal_patterns: [
      "hypothetical or 'just wondering' phrasing",
      "over-rationalizing behavior before it's done",
      "shaky logic trying to justify harmful decisions",
      "shifting blame or minimizing consequences",
      "nervous laughter, stalling, or deflection when confronted"
    ],
    common_phrases: [
      "I mean, technically it's not a sin, right?",
      "It's not like I'm hurting anyone",
      "I've been so good lately — I deserve this",
      "I just need to feel something",
      "Who's even going to find out?",
      "It's not like I'm going to do it… I'm just thinking about it",
      "God understands I'm only human"
    ],
    spiritual_misbeliefs: [
      "Grace gives me permission, not protection",
      "One moment of compromise won't matter",
      "God's silence means consent",
      "This is better than falling apart emotionally — I'm coping",
      "This is just how I'm wired — I'll never overcome it"
    ],
    response_guidance: [
      "Address the rationalization without condemnation",
      "Offer alternative coping strategies",
      "Remind them of the true cost of compromise",
      "Point them toward healthy outlets",
      "Affirm their ability to overcome through Christ"
    ]
  },
  guilt: {
    description: "The feeling that you've done something wrong and now carry the weight of it. Like accidentally knocking over something fragile and watching it break, then replaying it over and over.",
    conversational_patterns: [
      "expressing regret, wrestling with consequences",
      "seeking absolution",
      "may confess directly or indirectly",
      "looking for relief or reassurance",
      "try to downplay the wrong to avoid pain",
      "punish themselves through harsh self-talk"
    ],
    vocal_patterns: [
      "voice may waver, slow down, or sound nervous",
      "frequent revisiting of specific event or decision",
      "jumping between justifying and blaming themselves",
      "pauses followed by 'I shouldn't have…' or 'I don't know what I was thinking'",
      "language laced with regret about people they care about or God"
    ],
    common_phrases: [
      "I messed up",
      "I can't stop thinking about what I did",
      "They trusted me, and I let them down",
      "I knew better… I just didn't do better",
      "It's eating me up inside",
      "How do I even come back from this?",
      "I don't know if God can forgive me for this one"
    ],
    spiritual_misbeliefs: [
      "I have to earn my forgiveness",
      "God forgives others, but I crossed the line",
      "My guilt proves I'm no longer worthy",
      "I need to feel bad longer before I can move forward",
      "I can't forgive myself — so why would God?"
    ],
    response_guidance: [
      "Distinguish between healthy conviction and destructive guilt",
      "Point them toward God's complete forgiveness",
      "Help them see guilt as a path to restoration, not condemnation",
      "Encourage practical steps for making amends",
      "Remind them of the power of grace"
    ]
  }
};

// Enhanced client tools with comprehensive emotion detection functionality
const clientTools: Record<string, any> = {
  // Existing tools
  getBatteryLevel: async () => {
    const batteryLevel = await Battery.getBatteryLevelAsync();
    if (batteryLevel === -1) {
      return {
        success: false,
        error: "Device does not support retrieving the battery level.",
      };
    }
    return { success: true, batteryLevel };
  },
  
  changeBrightness: ({ brightness }: { brightness: number }) => {
    Brightness.setSystemBrightnessAsync(brightness);
    return { success: true, brightness };
  },
  
  flashScreen: () => {
    Brightness.setSystemBrightnessAsync(1);
    setTimeout(() => {
      Brightness.setSystemBrightnessAsync(0);
    }, 200);
    return { success: true };
  },

  // Enhanced emotion detection tools
  detect_emotion: async (args: {
    primary_emotion: string;
    intensity: number;
    confidence: number;
    vocal_indicators?: string[];
    conversation_patterns?: string[];
    spiritual_misbeliefs?: string[];
  }) => {
    try {
      const emotion_data = {
        ...args,
        timestamp: Date.now(),
        detected_by: 'openai_realtime',
        session_id: Date.now().toString(),
        framework_data: emotionFramework[args.primary_emotion] || null
      };
      
      console.log('Comprehensive emotion detected:', emotion_data);
      
      return {
        success: true,
        message: `Emotion '${args.primary_emotion}' detected with ${Math.round(args.confidence * 100)}% confidence`,
        emotion_data: emotion_data,
        pastoral_guidance: getPastoralGuidance(args.primary_emotion),
        spiritual_support: getSpiritualSupport(args.primary_emotion, args.intensity)
      };
    } catch (error) {
      console.error('Error in emotion detection:', error);
      return {
        success: false,
        error: 'Failed to process emotion detection',
        emotion_data: null
      };
    }
  },

  adapt_response_style: async (args: {
    emotion: string;
    response_strategy: string;
    tone_adjustments?: string[];
    spiritual_guidance?: string[];
  }) => {
    try {
      const style_adaptation = {
        ...args,
        timestamp: Date.now(),
        previous_style: 'professional',
        adapted_for: args.emotion,
        pastoral_approach: getPastoralApproach(args.emotion)
      };
      
      console.log('Pastoral response style adapted:', style_adaptation);
      
      return {
        success: true,
        message: `Response style adapted to '${args.response_strategy}' for emotion: ${args.emotion}`,
        style_data: style_adaptation,
        guidance: getPastoralResponseGuidance(args.response_strategy),
        spiritual_truths: getSpiritualTruths(args.emotion)
      };
    } catch (error) {
      console.error('Error adapting response style:', error);
      return {
        success: false,
        error: 'Failed to adapt response style',
        style_data: null
      };
    }
  },

  wellness_check: async (args: {
    recent_emotions: string[];
    intensity_levels: number[];
    duration_minutes: number;
    spiritual_concerns?: string[];
  }) => {
    try {
      const { recent_emotions, intensity_levels, duration_minutes, spiritual_concerns } = args;
      
      const wellness_assessment = calculateSpiritualWellness(recent_emotions, intensity_levels);
      const pastoral_recommendations = generatePastoralRecommendations(recent_emotions, intensity_levels, spiritual_concerns);
      const spiritual_alert_level = determineSpiritualAlertLevel(recent_emotions, intensity_levels, spiritual_concerns);
      
      const wellness_report = {
        timestamp: Date.now(),
        duration_minutes,
        spiritual_wellness_score: wellness_assessment.score,
        emotional_balance: wellness_assessment.balance,
        dominant_emotions: getMostFrequentEmotions(recent_emotions),
        average_intensity: intensity_levels.reduce((sum, val) => sum + val, 0) / intensity_levels.length,
        pastoral_recommendations,
        spiritual_alert_level,
        total_emotions_detected: recent_emotions.length,
        spiritual_concerns: spiritual_concerns || [],
        prayer_points: generatePrayerPoints(recent_emotions, spiritual_concerns)
      };
      
      console.log('Spiritual wellness check completed:', wellness_report);
      
      return {
        success: true,
        wellness_report,
        summary: generateSpiritualWellnessSummary(wellness_report),
        pastoral_care_plan: generatePastoralCarePlan(wellness_report)
      };
    } catch (error) {
      console.error('Error in wellness check:', error);
      return {
        success: false,
        error: 'Failed to perform wellness check',
        wellness_report: null
      };
    }
  },

  track_mood_pattern: async (args: {
    emotions: string[];
    timestamps: number[];
    context?: string;
    spiritual_themes?: string[];
  }) => {
    try {
      const { emotions, timestamps, context, spiritual_themes } = args;
      
      if (emotions.length < 2) {
        return {
          success: true,
          pattern_analysis: "Insufficient data for pattern analysis",
          trend: "insufficient_data",
          suggestions: ["Continue the conversation to build emotional patterns"],
          confidence: 0
        };
      }
      
      const pattern_analysis = analyzeSpiritualMoodPattern(emotions, timestamps);
      const trend = determineSpiritualTrend(emotions);
      const pastoral_insights = generatePastoralInsights(pattern_analysis, trend, spiritual_themes);
      
      const mood_pattern_report = {
        timestamp: Date.now(),
        total_emotions: emotions.length,
        time_span_minutes: (timestamps[timestamps.length - 1] - timestamps[0]) / (1000 * 60),
        pattern_analysis,
        trend,
        emotional_volatility: calculateEmotionalVolatility(emotions),
        context: context || "No context provided",
        spiritual_themes: spiritual_themes || [],
        pastoral_insights,
        confidence: Math.min(emotions.length / 10, 1)
      };
      
      console.log('Spiritual mood pattern tracked:', mood_pattern_report);
      
      return {
        success: true,
        ...mood_pattern_report
      };
    } catch (error) {
      console.error('Error tracking mood pattern:', error);
      return {
        success: false,
        error: 'Failed to track mood pattern',
        pattern_analysis: null
      };
    }
  },

  provide_pastoral_support: async (args: {
    current_emotion: string;
    intensity: number;
    spiritual_misbeliefs?: string[];
    conversation_context?: string;
  }) => {
    try {
      const { current_emotion, intensity, spiritual_misbeliefs, conversation_context } = args;
      
      const pastoral_support = generatePastoralSupport(current_emotion, intensity);
      const spiritual_truths = addressSpiritualMisbeliefs(spiritual_misbeliefs || []);
      const prayer_support = generatePrayerSupport(current_emotion, intensity);
      const scripture_encouragement = getScriptureEncouragement(current_emotion);
      
      const support_package = {
        timestamp: Date.now(),
        emotion: current_emotion,
        intensity,
        context: conversation_context || "General conversation",
        support_level: intensity > 7 ? "crisis_care" : intensity > 4 ? "intensive_care" : "standard_care",
        pastoral_support,
        spiritual_truths,
        prayer_support,
        scripture_encouragement,
        follow_up_needed: intensity > 8,
        referral_suggested: intensity > 9
      };
      
      console.log('Pastoral support provided:', support_package);
      
      return {
        success: true,
        support_package,
        message: `Pastoral support generated for ${current_emotion} (intensity: ${intensity})`
      };
    } catch (error) {
      console.error('Error providing pastoral support:', error);
      return {
        success: false,
        error: 'Failed to generate pastoral support',
        support_package: null
      };
    }
  }
};

// Helper functions for pastoral care and spiritual guidance
function getPastoralGuidance(emotion: string): string[] {
  return emotionFramework[emotion]?.response_guidance || [
    "Listen with empathy and compassion",
    "Validate their feelings without judgment",
    "Point them toward God's love and grace"
  ];
}

function getSpiritualSupport(emotion: string, intensity: number): string[] {
  const baseSupport = emotionFramework[emotion]?.response_guidance || [];
  
  if (intensity > 7) {
    return [
      "This is a significant emotional experience - you're not alone",
      ...baseSupport,
      "Consider reaching out to a pastor or spiritual director",
      "Remember that God meets us in our deepest struggles"
    ];
  }
  
  return baseSupport;
}

function getPastoralApproach(emotion: string): string {
  const approaches = {
    anxiety: "calm_reassuring",
    anger: "patient_understanding", 
    despair: "hope_restoring",
    shame: "grace_affirming",
    stress: "burden_sharing",
    self_doubt: "identity_affirming",
    temptation: "truth_speaking",
    guilt: "forgiveness_focused"
  };
  
  return approaches[emotion] || "compassionate_listening";
}

function getPastoralResponseGuidance(strategy: string): string[] {
  const guidance = {
    anxiety_supportive: [
      "Speak slowly and calmly",
      "Offer grounding in God's faithfulness",
      "Encourage trust over control",
      "Remind them of God's peace"
    ],
    anger_deescalating: [
      "Remain calm and non-defensive",
      "Validate their pain underneath the anger",
      "Help them process hurt in healthy ways",
      "Point toward healthy expression and forgiveness"
    ],
    despair_hopeful: [
      "Acknowledge the depth of their pain",
      "Offer hope without minimizing struggle",
      "Remind them of God's persistent presence",
      "Encourage small steps forward"
    ],
    shame_affirming: [
      "Separate identity from behavior",
      "Affirm their worth as God's beloved",
      "Address lies with gospel truth",
      "Speak God's unconditional love"
    ],
    stress_calming: [
      "Help prioritize what truly matters",
      "Encourage healthy boundaries",
      "Remind them God doesn't need their anxiety",
      "Offer practical peace-building strategies"
    ],
    doubt_encouraging: [
      "Affirm their value and calling",
      "Normalize questions and uncertainty",
      "Point to God's use of ordinary people",
      "Challenge perfectionist expectations"
    ],
    temptation_redirecting: [
      "Address rationalization with truth",
      "Offer healthy alternatives",
      "Remind of true cost and consequences",
      "Affirm their ability to overcome"
    ],
    guilt_forgiving: [
      "Distinguish conviction from condemnation",
      "Point toward complete forgiveness",
      "Encourage restoration over punishment",
      "Affirm the power of grace"
    ],
    general_supportive: [
      "Listen with pastoral heart",
      "Validate their experience",
      "Point toward God's love",
      "Offer hope and encouragement"
    ]
  };
  
  return guidance[strategy] || guidance.general_supportive;
}

function getSpiritualTruths(emotion: string): string[] {
  const truths = {
    anxiety: [
      "God is in control when everything feels chaotic",
      "Peace comes from trusting, not controlling",
      "God's love is constant even when you can't feel it"
    ],
    anger: [
      "Your anger doesn't disqualify you from God's love",
      "Righteous anger can be a catalyst for justice",
      "Forgiveness is for your freedom, not their absolution"
    ],
    despair: [
      "Your struggle doesn't negate your faith",
      "God meets you in the darkest valleys",
      "Rest is not weakness, it's wisdom"
    ],
    shame: [
      "You are loved because of who you are, not what you do",
      "God's grace covers every failure",
      "Your identity is in Christ, not your performance"
    ],
    stress: [
      "God doesn't need your anxiety to accomplish His will",
      "You are called to faithfulness, not perfect results",
      "Rest is a spiritual discipline, not laziness"
    ],
    self_doubt: [
      "God calls the unqualified and qualifies the called",
      "Your weaknesses showcase God's strength",
      "You have unique gifts that only you can offer"
    ],
    temptation: [
      "God always provides a way out",
      "Your identity is stronger than your urges",
      "Grace empowers victory, not defeat"
    ],
    guilt: [
      "True guilt leads to restoration, not destruction",
      "God's forgiveness is complete and final",
      "You can't earn what's already been given"
    ]
  };
  
  return truths[emotion] || truths.anxiety;
}

function calculateSpiritualWellness(emotions: string[], intensities: number[]): { score: number; balance: string } {
  const negative_emotions = ['anxiety', 'anger', 'despair', 'shame', 'stress', 'self_doubt', 'temptation', 'guilt'];
  const positive_emotions = ['happy', 'calm', 'neutral'];
  
  const negative_count = emotions.filter(e => negative_emotions.includes(e)).length;
  const positive_count = emotions.filter(e => positive_emotions.includes(e)).length;
  const avg_intensity = intensities.reduce((sum, val) => sum + val, 0) / intensities.length;
  
  let score = 50; // baseline spiritual wellness
  score += (positive_count / emotions.length) * 25;
  score -= (negative_count / emotions.length) * 30;
  score -= avg_intensity > 7 ? 20 : 0;
  
  // Additional spiritual wellness factors
  const spiritual_crisis_emotions = ['despair', 'shame', 'guilt'];
  const crisis_count = emotions.filter(e => spiritual_crisis_emotions.includes(e)).length;
  score -= (crisis_count / emotions.length) * 15;
  
  score = Math.max(0, Math.min(100, score));
  
  let balance = 'spiritually_balanced';
  if (negative_count > emotions.length * 0.7) balance = 'spiritual_crisis';
  else if (negative_count > emotions.length * 0.5) balance = 'spiritual_struggle';
  else if (positive_count > negative_count * 1.5) balance = 'spiritually_thriving';
  
  return { score, balance };
}

function generatePastoralRecommendations(emotions: string[], intensities: number[], spiritual_concerns?: string[]): string[] {
  const recommendations = [];
  const avg_intensity = intensities.reduce((sum, val) => sum + val, 0) / intensities.length;
  
  // High intensity recommendations
  if (avg_intensity > 8) {
    recommendations.push("Consider immediate pastoral care or counseling support");
    recommendations.push("Prioritize spiritual practices that bring peace and grounding");
  }
  
  // Specific emotion-based recommendations
  if (emotions.filter(e => e === 'anxiety').length > emotions.length * 0.3) {
    recommendations.push("Practice meditation on God's faithfulness and control");
    recommendations.push("Consider anxiety-focused spiritual direction");
  }
  
  if (emotions.filter(e => e === 'despair').length > emotions.length * 0.2) {
    recommendations.push("Engage in community worship and fellowship");
    recommendations.push("Consider professional counseling alongside pastoral care");
  }
  
  if (emotions.filter(e => e === 'shame').length > emotions.length * 0.2) {
    recommendations.push("Focus on identity-affirming scripture and prayer");
    recommendations.push("Consider grace-focused spiritual reading");
  }
  
  // Spiritual concerns
  if (spiritual_concerns && spiritual_concerns.length > 0) {
    recommendations.push("Address spiritual misbeliefs through biblical study");
    recommendations.push("Consider meeting with a spiritual director or pastor");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("Continue building spiritual practices and community connections");
  }
  
  return recommendations;
}

function determineSpiritualAlertLevel(emotions: string[], intensities: number[], spiritual_concerns?: string[]): string {
  const crisis_emotions = ['despair', 'shame', 'guilt'];
  const crisis_ratio = emotions.filter(e => crisis_emotions.includes(e)).length / emotions.length;
  const avg_intensity = intensities.reduce((sum, val) => sum + val, 0) / intensities.length;
  
  const spiritual_crisis_indicators = spiritual_concerns ? spiritual_concerns.length : 0;
  
  if (crisis_ratio > 0.6 && avg_intensity > 8) return 'spiritual_crisis';
  if (crisis_ratio > 0.4 && avg_intensity > 6) return 'spiritual_concern';
  if (crisis_ratio > 0.2 || avg_intensity > 7 || spiritual_crisis_indicators > 3) return 'pastoral_attention';
  return 'spiritually_stable';
}

function generatePrayerPoints(emotions: string[], spiritual_concerns?: string[]): string[] {
  const prayer_points = [];
  
  // Emotion-based prayer points
  const dominant_emotions = getMostFrequentEmotions(emotions);
  dominant_emotions.forEach(({ emotion }) => {
    const prayers = {
      anxiety: "Peace and trust in God's sovereign control",
      anger: "Healing for underlying hurt and grace for forgiveness",
      despair: "Renewed hope and sense of God's presence",
      shame: "Deep knowledge of God's unconditional love",
      stress: "Wisdom in priorities and grace to rest",
      self_doubt: "Confidence in God's calling and gifting",
      temptation: "Strength to resist and healthier coping",
      guilt: "Complete acceptance of God's forgiveness"
    };
    
    if (prayers[emotion]) {
      prayer_points.push(prayers[emotion]);
    }
  });
  
  // Spiritual concerns
  if (spiritual_concerns && spiritual_concerns.length > 0) {
    prayer_points.push("Clarity and truth to replace spiritual misbeliefs");
    prayer_points.push("Deeper understanding of God's character and love");
  }
  
  return prayer_points;
}

function generateSpiritualWellnessSummary(report: any): string {
  const { spiritual_wellness_score, emotional_balance, spiritual_alert_level } = report;
  
  if (spiritual_wellness_score >= 80) {
    return `Excellent spiritual wellness (${spiritual_wellness_score}/100). You're maintaining strong emotional and spiritual balance.`;
  } else if (spiritual_wellness_score >= 60) {
    return `Good spiritual wellness (${spiritual_wellness_score}/100). Your spiritual and emotional state shows resilience.`;
  } else if (spiritual_wellness_score >= 40) {
    return `Fair spiritual wellness (${spiritual_wellness_score}/100). Consider additional pastoral care and spiritual practices.`;
  } else {
    return `Spiritual wellness needs attention (${spiritual_wellness_score}/100). Pastoral care and professional support recommended.`;
  }
}

function generatePastoralCarePlan(report: any): string[] {
  const { spiritual_alert_level, dominant_emotions, spiritual_concerns } = report;
  const care_plan = [];
  
  switch (spiritual_alert_level) {
    case 'spiritual_crisis':
      care_plan.push("Immediate pastoral intervention recommended");
      care_plan.push("Weekly pastoral counseling sessions");
      care_plan.push("Crisis prayer support network");
      care_plan.push("Professional counseling referral");
      break;
    case 'spiritual_concern':
      care_plan.push("Regular pastoral check-ins (bi-weekly)");
      care_plan.push("Focused spiritual direction");
      care_plan.push("Community support group involvement");
      break;
    case 'pastoral_attention':
      care_plan.push("Monthly pastoral conversations");
      care_plan.push("Spiritual mentorship");
      care_plan.push("Scripture-based encouragement");
      break;
    default:
      care_plan.push("Continue current spiritual practices");
      care_plan.push("Regular community worship participation");
  }
  
  return care_plan;
}

function analyzeSpiritualMoodPattern(emotions: string[], timestamps: number[]): string {
  if (emotions.length < 3) return "Limited data for spiritual pattern analysis";
  
  const recent_third = emotions.slice(-Math.ceil(emotions.length / 3));
  const early_third = emotions.slice(0, Math.ceil(emotions.length / 3));
  
  const spiritual_growth_emotions = ['happy', 'calm', 'neutral'];
  const spiritual_struggle_emotions = ['anxiety', 'despair', 'shame', 'guilt'];
  
  const recent_growth = recent_third.filter(e => spiritual_growth_emotions.includes(e)).length / recent_third.length;
  const early_growth = early_third.filter(e => spiritual_growth_emotions.includes(e)).length / early_third.length;
  
  if (recent_growth > early_growth + 0.2) {
    return "Your spiritual and emotional state has been improving throughout our conversation";
  } else if (early_growth > recent_growth + 0.2) {
    return "There seems to be increasing spiritual struggle during our conversation";
  } else {
    return "Your spiritual and emotional state has remained relatively stable";
  }
}

function determineSpiritualTrend(emotions: string[]): string {
  if (emotions.length < 2) return "insufficient_data";
  
  const growth_emotions = ['happy', 'calm', 'neutral'];
  const recent_half = emotions.slice(Math.ceil(emotions.length / 2));
  const first_half = emotions.slice(0, Math.ceil(emotions.length / 2));
  
  const recent_growth_ratio = recent_half.filter(e => growth_emotions.includes(e)).length / recent_half.length;
  const first_growth_ratio = first_half.filter(e => growth_emotions.includes(e)).length / first_half.length;
  
  if (recent_growth_ratio > first_growth_ratio + 0.15) return "spiritual_growth";
  if (first_growth_ratio > recent_growth_ratio + 0.15) return "spiritual_decline";
  return "spiritually_stable";
}

function generatePastoralInsights(analysis: string, trend: string, spiritual_themes?: string[]): string[] {
  const insights = [];
  
  if (trend === "spiritual_growth") {
    insights.push("Evidence of spiritual resilience and growth");
    insights.push("Continue practices that are supporting this positive trajectory");
  } else if (trend === "spiritual_decline") {
    insights.push("May benefit from additional spiritual support and intervention");
    insights.push("Consider examining recent stressors or spiritual challenges");
  } else {
    insights.push("Showing spiritual stability and consistency");
    insights.push("Maintain current spiritual practices and community connections");
  }
  
  if (spiritual_themes && spiritual_themes.length > 0) {
    insights.push(`Recurring themes: ${spiritual_themes.join(', ')}`);
    insights.push("These themes may indicate areas for focused pastoral attention");
  }
  
  return insights;
}

function generatePastoralSupport(emotion: string, intensity: number): string[] {
  const framework_data = emotionFramework[emotion];
  if (!framework_data) {
    return [
      "God meets you exactly where you are",
      "Your feelings are valid and heard",
      "You are not alone in this experience"
    ];
  }
  
  let support = [...framework_data.response_guidance];
  
  if (intensity > 8) {
    support = [
      "This is a significant emotional experience - pastoral care is recommended",
      ...support,
      "Consider reaching out to a trusted spiritual leader immediately",
      "Remember that seeking help is a sign of wisdom, not weakness"
    ];
  } else if (intensity > 6) {
    support = [
      "This intensity of emotion deserves attention and care",
      ...support,
      "Consider additional spiritual support during this time"
    ];
  }
  
  return support;
}

function addressSpiritualMisbeliefs(misbeliefs: string[]): string[] {
  const truth_responses = [];
  
  misbeliefs.forEach(belief => {
    // Find which emotion framework contains this misbelief
    for (const [emotion, data] of Object.entries(emotionFramework)) {
      if (data.spiritual_misbeliefs.some(mb => mb.toLowerCase().includes(belief.toLowerCase().slice(0, 10)))) {
        truth_responses.push(...getSpiritualTruths(emotion));
        break;
      }
    }
  });
  
  // Default truths if no specific matches found
  if (truth_responses.length === 0) {
    truth_responses.push(
      "God's love for you is unconditional and unchanging",
      "Your worth comes from being God's beloved child",
      "Grace is a gift, not something you earn"
    );
  }
  
  return [...new Set(truth_responses)]; // Remove duplicates
}

function generatePrayerSupport(emotion: string, intensity: number): string[] {
  const prayer_support = [];
  
  if (intensity > 8) {
    prayer_support.push("Immediate prayer for peace and God's presence");
    prayer_support.push("Prayer for wisdom in seeking appropriate help");
  }
  
  const emotion_prayers = {
    anxiety: [
      "Prayer for God's peace that surpasses understanding",
      "Prayer for trust in God's sovereign control",
      "Prayer for freedom from worry and fear"
    ],
    anger: [
      "Prayer for healing of underlying wounds",
      "Prayer for wisdom in healthy expression",
      "Prayer for grace to forgive"
    ],
    despair: [
      "Prayer for renewed hope and vision",
      "Prayer for God's presence in the darkness",
      "Prayer for strength to continue"
    ],
    shame: [
      "Prayer for deep knowledge of God's love",
      "Prayer for freedom from condemnation",
      "Prayer for renewed identity in Christ"
    ],
    stress: [
      "Prayer for wisdom in priorities",
      "Prayer for grace to rest and trust",
      "Prayer for sustainable rhythms"
    ],
    self_doubt: [
      "Prayer for confidence in God's calling",
      "Prayer for recognition of unique gifts",
      "Prayer for courage to step forward"
    ],
    temptation: [
      "Prayer for strength to resist",
      "Prayer for healthy alternatives",
      "Prayer for freedom from bondage"
    ],
    guilt: [
      "Prayer for complete acceptance of forgiveness",
      "Prayer for wisdom in restoration",
      "Prayer for freedom from self-condemnation"
    ]
  };
  
  prayer_support.push(...(emotion_prayers[emotion] || emotion_prayers.anxiety));
  
  return prayer_support;
}

function getScriptureEncouragement(emotion: string): string[] {
  const scriptures = {
    anxiety: [
      "Philippians 4:6-7 - Do not be anxious about anything...",
      "Matthew 6:26 - Look at the birds of the air...",
      "1 Peter 5:7 - Cast all your anxiety on him..."
    ],
    anger: [
      "Ephesians 4:26-27 - In your anger do not sin...",
      "James 1:19-20 - Everyone should be quick to listen...",
      "Psalm 4:4 - Tremble and do not sin..."
    ],
    despair: [
      "Psalm 42:11 - Why, my soul, are you downcast?",
      "Isaiah 43:2 - When you pass through the waters...",
      "Romans 8:28 - All things work together for good..."
    ],
    shame: [
      "Romans 8:1 - There is now no condemnation...",
      "1 John 3:1 - See what great love the Father has lavished...",
      "Isaiah 61:3 - Beauty instead of ashes..."
    ],
    stress: [
      "Matthew 11:28-30 - Come to me, all you who are weary...",
      "Psalm 23:2 - He makes me lie down in green pastures...",
      "Isaiah 26:3 - You will keep in perfect peace..."
    ],
    self_doubt: [
      "Jeremiah 1:5 - Before I formed you in the womb...",
      "2 Timothy 1:7 - God has not given us a spirit of fear...",
      "Philippians 4:13 - I can do all things through Christ..."
    ],
    temptation: [
      "1 Corinthians 10:13 - No temptation has overtaken you...",
      "James 4:7 - Submit yourselves to God. Resist the devil...",
      "Hebrews 2:18 - He is able to help those who are being tempted..."
    ],
    guilt: [
      "1 John 1:9 - If we confess our sins...",
      "Psalm 103:12 - As far as the east is from the west...",
      "Romans 5:8 - But God demonstrates his own love..."
    ]
  };
  
  return scriptures[emotion] || scriptures.anxiety;
}

// Continue with existing helper functions...
function getMostFrequentEmotions(emotions: string[]): { emotion: string; count: number }[] {
  const frequency = {};
  emotions.forEach(emotion => {
    frequency[emotion] = (frequency[emotion] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .map(([emotion, count]) => ({ emotion, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

function calculateEmotionalVolatility(emotions: string[]): number {
  if (emotions.length < 2) return 0;
  
  const emotion_scores = {
    happy: 8, calm: 7, neutral: 5,
    anxiety: 3, stress: 3, self_doubt: 4,
    anger: 2, temptation: 3, guilt: 2,
    despair: 1, shame: 1
  };
  
  const scores = emotions.map(e => emotion_scores[e] || 5);
  let volatility = 0;
  
  for (let i = 1; i < scores.length; i++) {
    volatility += Math.abs(scores[i] - scores[i-1]);
  }
  
  return volatility / (scores.length - 1);
}

export { clientTools, clientToolsSchema, emotionFramework };