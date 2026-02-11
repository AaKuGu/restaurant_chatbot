"use client";

import { useRef, useState, useEffect } from "react";

export default function App() {
  const [conversation, setConversation] = useState([
    {
      role: "assistant",
      content: "Hi! Ask me about our menu, hours, or reservations!",
      messageType: "text",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedConversation = [
      ...conversation,
      { role: "user", content: input, messageType: "text" },
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
            conversation: updatedConversation.map((msg) => ({
              role: msg.role,
              content:
                typeof msg.content === "string"
                  ? msg.content
                  : JSON.stringify(msg.content),
            })),
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();

      // MENU RESPONSE
      if (data.type === "menu" && Array.isArray(data.items)) {
        setConversation([
          ...updatedConversation,
          {
            role: "assistant",
            content: data.items,
            messageType: "menu",
          },
        ]);
      }
      // RESERVATION CONFIRMATION
      else if (data.type === "reservation" && data.data) {
        setConversation([
          ...updatedConversation,
          {
            role: "assistant",
            content: data.data,
            messageType: "reservation",
            reply: data.reply,
          },
        ]);
      }
      // NORMAL TEXT RESPONSE
      else if (data.type === "text" && data.reply) {
        setConversation([
          ...updatedConversation,
          {
            role: "assistant",
            content: data.reply,
            messageType: "text",
          },
        ]);
      } else {
        // Fallback for unexpected response format
        setConversation([
          ...updatedConversation,
          {
            role: "assistant",
            content: "Sorry, I received an unexpected response format.",
            messageType: "text",
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setConversation([
        ...updatedConversation,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          messageType: "text",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-white py-2">
      <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 md:w-[500px] w-full shadow-xl shadow-green-200">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-green-600 text-white px-6 py-4 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-lg">
              🍽️
            </div>
            <div>
              <h1 className="font-semibold leading-tight">Tasty Bites</h1>
              <p className="text-xs opacity-80">AI Restaurant Assistant</p>
            </div>
          </div>

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
                <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm flex-shrink-0">
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
                {/* MENU RENDERING */}
                {msg.messageType === "menu" ? (
                  <div className="space-y-3">
                    <div className="font-medium text-green-700 mb-2">
                      🍽️ Our Menu
                    </div>
                    {Array.isArray(msg.content) && msg.content.length > 0 ? (
                      msg.content.map((item, index) => (
                        <div
                          key={index}
                          className="border rounded-xl p-3 bg-gray-50 shadow-sm hover:shadow-md transition"
                        >
                          <div className="font-medium text-gray-800">
                            {item.name}
                          </div>
                          <div className="text-green-600 font-semibold mt-1">
                            ₹{item.price}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">
                        No menu items available
                      </div>
                    )}
                  </div>
                ) : msg.messageType === "reservation" ? (
                  // RESERVATION CONFIRMATION RENDERING
                  <div className="space-y-3">
                    <div className="font-semibold text-green-700 text-base flex items-center gap-2">
                      <span className="text-xl">✅</span> Reservation Confirmed!
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{msg.content.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{msg.content.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{msg.content.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{msg.content.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">People:</span>
                        <span className="font-medium">
                          {msg.content.people}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      We look forward to serving you! 🍽️
                    </div>
                  </div>
                ) : (
                  // TEXT RENDERING
                  <div className="whitespace-pre-line">{msg.content}</div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0">
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
        <div className="sticky bottom-0 bg-white border-t px-4 py-3 shadow-lg">
          <div className="flex items-center gap-3">
            <input
              className="flex-1 rounded-full border px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ask about menu, hours, reservations…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="rounded-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 text-sm font-medium shadow transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}