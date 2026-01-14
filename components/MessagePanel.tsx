"use client";

import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface Message {
  id: number;
  sender: "visitor" | "owner";
  text: string;
}

export default function MessagePanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "visitor",
        text: input,
      },
    ]);

    setInput("");
  };

  return (
    <div className="mt-4 rounded-2xl border border-border bg-background p-3 space-y-3">
      {/* Messages */}
      <div className="max-h-28 overflow-y-auto space-y-2 text-sm">
        {messages.length === 0 && (
          <p className="text-muted text-xs text-center">
            You can leave a quick message while waiting
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "visitor"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-xl max-w-[80%] ${
                msg.sender === "visitor"
                  ? "bg-primary text-white"
                  : "bg-muted/20 text-foreground"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 bg-muted/10 rounded-full px-4 py-2 text-sm outline-none"
        />

        <button
          onClick={sendMessage}
          className="p-2 rounded-full bg-primary text-white"
        >
          <PaperAirplaneIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
