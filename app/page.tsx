"use client";

import { useState } from "react";

export default function App() {
  const [conversation, setConversation] = useState([
    {
      role: "assistant",
      content: "Hi! Ask me about our menu, hours, or reservations!",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedConversation = [
      ...conversation,
      { role: "user", content: input },
    ];

    setConversation(updatedConversation);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation: updatedConversation,
          }),
        },
      );

      const data = await res.json();

      setConversation([
        ...updatedConversation,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setConversation([
        ...updatedConversation,
        {
          role: "assistant",
          content: "Sorry, something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-green-600 text-white text-center py-4 font-semibold">
        🍽️ Tasty Bites Restaurant
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {conversation.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-white text-gray-800 mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500">Typing…</div>}
      </div>

      <div className="p-4 bg-white flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 text-black"
          placeholder="Ask about menu, hours, reservations..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
