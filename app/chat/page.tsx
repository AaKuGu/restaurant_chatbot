"use client";

import { useRef, useState } from "react";

export default function App() {
  const [conversation, setConversation] = useState([
    {
      role: "assistant",
      content: "Hi! Ask me about our menu, hours, or reservations!",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

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

  const closeChat = () => {
    window.parent.postMessage("CLOSE_CHAT", "*");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br bg-white py-2">
      <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 md:w-[500px] w-full shadow-xl shadow-green-200">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-green-600 text-white px-6 py-4 shadow-md flex items-center justify-between">
          {/* Left: Branding */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-lg">
              🍽️
            </div>
            <div>
              <h1 className="font-semibold leading-tight">Tasty Bites</h1>
              <p className="text-xs opacity-80">AI Restaurant Assistant</p>
            </div>
          </div>

          {/* Right: Close button */}
          <button
            onClick={() => window.parent.postMessage("CLOSE_CHAT", "*")}
            className="text-2xl leading-none hover:opacity-80 transition"
            aria-label="Close chat"
          >
            ×
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {conversation.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
                  🤖
                </div>
              )}

              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-white text-gray-800 rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                  🧑
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                🤖
              </div>
              <span className="animate-pulse">Typing…</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="sticky bottom-0 bg-white border-t px-4 py-3">
          <div className="flex items-center gap-3">
            <input
              className="flex-1 rounded-full border px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ask about menu, hours, reservations…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 py-3 text-sm font-medium shadow"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
