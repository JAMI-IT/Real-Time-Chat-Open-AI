import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
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
} from "react-native-webrtc-web-shim";

const { width } = Dimensions.get("window");

// Enhanced interfaces based on your emotion detection framework
interface ConversationState {
  intent: string;
  tone: string;
  emotion: string;
  intensity: number;
  confidence: number;
  isUserSpeaking: boolean;
  isAISpeaking: boolean;
  spiritualAlerts: string[];
}

interface EmotionData {
  primary_emotion: string;
  intensity: number;
  confidence: number;
  vocal_indicators?: string[];
  conversation_patterns?: string[];
  spiritual_misbeliefs?: string[];
  timestamp: number;
}

// Animation component for speaking indicators with enhanced visual feedback
const SpeakingAnimation = ({ isActive, isUser, label, emotion, intensity }) => {
  const bounceAnims = useRef([
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
  ]).current;

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      // Wave animation
      const animations = bounceAnims.map((anim, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: intensity > 7 ? 1.2 : 1,
              duration: intensity > 7 ? 300 : 400,
              delay: index * 100,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.3,
              duration: intensity > 7 ? 300 : 400,
              useNativeDriver: true,
            }),
          ])
        )
      );

      // Pulse animation for high intensity
      if (intensity > 7) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }

      Animated.stagger(100, animations).start();
      return () => {
        animations.forEach((anim) => anim.stop());
        pulseAnim.stopAnimation();
      };
    } else {
      bounceAnims.forEach((anim) => anim.setValue(0.3));
      pulseAnim.setValue(1);
    }
  }, [isActive, intensity]);

  const getEmotionColor = (emotion: string, intensity: number) => {
    const colors = {
      anxiety: intensity > 7 ? "#FF6B35" : "#FFA500",
      anger: intensity > 7 ? "#FF0000" : "#FF6347",
      despair: intensity > 7 ? "#1E3A8A" : "#4682B4",
      shame: intensity > 7 ? "#7C2D12" : "#8B4513",
      stress: intensity > 7 ? "#DC2626" : "#FF4500",
      self_doubt: intensity > 7 ? "#7C3AED" : "#9370DB",
      temptation: intensity > 7 ? "#B91C1C" : "#DC143C",
      guilt: intensity > 7 ? "#991B1B" : "#B22222",
      happy: "#FFD700",
      calm: "#98FB98",
      neutral: "#D3D3D3",
    };
    return colors[emotion] || (isUser ? "#007AFF" : "#34C759");
  };

  return (
    <Animated.View
      style={[
        styles.speakingContainer,
        isUser ? styles.userSpeaking : styles.aiSpeaking,
        { transform: [{ scale: pulseAnim }] },
        intensity > 7 && { borderColor: getEmotionColor(emotion, intensity) },
      ]}
    >
      <Text
        style={[
          styles.speakingLabel,
          isUser ? styles.userLabel : styles.aiLabel,
        ]}
      >
        {label}
      </Text>

      {/* Emotion indicator */}
      {emotion && emotion !== "neutral" && (
        <Text
          style={[
            styles.emotionIndicator,
            { color: getEmotionColor(emotion, intensity) },
          ]}
        >
          {emotion.toUpperCase()}
        </Text>
      )}

      <View style={styles.waveContainer}>
        {bounceAnims.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.waveBar,
              {
                backgroundColor: getEmotionColor(emotion, intensity),
                transform: [{ scaleY: anim }],
              },
            ]}
          />
        ))}
      </View>

      <View
        style={[
          styles.statusDot,
          {
            backgroundColor: isActive
              ? getEmotionColor(emotion, intensity)
              : "#C7C7CC",
          },
        ]}
      />

      {/* Intensity indicator */}
      {intensity > 0 && (
        <View style={styles.intensityContainer}>
          <Text style={styles.intensityText}>{intensity}/10</Text>
          {intensity > 7 && (
            <Text
              style={[
                styles.alertText,
                { color: getEmotionColor(emotion, intensity) },
              ]}
            >
              ⚠️ HIGH
            </Text>
          )}
        </View>
      )}
    </Animated.View>
  );
};

const App = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>(
    {
      intent: "Waiting to connect...",
      tone: "Neutral",
      emotion: "neutral",
      intensity: 0,
      confidence: 0,
      isUserSpeaking: false,
      isAISpeaking: false,
      spiritualAlerts: [],
    }
  );

  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [dataChannel, setDataChannel] = useState<null | ReturnType<
    RTCPeerConnection["createDataChannel"]
  >>(null);
  const peerConnection = useRef<null | RTCPeerConnection>(null);
  const [localMediaStream, setLocalMediaStream] = useState<null | MediaStream>(
    null
  );
  const remoteMediaStream = useRef<MediaStream>(new MediaStream());

  const updateConversationState = (updates: Partial<ConversationState>) => {
    setConversationState((prev) => ({ ...prev, ...updates }));
  };

  const processEmotionDetection = (emotionData: EmotionData) => {
    updateConversationState({
      emotion: emotionData.primary_emotion,
      intensity: emotionData.intensity,
      confidence: emotionData.confidence,
    });

    // Handle high-intensity spiritual alerts
    if (emotionData.intensity >= 8) {
      const alerts = [
        `High intensity ${emotionData.primary_emotion} detected`,
        ...conversationState.spiritualAlerts.slice(-2),
      ];

      updateConversationState({ spiritualAlerts: alerts });

      Alert.alert(
        "Pastoral Care Alert",
        `High intensity ${emotionData.primary_emotion} detected (${emotionData.intensity}/10). Consider pastoral support.`,
        [{ text: "Understood" }]
      );
    }

    console.log("Emotion detected:", emotionData);
  };

  async function startSession() {
    try {
      setConnectionError(null);

      // Test Supabase connection first
      console.log("Testing Supabase connection...");

      // Get ephemeral key with better error handling
      const { data, error } = await supabase.functions.invoke("token", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (error) {
        console.error("Supabase function error:", error);
        setConnectionError(`Supabase Error: ${error.message}`);
        return;
      }

      if (!data || !data.client_secret || !data.client_secret.value) {
        console.error("Invalid response from token function:", data);
        setConnectionError("Invalid token response from server");
        return;
      }

      const EPHEMERAL_KEY = data.client_secret.value;
      console.log("Token obtained successfully");

      // Enable audio
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      InCallManager.start({ media: "audio" });
      InCallManager.setForceSpeakerphoneOn(true);

      // Create peer connection with STUN servers
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      });

      pc.addEventListener("track", (event) => {
        if (event.track) {
          remoteMediaStream.current.addTrack(event.track);
          InCallManager.setForceSpeakerphoneOn(true);
        }
      });

      // Get user media with better error handling
      const ms = await mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      });

      setLocalMediaStream(ms);
      pc.addTrack(ms.getTracks()[0]);

      // Set up data channel
      const dc = pc.createDataChannel("oai-events");
      setDataChannel(dc);

      // Create offer and set up session
      const offer = await pc.createOffer({});
      await pc.setLocalDescription(offer);

      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";

      console.log("Connecting to OpenAI...");
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
      });

      if (!sdpResponse.ok) {
        throw new Error(
          `OpenAI API error: ${sdpResponse.status} ${sdpResponse.statusText}`
        );
      }

      const answer = {
        type: "answer",
        sdp: await sdpResponse.text(),
      };
      await pc.setRemoteDescription(answer);
      peerConnection.current = pc;

      // Update UI state
      updateConversationState({
        intent: "Ready for pastoral conversation",
        tone: "Welcoming",
        emotion: "calm",
        intensity: 2,
        confidence: 0.9,
      });

      console.log("Session started successfully");
    } catch (error) {
      console.error("Error starting session:", error);
      setConnectionError(`Connection failed: ${error.message}`);

      // Clean up on error
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
      if (dataChannel) {
        dataChannel.close();
        setDataChannel(null);
      }
      InCallManager.stop();
    }
  }

  function stopSession() {
    InCallManager.stop();
    if (dataChannel) {
      dataChannel.close();
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    if (localMediaStream) {
      localMediaStream.getTracks().forEach((track) => track.stop());
    }

    setIsSessionActive(false);
    setDataChannel(null);
    peerConnection.current = null;
    setLocalMediaStream(null);
    setConnectionError(null);

    // Reset state
    setConversationState({
      intent: "Session ended",
      tone: "Neutral",
      emotion: "neutral",
      intensity: 0,
      confidence: 0,
      isUserSpeaking: false,
      isAISpeaking: false,
      spiritualAlerts: [],
    });
  }

  useEffect(() => {
    function configureTools() {
      const event = {
        type: "session.update",
        session: {
          modalities: ["text", "audio"],
          instructions: `You are an emotionally intelligent AI assistant with advanced emotion detection capabilities and pastoral care training. Your responses must be grounded in biblical teaching.

COMPREHENSIVE EMOTION DETECTION PROTOCOL:
For EVERY user interaction, you must:

1. Call detect_emotion to identify one of these 8 emotions:
   - ANXIETY: Racing thoughts, "what if" scenarios
   - ANGER: Heat from unfairness or loss of control  
   - DESPAIR: Deep feeling nothing will get better
   - SHAME: Feeling something wrong with YOU
   - STRESS: Overloaded from too many demands
   - SELF_DOUBT: Feeling not good enough
   - TEMPTATION: Something wrong feeling right momentarily
   - GUILT: Weight of having done something wrong

2. Analyze vocal patterns, conversation indicators, and spiritual context
3. Provide pastoral care with appropriate intensity level
4. Address spiritual misbeliefs with biblical truth

Use detect_conversation_state function to report intent, tone, and emotion.`,

          tools: [
            {
              type: "function",
              name: "detect_conversation_state",
              description: "Detect user intent, tone, and primary emotion",
              parameters: {
                type: "object",
                properties: {
                  intent: {
                    type: "string",
                    description: "What the user is trying to accomplish",
                  },
                  tone: {
                    type: "string",
                    description:
                      "The emotional quality/tone of the conversation",
                  },
                  emotion: {
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
                      "Primary emotion detected from the 8-emotion framework",
                  },
                },
                required: ["intent", "tone", "emotion"],
              },
            },
            {
              type: "function",
              name: "detect_emotion",
              description:
                "Comprehensive emotion detection with pastoral insights",
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
          ],
        },
      };
      dataChannel.send(JSON.stringify(event));
    }

    if (dataChannel) {
      dataChannel.addEventListener("message", async (e: any) => {
        const data = JSON.parse(e.data);
        console.log("dataChannel message", data);

        // Handle speaking states
        if (data.type === "response.audio.delta") {
          updateConversationState({
            isAISpeaking: true,
            isUserSpeaking: false,
          });
        } else if (data.type === "response.audio.done") {
          updateConversationState({ isAISpeaking: false });
        } else if (data.type === "input_audio_buffer.speech_started") {
          updateConversationState({
            isUserSpeaking: true,
            isAISpeaking: false,
          });
        } else if (data.type === "input_audio_buffer.speech_stopped") {
          updateConversationState({ isUserSpeaking: false });
        }

        // Handle function calls
        if (data.type === "response.function_call_arguments.done") {
          const functionName: string = data.name;

          if (functionName === "detect_conversation_state") {
            try {
              const stateArgs = JSON.parse(data.arguments);
              updateConversationState({
                intent: stateArgs.intent,
                tone: stateArgs.tone,
                emotion: stateArgs.emotion,
              });

              const event = {
                type: "conversation.item.create",
                item: {
                  type: "function_call_output",
                  call_id: data.call_id,
                  output: JSON.stringify({
                    success: true,
                    message: "Conversation state updated successfully",
                  }),
                },
              };
              dataChannel.send(JSON.stringify(event));
              dataChannel.send(JSON.stringify({ type: "response.create" }));
            } catch (error) {
              console.error("Error processing conversation state:", error);
            }
          } else if (functionName === "detect_emotion") {
            try {
              const emotionArgs = JSON.parse(data.arguments);
              const emotionData: EmotionData = {
                ...emotionArgs,
                timestamp: Date.now(),
              };

              processEmotionDetection(emotionData);

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
                    message: "Emotion detected with pastoral care assessment",
                  }),
                },
              };
              dataChannel.send(JSON.stringify(event));
              dataChannel.send(JSON.stringify({ type: "response.create" }));
            } catch (error) {
              console.error("Error processing emotion detection:", error);
            }
          }
        }
      });

      dataChannel.addEventListener("open", () => {
        setIsSessionActive(true);
        configureTools();
        console.log("Data channel opened");
      });

      dataChannel.addEventListener("close", () => {
        console.log("Data channel closed");
        setIsSessionActive(false);
      });

      dataChannel.addEventListener("error", (error) => {
        console.error("Data channel error:", error);
        setConnectionError("Data channel error occurred");
      });
    }
  }, [dataChannel]);

  return (
    <>
      <StatusBar style="light" backgroundColor="#000" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pastoral Voice Chat</Text>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor: isSessionActive ? "#34C759" : "#FF3B30",
              },
            ]}
          >
            <Text style={styles.statusText}>
              {isSessionActive ? "Connected" : "Disconnected"}
            </Text>
          </View>
        </View>

        {/* Connection Error Display */}
        {connectionError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {connectionError}</Text>
            <Text style={styles.errorHint}>
              Check your internet connection and Supabase configuration
            </Text>
          </View>
        )}

        {/* Main Chat Interface */}
        <View style={styles.chatInterface}>
          {/* Speaking Animations */}
          <View style={styles.speakingSection}>
            <SpeakingAnimation
              isActive={conversationState.isUserSpeaking}
              isUser={true}
              label="You"
              emotion={conversationState.emotion}
              intensity={conversationState.intensity}
            />
            <SpeakingAnimation
              isActive={conversationState.isAISpeaking}
              isUser={false}
              label="Assistant"
              emotion="calm"
              intensity={2}
            />
          </View>

          {/* Core Information Display */}
          <View style={styles.infoContainer}>
            {/* Intent */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Intent</Text>
              <Text style={styles.infoValue}>{conversationState.intent}</Text>
            </View>

            {/* Tone */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Tone</Text>
              <Text style={styles.infoValue}>{conversationState.tone}</Text>
            </View>

            {/* Emotion with enhanced display */}
            <View
              style={[
                styles.infoCard,
                conversationState.intensity > 7 && styles.highIntensityCard,
              ]}
            >
              <Text style={styles.infoLabel}>Emotion</Text>
              <View style={styles.emotionDisplay}>
                <Text style={styles.infoValue}>
                  {conversationState.emotion.replace("_", " ").toUpperCase()}
                </Text>
                {conversationState.intensity > 0 && (
                  <View style={styles.emotionMetrics}>
                    <Text style={styles.intensityDisplayText}>
                      Intensity: {conversationState.intensity}/10
                    </Text>
                    <Text style={styles.confidenceText}>
                      Confidence:{" "}
                      {Math.round(conversationState.confidence * 100)}%
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Spiritual Alerts */}
          {conversationState.spiritualAlerts.length > 0 && (
            <View style={styles.alertsContainer}>
              <Text style={styles.alertsTitle}>Pastoral Care Alerts</Text>
              {conversationState.spiritualAlerts
                .slice(0, 2)
                .map((alert, index) => (
                  <Text key={index} style={styles.alertText}>
                    • {alert}
                  </Text>
                ))}
            </View>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {!isSessionActive ? (
            <Button
              title="Start Pastoral Conversation"
              onPress={startSession}
              color="#007AFF"
            />
          ) : (
            <Button
              title="End Conversation"
              onPress={stopSession}
              color="#FF3B30"
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: "#2C1B1B",
    margin: 15,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  errorHint: {
    color: "#999",
    fontSize: 12,
    fontStyle: "italic",
  },
  chatInterface: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  speakingSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  speakingContainer: {
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    minWidth: 140,
  },
  userSpeaking: {
    backgroundColor: "#1C1C1E",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  aiSpeaking: {
    backgroundColor: "#1C1C1E",
    borderWidth: 2,
    borderColor: "#34C759",
  },
  speakingLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  userLabel: {
    color: "#007AFF",
  },
  aiLabel: {
    color: "#34C759",
  },
  emotionIndicator: {
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  waveContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    marginBottom: 10,
  },
  waveBar: {
    width: 4,
    height: 30,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  intensityContainer: {
    alignItems: "center",
  },
  intensityText: {
    color: "#999",
    fontSize: 10,
    fontWeight: "600",
  },
  alertText: {
    color: "#FF6B35",
    fontSize: 9,
    fontWeight: "800",
  },
  infoContainer: {
    gap: 20,
  },
  infoCard: {
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  highIntensityCard: {
    borderColor: "#FF6B35",
    borderWidth: 2,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
    lineHeight: 24,
  },
  emotionDisplay: {
    gap: 8,
  },
  emotionMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  intensityDisplayText: {
    fontSize: 14,
    color: "#FFD60A",
    fontWeight: "600",
  },
  confidenceText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  alertsContainer: {
    backgroundColor: "#2C1B1B",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B35",
  },
  alertsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6B35",
    marginBottom: 8,
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
});

export default App;
