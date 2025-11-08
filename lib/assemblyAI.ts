export function startAssemblyAI(wsRef: React.MutableRefObject<WebSocket | null>, onTranscript: (text: string) => void) {
  wsRef.current = new WebSocket(
    "wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000",
    ["assemblyai-speech-to-text"]
  );

  wsRef.current.onopen = () => {
    console.log("AssemblyAI connected");
    wsRef.current?.send(JSON.stringify({ type: "session_config", session: { language: "en" } }));
  };

  wsRef.current.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.message_type === "FinalTranscript") {
      onTranscript(data.text);
    }
  };

  wsRef.current.onerror = (err) => console.error("AssemblyAI error", err);
  wsRef.current.onclose = () => console.log("AssemblyAI closed");
}
