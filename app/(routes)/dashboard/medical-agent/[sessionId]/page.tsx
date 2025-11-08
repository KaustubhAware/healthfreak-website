'use client';

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { useVapi, VapiType } from "@/app/hooks/useVapi";
import HealthSymptomChecker from "@/components/HealthSymptomChecker";
import { X, Info, Mic, Phone, MessageSquare } from "lucide-react";

type DoctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image?: string;
};

type ConversationMessage = {
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
};

type SessionDetail = {
  id: number;
  notes: string;
  chatId: string;
  finalReport: JSON | null;
  agentId: number | null;
  createdOn: string;
  conversation: ConversationMessage[] | null;
  selectedDoctor?: DoctorAgent;
};

export default function MedicalVoiceAgentPage() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  const { vapiRef, isReady, error: vapiError } = useVapi();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const listenersAttached = useRef(false);

  // conversation scroll ref
  const convoRef = useRef<HTMLDivElement | null>(null);

  // Fetch session details
  useEffect(() => {
    if (!sessionId) return;
    const fetchSession = async () => {
      try {
        const res = await axios.get(`/api/session-chat?sessionId=${sessionId}`);
        setSessionDetail(res.data);
      } catch (err: any) {
        console.error("Error fetching session:", err.response?.data || err.message);
      }
    };
    fetchSession();
  }, [sessionId]);

  // scroll to bottom whenever conversation changes
  useEffect(() => {
    if (!convoRef.current) return;
    convoRef.current.scrollTo({ top: convoRef.current.scrollHeight, behavior: "smooth" });
  }, [sessionDetail?.conversation?.length]);

  // Handle global errors and Daily.co errors (unchanged)
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('Meeting has ended') ||
          event.message?.includes('DailyIframe') ||
          event.message?.includes('ejection')) {
        return;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('Meeting has ended') ||
          event.reason?.message?.includes('ejection')) {
        event.preventDefault();
        return;
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Cleanup on unmount (unchanged)
  useEffect(() => {
    return () => {
      if (ws) {
        try {
          ws.close();
        } catch (err) {
          console.warn("Error closing WebSocket:", err);
        }
      }

      if (vapiRef.current && isCalling) {
        try {
          vapiRef.current.stop().catch(() => { });
        } catch (err) { }
      }
    };
  }, [ws, isCalling]);

  // Add message to conversation and save in DB (unchanged)
  const addMessage = async (role: 'user' | 'ai', content: string) => {
    const timestamp = new Date().toISOString();

    setSessionDetail(prev =>
      prev
        ? {
            ...prev,
            conversation: [
              ...(prev.conversation || []),
              { role, content, timestamp },
            ],
          }
        : null
    );

    try {
      const chatId = sessionDetail?.chatId || sessionId;

      if (!chatId) {
        console.warn("No chatId found — conversation not saved.");
        return;
      }

      const res = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          sender: role,
          message: content,
          timestamp,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Save failed:", data);
      } else {
        console.log("Message saved:", data);
      }
    } catch (err) {
      console.error("Error saving conversation:", err);
    }
  };

  // (All transcription / call logic left intact - not changed)
  // ... startTranscription, requestMicrophonePermission, startCall, stopCall etc.
  // (For brevity in this view I will keep the functions exactly as in your original file)
  // Start AssemblyAI WebSocket for live transcription (optional)
  const startTranscription = () => {
    const assemblyKey = process.env.NEXT_PUBLIC_ASSEMBLYAI_KEY;
    if (!assemblyKey || assemblyKey.includes('your_assemblyai') || assemblyKey.length < 10) {
      console.log("AssemblyAI not configured - transcription disabled");
      return;
    }

    if (ws) {
      try {
        ws.close();
      } catch (err) {
        console.warn("Error closing existing WebSocket:", err);
      }
    }

    try {
      const token = assemblyKey.trim();
      const socket = new WebSocket(
        `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`,
        ['assemblyai-speech-to-text']
      );

      socket.onopen = () => {
        console.log("AssemblyAI WebSocket connected successfully");
        socket.send(JSON.stringify({
          type: "session_config",
          session: { language: "en" }
        }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.message_type === 'FinalTranscript' && data.text) {
            addMessage('user', data.text);
          }
        } catch (err) {
          console.error("Error parsing AssemblyAI message:", err);
        }
      };

      socket.onerror = (err) => {
        console.warn("AssemblyAI transcription unavailable (optional feature)");
      };

      socket.onclose = (event) => {
        console.log("AssemblyAI WebSocket closed", event.code, event.reason || '');
      };

      setWs(socket);
    } catch (err) {
      console.warn("Could not start AssemblyAI transcription:", err);
    }
  };

  // Request microphone permissions
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      console.log("Microphone permission granted");
      return true;
    } catch (err) {
      console.error("Microphone permission denied:", err);
      alert("Microphone access is required for voice calls. Please allow microphone access and try again.");
      return false;
    }
  };

  // Start call (kept identical to your original Vapi logic)
  const startCall = async () => {
    if (!isReady || !vapiRef.current) {
      console.error("Vapi is not ready yet", { isReady, hasRef: !!vapiRef.current, error: vapiError });
      alert(vapiError || "Vapi is not ready. Please try again in a moment.");
      return;
    }

    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;

    setIsCalling(true);
    try {
      console.log("Vapi instance:", vapiRef.current);
      console.log("Available methods:", Object.keys(vapiRef.current));

      if (typeof vapiRef.current.start !== 'function') {
        throw new Error("start method not available on Vapi instance");
      }

      const assistantConfig = {
        model: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a friendly and approachable General Physician AI. Start the conversation by greeting the user warmly and asking how they're feeling. Gently guide them through their symptoms and offer helpful suggestions on next steps in a calm and caring tone."
            }
          ]
        },
        voice: {
          provider: "playht",
          voiceId: "jennifer"
        },
        firstMessage: "Hello! I'm Dr. AI. How are you feeling today?"
      };

      // if (vapiRef.current && !listenersAttached.current) {
      //   vapiRef.current.on('message', (message: any) => {
      //     if (message?.type === 'user') addMessage('user', message.text);
      //     else if (message?.type === 'assistant') addMessage('ai', message.text);
      //   });
        if (vapiRef.current && !listenersAttached.current) {
  vapiRef.current.on("message", (message: any) => {
    console.log("📩 Vapi message:", message);

    // ✅ 1️⃣ handle live transcripts (real-time conversation updates)
    if (message?.type === "transcript" && message?.transcript) {
      if (message.transcriptType === "final") {
        const role = message.role === "assistant" ? "ai" : "user";
        addMessage(role, message.transcript);
      }
    }

    // ✅ 2️⃣ normal chat messages (existing logic kept intact)
    else if (message?.type === "user" && message?.text) {
      addMessage("user", message.text);
    } else if (message?.type === "assistant" && message?.text) {
      addMessage("ai", message.text);
    } else if (message?.role === "assistant" && message?.content) {
      addMessage("ai", message.content);
    } else if (message?.role === "user" && message?.content) {
      addMessage("user", message.content);
    }
  });
        vapiRef.current.on('call-start-failed', (event: any) => {
          alert(`Failed to start call: ${event?.error || event?.message || 'Unknown error'}`);
          setIsCalling(false);
        });

        vapiRef.current.on('call-end', () => {
          setIsCalling(false);
          setWs(null);
        });

        listenersAttached.current = true;
      }

      try {
        const result = await vapiRef.current.start(assistantConfig);
        console.log("Vapi start result:", result);
      } catch (err) {
        alert(`Call failed: ${err instanceof Error ? err.message : String(err)}`);
        setIsCalling(false);
        return;
      }
    } catch (err) {
      console.error("Error starting Vapi:", err);
      const errorMessage = err instanceof Error ? err.message : String(err) || "Failed to start call";
      alert(errorMessage);
      setIsCalling(false);
    }
  };

  const stopCall = async () => {
    if (vapiRef.current) await vapiRef.current.stop();
    if (ws) ws.close();
    setIsCalling(false);
  };

  // helper: friendly placeholder text for empty conversation
  const renderEmptyConversation = () => (
    <div className="text-center text-gray-500 p-6">
      No conversation yet. Start a call to begin the session.
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white p-4 rounded-b shadow">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="logo" width={40} height={40} />
          <div>
            <div className="text-lg font-bold text-gray-900">HealthFreak</div>
            <div className="text-xs text-gray-500">Medical Voice Agent</div>
          </div>
        </div>

        <div className="hidden md:flex gap-6 text-gray-700">
          <a href="#" className="hover:text-black font-medium">Dashboard</a>
          <a href="#" className="hover:text-black font-medium">Consultations</a>
          <a href="#" className="hover:text-black font-medium">Settings</a>
        </div>

        <UserButton afterSignOutUrl="/" />
      </nav>

      {/* Page content */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Doctor Card */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                  {sessionDetail?.selectedDoctor?.image ? (
                    <img src={sessionDetail.selectedDoctor.image} alt="Doctor" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-sm text-gray-500">Doctor</div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    {sessionDetail?.selectedDoctor?.specialist || "Doctor"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {sessionDetail?.selectedDoctor?.description || "AI specialist assistant"}
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="w-full text-sm px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-gray-700 flex items-center gap-2 justify-center"
                >
                  <Info className="w-4 h-4" />
                  Session Details
                </button>

                {!isCalling ? (
                  <button
                    onClick={startCall}
                    disabled={!isReady}
                    className={`w-full px-3 py-2 rounded-lg text-white font-medium ${
                      isReady ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <Mic className="w-4 h-4 inline-block mr-2" />
                    {isReady ? 'Start Voice Call' : 'Loading'}
                  </button>
                ) : (
                  <button
                    onClick={stopCall}
                    className="w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
                  >
                    <Phone className="w-4 h-4 inline-block mr-2" />
                    End Call
                  </button>
                )}

                {vapiError && <div className="text-xs text-red-600 mt-2">{vapiError}</div>}
                {!isReady && !vapiError && <div className="text-xs text-gray-500 mt-2">Initializing voice engine...</div>}
              </div>
            </div>
          </aside>

          {/* Center: Conversation */}
          <section className="lg:col-span-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border h-[66vh] flex flex-col">
              <div className="flex items-center justify-between px-2 pb-3 border-b mb-3">
                <div className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  Conversation
                </div>
                <div className="text-xs text-gray-500">Session ID: {sessionDetail?.id ?? '—'}</div>
              </div>

              <div
                ref={convoRef}
                className="flex-1 overflow-y-auto px-2 pb-3 space-y-3"
                style={{ overscrollBehavior: 'contain' }}
              >
                {sessionDetail?.conversation?.length ? (
                  sessionDetail.conversation.map((msg, idx) => {
                    const isUser = msg.role === 'user';
                    return (
                      <div
                        key={idx}
                        className={`max-w-[85%] p-3 rounded-lg break-words ${isUser ? 'ml-auto bg-blue-50 text-right' : 'mr-auto bg-gray-50 text-left'}`}
                      >
                        <div className="text-sm text-gray-800 leading-snug">{msg.content}</div>
                        <div className="text-xs text-gray-400 mt-2">{new Date(msg.timestamp).toLocaleString()}</div>
                      </div>
                    );
                  })
                ) : (
                  renderEmptyConversation()
                )}
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="You can type a note or press Start Voice Call to speak..."
                    className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-300"
                    readOnly // keep readonly to avoid changing behavior; messages come from Vapi/transcription
                    aria-label="conversation input"
                  />
                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                    title="View session details"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Right: Session meta / tools */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border space-y-4">
              <div>
                <div className="text-sm font-semibold text-gray-800">Session Notes</div>
                <div className="text-sm text-gray-600 mt-2">{sessionDetail?.notes ?? 'No notes available.'}</div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-800">Created</div>
                <div className="text-sm text-gray-600 mt-1">{sessionDetail?.createdOn ?? '—'}</div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-800">Doctor ID</div>
                <div className="text-sm text-gray-600 mt-1">{sessionDetail?.agentId ?? 'N/A'}</div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    // quick action: open details modal
                    setIsDialogOpen(true);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  View Session Info
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Dialog Modal */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Session Details</h3>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                  aria-label="Close session details"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {sessionDetail ? (
                <div className="space-y-3 text-sm text-gray-700">
                  <div><strong>ID:</strong> {sessionDetail.id}</div>
                  <div><strong>Notes:</strong> {sessionDetail.notes || '—'}</div>
                  <div><strong>Chat ID:</strong> {sessionDetail.chatId || '—'}</div>
                  <div><strong>Created:</strong> {sessionDetail.createdOn || '—'}</div>
                  <div><strong>Doctor ID:</strong> {sessionDetail.agentId ?? 'N/A'}</div>
                  {sessionDetail.finalReport && (
                    <div>
                      <strong>Final Report:</strong>
                      <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto">{JSON.stringify(sessionDetail.finalReport, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">Loading...</div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Symptom checker component (kept as before) */}
      <HealthSymptomChecker />
    </div>
  );
}
