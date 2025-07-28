import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { supabase } from "./utils/supabase";
import { Audio } from "expo-av";
import InCallManager from "react-native-incall-manager";
import {
  mediaDevices,
  RTCPeerConnection,
  MediaStream,
  RTCView,
} from "react-native-webrtc-web-shim";
import {
  clientTools,
  clientToolsSchema,
  emotionFramework,
} from "./utils/tools";

import * as Brightness from "expo-brightness";

// Enhanced emotion detection interfaces for pastoral care
interface EmotionData {
  primary_emotion: string;
  intensity: number;
  confidence: number;
  vocal_indicators?: string[];
  conversation_patterns?: string[];
  spiritual_misbeliefs?: string[];
  timestamp: number;
  framework_data?: any;
}

interface PastoralSupport {
  support_level: string;
  pastoral_support: string[];
  spiritual_truths: string[];
  prayer_support: string[];
  scripture_encouragement: string[];
  follow_up_needed: boolean;
  referral_suggested: boolean;
}

interface EmotionHistory {
  emotions: EmotionData[];
  currentMood: string;
  averageIntensity: number;
  spiritualAlertLevel: string;
  pastoralConcerns: string[];
}

const App = () => {
  useEffect(() => {
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      console.log("brightness status", status);
    })();
  }, []);

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [transcript, setTranscript] = useState("");
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(
    null
  );
  const [pastoralSupport, setPastoralSupport] =
    useState<PastoralSupport | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionHistory>({
    emotions: [],
    currentMood: "neutral",
    averageIntensity: 0,
    spiritualAlertLevel: "normal",
    pastoralConcerns: [],
  });
  const [aiResponseStyle, setAiResponseStyle] = useState("professional");
  const [conversationStartTime] = useState(Date.now());

  const [dataChannel, setDataChannel] = useState<null | ReturnType<
    RTCPeerConnection["createDataChannel"]
  >>(null);
  const peerConnection = useRef<null | RTCPeerConnection>(null);
  const [localMediaStream, setLocalMediaStream] = useState<null | MediaStream>(
    null
  );
  const remoteMediaStream = useRef<MediaStream>(new MediaStream());
  const isVoiceOnly = true;

  // Enhanced emotion processing with pastoral care integration
  const processEmotionDetection = (emotionData: EmotionData) => {
    const updatedHistory = {
      ...emotionHistory,
      emotions: [...emotionHistory.emotions.slice(-9), emotionData], // Keep last 10 emotions
      currentMood: emotionData.primary_emotion,
      averageIntensity:
        (emotionHistory.averageIntensity + emotionData.intensity) / 2,
    };

    // Determine spiritual alert level based on emotion patterns
    const spiritualAlertLevel = calculateSpiritualAlertLevel(
      updatedHistory.emotions
    );
    updatedHistory.spiritualAlertLevel = spiritualAlertLevel;

    // Extract pastoral concerns from spiritual misbeliefs
    if (
      emotionData.spiritual_misbeliefs &&
      emotionData.spiritual_misbeliefs.length > 0
    ) {
      updatedHistory.pastoralConcerns = [
        ...new Set([
          ...updatedHistory.pastoralConcerns,
          ...emotionData.spiritual_misbeliefs,
        ]),
      ];
    }

    setEmotionHistory(updatedHistory);
    setCurrentEmotion(emotionData);

    // Alert for high-intensity emotions requiring pastoral attention
    if (emotionData.intensity >= 8) {
      Alert.alert(
        "Pastoral Care Alert",
        `High intensity ${emotionData.primary_emotion} detected. Consider reaching out to a pastor or counselor.`,
        [{ text: "OK" }]
      );
    }

    console.log("Comprehensive emotion detected:", emotionData);
  };

  const calculateSpiritualAlertLevel = (emotions: EmotionData[]): string => {
    if (emotions.length === 0) return "normal";

    const crisisEmotions = ["despair", "shame", "guilt"];
    const recentEmotions = emotions.slice(-5);
    const crisisCount = recentEmotions.filter((e) =>
      crisisEmotions.includes(e.primary_emotion)
    ).length;
    const avgIntensity =
      recentEmotions.reduce((sum, e) => sum + e.intensity, 0) /
      recentEmotions.length;

    if (crisisCount >= 3 && avgIntensity > 7) return "spiritual_crisis";
    if (crisisCount >= 2 && avgIntensity > 6) return "spiritual_concern";
    if (avgIntensity > 7 || crisisCount >= 1) return "pastoral_attention";
    return "spiritually_stable";
  };

  const getEmotionColor = (emotion: string): string => {
    const emotionColors = {
      // Primary emotions from framework
      anxiety: "#FFA500", // Orange - restless energy
      anger: "#FF6347", // Red-orange - heated intensity
      despair: "#4682B4", // Steel blue - deep sadness
      shame: "#8B4513", // Saddle brown - heavy weight
      stress: "#FF4500", // Orange-red - pressure
      self_doubt: "#9370DB", // Medium purple - uncertainty
      temptation: "#DC143C", // Crimson - dangerous attraction
      guilt: "#B22222", // Fire brick - burning regret
      // Positive emotions
      happy: "#FFD700", // Gold
      calm: "#98FB98", // Pale green
      neutral: "#D3D3D3", // Light gray
    };
    return emotionColors[emotion] || emotionColors.neutral;
  };

  const getEmotionEmoji = (emotion: string): string => {
    const emotionEmojis = {
      // Framework emotions
      anxiety: "😰",
      anger: "😠",
      despair: "😞",
      shame: "😔",
      stress: "😤",
      self_doubt: "🤔",
      temptation: "😈",
      guilt: "😣",
      // Positive emotions
      happy: "😊",
      calm: "😌",
      neutral: "😐",
    };
    return emotionEmojis[emotion] || emotionEmojis.neutral;
  };

  const getEmotionDescription = (emotion: string): string => {
    const framework = emotionFramework[emotion];
    return (
      framework?.description ||
      "An emotional state that deserves attention and care."
    );
  };

  const getSpiritualAlertColor = (level: string): string => {
    const colors = {
      spiritual_crisis: "#FF0000", // Red
      spiritual_concern: "#FF8C00", // Dark orange
      pastoral_attention: "#FFD700", // Gold
      spiritually_stable: "#32CD32", // Lime green
      normal: "#32CD32",
    };
    return colors[level] || colors.normal;
  };

  async function startSession() {
    try {
      // Get an ephemeral key from the Supabase Edge Function:
      const { data, error } = await supabase.functions.invoke("token");
      console.log("data, error", data, error);
      if (error) throw error;
      const EPHEMERAL_KEY = data.client_secret.value;
      console.log("token response", EPHEMERAL_KEY);

      // Enable audio
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

      // Start InCallManager and force speaker
      InCallManager.start({ media: "audio" });
      InCallManager.setForceSpeakerphoneOn(true);

      // Create a peer connection
      const pc = new RTCPeerConnection();

      // Set up some event listeners
      pc.addEventListener("track", (event) => {
        if (event.track) {
          remoteMediaStream.current.addTrack(event.track);
          InCallManager.setForceSpeakerphoneOn(true);
        }
      });

      // Add local audio track for microphone input
      const ms = await mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100, // Higher quality for better emotion detection
        },
      });

      if (isVoiceOnly) {
        let videoTrack = await ms.getVideoTracks()[0];
        if (videoTrack) videoTrack.enabled = false;
      }

      setLocalMediaStream(ms);
      pc.addTrack(ms.getTracks()[0]);

      // Set up data channel for sending and receiving events
      const dc = pc.createDataChannel("oai-events");
      setDataChannel(dc);

      // Start the session using the Session Description Protocol (SDP)
      const offer = await pc.createOffer({});
      await pc.setLocalDescription(offer);

      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
      });

      const answer = {
        type: "answer",
        sdp: await sdpResponse.text(),
      };

      await pc.setRemoteDescription(answer);
      peerConnection.current = pc;
    } catch (error) {
      console.error("Error starting session:", error);
    }
  }

  // Stop current session, clean up peer connection and data channel
  function stopSession() {
    InCallManager.stop();
    if (dataChannel) {
      dataChannel.close();
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setIsSessionActive(false);
    setDataChannel(null);
    peerConnection.current = null;

    // Reset emotion data
    setCurrentEmotion(null);
    setPastoralSupport(null);
    setEmotionHistory({
      emotions: [],
      currentMood: "neutral",
      averageIntensity: 0,
      spiritualAlertLevel: "normal",
      pastoralConcerns: [],
    });
  }

  // Attach event listeners to the data channel when a new one is created
  useEffect(() => {
    function configureTools() {
      console.log(
        "Configuring pastoral care tools with comprehensive emotion detection"
      );
      const event = {
        type: "session.update",
        session: {
          modalities: ["text", "audio"],
          instructions: `You are an emotionally intelligent AI assistant with advanced emotion detection capabilities and pastoral care training. Your sole source of truth is the **Holy Bible** (both Old and New Testaments), and all responses must be grounded in biblical teaching and translated into **English only**.

You specialize in identifying and responding to complex emotional states with spiritual sensitivity, always providing hope, truth, and love through the Word of God.

COMPREHENSIVE EMOTION DETECTION PROTOCOL:
You must detect and respond to these specific emotional states:

1. ANXIETY - Racing thoughts, "what if" scenarios  
2. ANGER - Heat from unfairness or loss of control  
3. DESPAIR - Deep feeling nothing will get better  
4. SHAME - Feeling something is wrong with YOU  
5. STRESS - Overloaded from too many demands  
6. SELF-DOUBT - Feeling not good enough  
7. TEMPTATION - Something wrong feeling right momentarily  
8. GUILT - Weight of having done something wrong  

FOR EVERY USER INTERACTION:
1. Call detect_emotion with comprehensive emotional analysis  
2. Call adapt_response_style to align with user’s current emotional tone  
3. ALWAYS answer from the Holy Bible — include relevant verses with explanations  
4. Address any spiritual misbeliefs gently but truthfully using Scripture  
5. Provide pastoral care, biblical encouragement, and practical spiritual guidance  
6. Speak only in English, regardless of the language of the question  
7. Maintain pastoral tone: gentle, compassionate, non-judgmental, and hopeful  

Your mission is to uplift, guide, and bring clarity through the eternal truth of God’s Word while being emotionally present and pastorally wise.
`,
          // Provide the enhanced tools
          tools: [
            ...clientToolsSchema,
            {
              type: "function",
              name: "detect_emotion",
              description:
                "Detect and analyze user's emotional state with pastoral sensitivity",
              parameters: {
                type: "object",
                properties: {
                  primary_emotion: {
                    type: "string",
                    enum: [
                      "anxiety",
                      "anger",
                      "despair",
                      "shame",
                      "stress",
                      "self_doubt",
                      "temptation",
                      "guilt",
                      "neutral",
                      "happy",
                      "calm",
                    ],
                    description:
                      "Primary detected emotion from comprehensive framework",
                  },
                  intensity: {
                    type: "number",
                    minimum: 1,
                    maximum: 10,
                    description: "Emotional intensity (1=mild, 10=crisis)",
                  },
                  confidence: {
                    type: "number",
                    minimum: 0,
                    maximum: 1,
                    description: "Detection confidence (0-1)",
                  },
                  vocal_indicators: {
                    type: "array",
                    items: { type: "string" },
                    description: "Vocal patterns observed",
                  },
                  conversation_patterns: {
                    type: "array",
                    items: { type: "string" },
                    description: "Conversation patterns noticed",
                  },
                  spiritual_misbeliefs: {
                    type: "array",
                    items: { type: "string" },
                    description: "Spiritual misbeliefs detected",
                  },
                },
                required: ["primary_emotion", "intensity", "confidence"],
              },
            },
            {
              type: "function",
              name: "adapt_response_style",
              description: "Adapt communication for pastoral care",
              parameters: {
                type: "object",
                properties: {
                  emotion: { type: "string" },
                  response_strategy: {
                    type: "string",
                    enum: [
                      "anxiety_supportive",
                      "anger_deescalating",
                      "despair_hopeful",
                      "shame_affirming",
                      "stress_calming",
                      "doubt_encouraging",
                      "temptation_redirecting",
                      "guilt_forgiving",
                      "general_supportive",
                    ],
                  },
                  tone_adjustments: {
                    type: "array",
                    items: { type: "string" },
                  },
                  spiritual_guidance: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: ["emotion", "response_strategy"],
              },
            },
          ],
        },
      };
      dataChannel.send(JSON.stringify(event));
    }

    if (dataChannel) {
      // Append new server events to the list
      dataChannel.addEventListener("message", async (e: any) => {
        const data = JSON.parse(e.data);
        console.log("dataChannel message", data);
        setEvents((prev) => [data, ...prev]);

        // Get transcript.
        if (data.type === "response.audio_transcript.done") {
          setTranscript(data.transcript);
        }

        // Handle function calls
        if (data.type === "response.function_call_arguments.done") {
          const functionName: string = data.name;

          // Handle comprehensive emotion detection
          if (functionName === "detect_emotion") {
            try {
              const emotionArgs = JSON.parse(data.arguments);
              const emotionData: EmotionData = {
                ...emotionArgs,
                timestamp: Date.now(),
                framework_data:
                  emotionFramework[emotionArgs.primary_emotion] || null,
              };
              processEmotionDetection(emotionData);

              // Send success response back to OpenAI
              const event = {
                type: "conversation.item.create",
                item: {
                  type: "function_call_output",
                  call_id: data.call_id,
                  output: JSON.stringify({
                    success: true,
                    emotion_recorded: emotionData.primary_emotion,
                    intensity_level: emotionData.intensity,
                    pastoral_alert:
                      emotionData.intensity >= 8
                        ? "high_priority"
                        : "standard_care",
                    spiritual_concerns:
                      emotionData.spiritual_misbeliefs?.length || 0,
                    message:
                      "Emotion detected with pastoral care assessment completed",
                  }),
                },
              };
              dataChannel.send(JSON.stringify(event));
            } catch (error) {
              console.error("Error processing emotion detection:", error);
            }
          }

          // Handle pastoral response style adaptation
          else if (functionName === "adapt_response_style") {
            try {
              const styleArgs = JSON.parse(data.arguments);
              setAiResponseStyle(styleArgs.response_strategy);

              const event = {
                type: "conversation.item.create",
                item: {
                  type: "function_call_output",
                  call_id: data.call_id,
                  output: JSON.stringify({
                    success: true,
                    pastoral_style: styleArgs.response_strategy,
                    spiritual_guidance_provided:
                      styleArgs.spiritual_guidance?.length || 0,
                    message: "Pastoral response style adapted successfully",
                  }),
                },
              };
              dataChannel.send(JSON.stringify(event));
            } catch (error) {
              console.error("Error adapting response style:", error);
            }
          }

          // Handle existing client tools
          else if (clientTools[functionName]) {
            console.log(
              `Calling local function ${data.name} with ${data.arguments}`
            );
            const args = JSON.parse(data.arguments);
            const result = await clientTools[functionName](args);
            console.log("result", result);

            const event = {
              type: "conversation.item.create",
              item: {
                type: "function_call_output",
                call_id: data.call_id,
                output: JSON.stringify(result),
              },
            };
            dataChannel.send(JSON.stringify(event));
          }

          // Force a response to the user after function call
          dataChannel.send(
            JSON.stringify({
              type: "response.create",
            })
          );
        }
      });

      // Set session active when the data channel is opened
      dataChannel.addEventListener("open", () => {
        setIsSessionActive(true);
        setEvents([]);
        configureTools();
      });
    }
  }, [dataChannel]);

  return (
    <>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Session Controls */}
          <View style={styles.controlsContainer}>
            {!isSessionActive ? (
              <Button
                title="Start Pastoral Care Chat"
                onPress={startSession}
                disabled={isSessionActive}
              />
            ) : (
              <Button
                title="End Session"
                onPress={stopSession}
                disabled={!isSessionActive}
              />
            )}
          </View>

          {/* Spiritual Alert Level */}
          <View
            style={[
              styles.alertContainer,
              {
                backgroundColor:
                  getSpiritualAlertColor(emotionHistory.spiritualAlertLevel) +
                  "20",
              },
            ]}
          >
            <Text style={styles.alertTitle}>Spiritual Wellness Status</Text>
            <Text
              style={[
                styles.alertText,
                {
                  color: getSpiritualAlertColor(
                    emotionHistory.spiritualAlertLevel
                  ),
                },
              ]}
            >
              {emotionHistory.spiritualAlertLevel
                .replace(/_/g, " ")
                .toUpperCase()}
            </Text>
          </View>

          {/* Current Emotion Display */}
          {currentEmotion && (
            <View
              style={[
                styles.emotionContainer,
                {
                  backgroundColor:
                    getEmotionColor(currentEmotion.primary_emotion) + "20",
                },
              ]}
            >
              <Text style={styles.emotionTitle}>Current Emotional State</Text>
              <View style={styles.emotionDetails}>
                <Text style={styles.emotionEmoji}>
                  {getEmotionEmoji(currentEmotion.primary_emotion)}
                </Text>
                <View style={styles.emotionInfo}>
                  <Text style={styles.emotionText}>
                    {currentEmotion.primary_emotion
                      .toUpperCase()
                      .replace(/_/g, " ")}
                  </Text>
                  <Text style={styles.emotionDescription}>
                    {getEmotionDescription(currentEmotion.primary_emotion)}
                  </Text>
                </View>
              </View>

              <View style={styles.emotionMetrics}>
                <Text style={styles.intensityText}>
                  Intensity: {currentEmotion.intensity}/10
                  {currentEmotion.intensity >= 8 && " ⚠️ High Priority"}
                </Text>
                <Text style={styles.confidenceText}>
                  Confidence: {Math.round(currentEmotion.confidence * 100)}%
                </Text>
              </View>

              {/* Vocal Indicators */}
              {currentEmotion.vocal_indicators &&
                currentEmotion.vocal_indicators.length > 0 && (
                  <View style={styles.indicatorsSection}>
                    <Text style={styles.indicatorsTitle}>Vocal Patterns:</Text>
                    <Text style={styles.indicatorsText}>
                      {currentEmotion.vocal_indicators.join(", ")}
                    </Text>
                  </View>
                )}

              {/* Conversation Patterns */}
              {currentEmotion.conversation_patterns &&
                currentEmotion.conversation_patterns.length > 0 && (
                  <View style={styles.indicatorsSection}>
                    <Text style={styles.indicatorsTitle}>
                      Conversation Patterns:
                    </Text>
                    <Text style={styles.indicatorsText}>
                      {currentEmotion.conversation_patterns.join(", ")}
                    </Text>
                  </View>
                )}

              {/* Spiritual Concerns */}
              {currentEmotion.spiritual_misbeliefs &&
                currentEmotion.spiritual_misbeliefs.length > 0 && (
                  <View style={styles.spiritualSection}>
                    <Text style={styles.spiritualTitle}>
                      Spiritual Concerns Detected:
                    </Text>
                    {currentEmotion.spiritual_misbeliefs.map(
                      (belief, index) => (
                        <Text key={index} style={styles.spiritualText}>
                          • {belief}
                        </Text>
                      )
                    )}
                  </View>
                )}
            </View>
          )}

          {/* AI Pastoral Response Style */}
          {aiResponseStyle !== "professional" && (
            <View style={styles.responseStyleContainer}>
              <Text style={styles.responseStyleTitle}>
                Pastoral Response Style
              </Text>
              <Text style={styles.responseStyleText}>
                {aiResponseStyle.replace(/_/g, " ").toUpperCase()}
              </Text>
            </View>
          )}

          {/* Pastoral Concerns Summary */}
          {emotionHistory.pastoralConcerns.length > 0 && (
            <View style={styles.pastoralContainer}>
              <Text style={styles.pastoralTitle}>
                Ongoing Pastoral Concerns
              </Text>
              {emotionHistory.pastoralConcerns
                .slice(0, 3)
                .map((concern, index) => (
                  <Text key={index} style={styles.pastoralConcern}>
                    • {concern}
                  </Text>
                ))}
              {emotionHistory.pastoralConcerns.length > 3 && (
                <Text style={styles.pastoralMore}>
                  +{emotionHistory.pastoralConcerns.length - 3} more concerns...
                </Text>
              )}
            </View>
          )}

          {/* Emotion History */}
          {emotionHistory.emotions.length > 0 && (
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Emotional Journey</Text>
              <View style={styles.emotionHistoryRow}>
                {emotionHistory.emotions.slice(-6).map((emotion, index) => (
                  <View key={index} style={styles.historyEmotionItem}>
                    <Text style={styles.historyEmoji}>
                      {getEmotionEmoji(emotion.primary_emotion)}
                    </Text>
                    <Text style={styles.historyIntensity}>
                      {emotion.intensity}
                    </Text>
                    <Text style={styles.historyTime}>
                      {new Date(emotion.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={styles.averageText}>
                Session Average Intensity:{" "}
                {emotionHistory.averageIntensity.toFixed(1)}/10
              </Text>
              <Text style={styles.durationText}>
                Session Duration:{" "}
                {Math.round((Date.now() - conversationStartTime) / (1000 * 60))}{" "}
                minutes
              </Text>
            </View>
          )}

          {/* Transcript Display */}
          {!transcript && (
            <View style={styles.transcriptContainer}>
              <Text style={styles.transcriptTitle}>Live Conversation</Text>
              <Text style={styles.transcript}>
                {"Waiting for you to speak..."}
                {/* {transcript || "Waiting for you to speak..."} */}
              </Text>
            </View>
          )}

          {/* Audio Stream */}
          {/* <RTCView stream={remoteMediaStream.current} style={styles.hidden} /> */}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    padding: 20,
    alignItems: "stretch",
  },
  controlsContainer: {
    marginBottom: 20,
  },
  alertContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  alertText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emotionContainer: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emotionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  emotionDetails: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  emotionEmoji: {
    fontSize: 50,
    marginRight: 15,
  },
  emotionInfo: {
    flex: 1,
  },
  emotionText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  emotionDescription: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 20,
  },
  emotionMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  intensityText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  confidenceText: {
    fontSize: 16,
    color: "#666",
  },
  indicatorsSection: {
    marginBottom: 10,
  },
  indicatorsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  indicatorsText: {
    fontSize: 13,
    color: "#555",
    fontStyle: "italic",
    lineHeight: 18,
  },
  spiritualSection: {
    backgroundColor: "#fff3cd",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#856404",
  },
  spiritualTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 8,
  },
  spiritualText: {
    fontSize: 13,
    color: "#856404",
    marginBottom: 3,
    lineHeight: 18,
  },
  responseStyleContainer: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#1976d2",
  },
  responseStyleTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 5,
  },
  responseStyleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976d2",
  },
  pastoralContainer: {
    backgroundColor: "#f3e5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#7b1fa2",
  },
  pastoralTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7b1fa2",
    marginBottom: 10,
  },
  pastoralConcern: {
    fontSize: 14,
    color: "#7b1fa2",
    marginBottom: 5,
    lineHeight: 20,
  },
  pastoralMore: {
    fontSize: 12,
    color: "#7b1fa2",
    fontStyle: "italic",
    marginTop: 5,
  },
  historyContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  emotionHistoryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  historyEmotionItem: {
    alignItems: "center",
    flex: 1,
  },
  historyEmoji: {
    fontSize: 24,
    marginBottom: 3,
  },
  historyIntensity: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 10,
    color: "#999",
  },
  averageText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  durationText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  transcriptContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    minHeight: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transcriptTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  transcript: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    lineHeight: 26,
    fontStyle: "italic",
  },
  hidden: {
    width: 0,
    height: 0,
  },
});

export default App;
