import { useNovixoInit, useNetworkStatus, useNovixoAI } from "novixo-react";

export default function App() {
  const { ready, initializing, error } = useNovixoInit({
    syncHandler: async (item) => {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      return res.ok;
    },
  });

  const { state, isOffline } = useNetworkStatus();
  const { ask, response, loading } = useNovixoAI({
    keys: {
      groq: import.meta.env.VITE_GROQ_KEY,
      gemini: import.meta.env.VITE_GEMINI_KEY,
    },
  });

  if (initializing) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>My Novixo App</h1>
      <p>Network: <strong>{state}</strong> {isOffline ? "⛔" : "✅"}</p>
      <button onClick={() => ask("Say hello in one sentence")} disabled={loading}>
        {loading ? "Thinking..." : "Ask AI"}
      </button>
      {response && <p>{response}</p>}
    </div>
  );
}
