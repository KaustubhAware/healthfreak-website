"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function ChatbotPage() {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ user: string; bot: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_email: user?.primaryEmailAddress?.emailAddress || "guest@example.com",
        message: input,
      }),
    });

    const data = await res.json();
    setChat([...chat, { user: input, bot: data.reply }]);
    setInput("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-4">
        <h1 className="text-xl font-bold mb-4 text-center text-blue-600">
          🩺 Health Chatbot
        </h1>

        <div className="h-64 overflow-y-auto border p-3 rounded mb-3 bg-gray-100">
          {chat.length === 0 && (
            <p className="text-gray-500 text-sm text-center mt-8">
              Start chatting with your AI health assistant 💬
            </p>
          )}

          {chat.map((msg, idx) => (
            <div key={idx} className="mb-2">
              <p className="font-semibold text-blue-700">You:</p>
              <p className="ml-2">{msg.user}</p>
              <p className="font-semibold text-green-700 mt-1">Bot:</p>
              <p className="ml-2">{msg.bot}</p>
              <hr className="my-2" />
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            placeholder="Ask your medical question..."
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
