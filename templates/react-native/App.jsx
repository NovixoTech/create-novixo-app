import React from "react";
import { View, Text, Button } from "react-native";
import { useNetworkStatus, useNovixoAI } from "novixo-react";

export default function App() {
  const { state, isOffline } = useNetworkStatus();
  const { ask, response, loading } = useNovixoAI({
    keys: {
      groq: process.env.GROQ_KEY,
      gemini: process.env.GEMINI_KEY,
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>My Novixo App</Text>
      <Text>Network: {state} {isOffline ? "⛔" : "✅"}</Text>
      <Button title={loading ? "Thinking..." : "Ask AI"} onPress={() => ask("Say hello")} disabled={loading} />
      {response ? <Text>{response}</Text> : null}
    </View>
  );
}
