import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import InCallManager from "react-native-incall-manager";
import {
  mediaDevices,
  RTCPeerConnection,
  MediaStream,
} from "react-native-webrtc-web-shim";
import { supabase } from "./utils/supabase";
import { clientToolsSchema, clientTools } from "./utils/tools";
import { MicrophoneIcon, MicrophoneSlashIcon } from "phosphor-react-native";

const Listening = require("./assets/lotifee/listening.json"); // Lottie waveform animation
const Spaking = require("./assets/lotifee/spaking.json"); // Lottie waveform animation

const App = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [currentIntent, setCurrentIntent] = useState("");
  const [currentTone, setCurrentTone] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const peerConnection = useRef(null);
  const dataChannel = useRef(null);

  async function startSession() {
    // ... existing start logic
    setIsSessionActive(true);
    setIsThinking(true);
  }

  function stopSession() {
    // ... existing stop logic
    setIsSessionActive(false);
    setIsThinking(false);
  }

  useEffect(() => {
    if (!dataChannel.current) return;
    dataChannel.current.addEventListener("message", async (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "response.function_call_arguments.done") {
        if (data.name === "detect_emotion") {
          const args = JSON.parse(data.arguments);
          setCurrentEmotion(args.primary_emotion);
        }
        if (data.name === "adapt_response_style") {
          const args = JSON.parse(data.arguments);
          setCurrentTone(args.response_strategy);
        }
        if (data.name === "provide_pastoral_support") {
          const args = JSON.parse(data.arguments);
          setCurrentIntent(args.current_emotion);
        }
      }
      if (data.type === "response.create") {
        setIsThinking(false);
      }
    });
  }, [dataChannel.current]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.waveformContainer}>
        <LottieView
          source={isSessionActive ? Spaking : Listening}
          autoPlay
          // loop={isThinking}
          style={styles.waveform}
        />
        <Text style={styles.statusText}>
          {isThinking ? "AI is thinking..." : "Listening..."}
        </Text>
      </View>
      <View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Emotion:</Text>
          <Text style={styles.value}>{currentEmotion || "-"}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Intent:</Text>
          <Text style={styles.value}>{currentIntent || "-"}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Tone:</Text>
          <Text style={styles.value}>{currentTone || "-"}</Text>
        </View>
      </View>
      <View style={styles.controls}>
        {!isSessionActive ? (
          // <Button title="Start Chat" onPress={startSession} />
          <TouchableOpacity onPress={startSession}>
            <MicrophoneIcon size={32} />
          </TouchableOpacity>
        ) : (
          // <Button title="Stop Chat" onPress={stopSession} />
          <TouchableOpacity onPress={stopSession}>
            <MicrophoneSlashIcon size={32} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 20,
  },
  controls: { marginBottom: 30 },
  waveformContainer: {
    alignItems: "center",
    width: "110%",
    // marginVertical: 20,
  },
  waveform: { width: "110%", height: 200 },
  statusText: { marginTop: 10, fontSize: 16, color: "#666" },
  infoContainer: { flexDirection: "row", marginVertical: 5 },
  label: { fontWeight: "bold", marginRight: 10, fontSize: 18 },
  value: { fontSize: 18, color: "#333" },
});

export default App;
