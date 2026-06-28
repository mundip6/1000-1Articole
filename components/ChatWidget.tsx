"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type Msg = { id: string; text: string; sender: string; createdAt: string };

function getSessionToken(): string {
  const key = "chat-session-token";
  let token = localStorage.getItem(key);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(key, token);
  }
  return token;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [convId, setConvId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const res = await fetch("/api/chat", {
      headers: { "x-chat-token": getSessionToken() },
    });
    const data = await res.json() as { ok: boolean; conversationId: string; messages: Msg[] };
    if (data.ok) {
      setConvId(data.conversationId);
      setMessages(data.messages);
    }
  };

  useEffect(() => {
    if (!open) return;
    void load();
    const interval = setInterval(() => void load(), 5000);
    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setText("");
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-chat-token": getSessionToken() },
      body: JSON.stringify({ text: trimmed }),
    });
    await load();
    setSending(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div className="flex w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl sm:w-[340px]" style={{ height: "min(420px, calc(100vh - 100px))" }}>
          {/* Header */}
          <div className="flex items-center justify-between bg-brand px-4 py-3">
            <div>
              <p className="text-sm font-black text-white">Suport 1000&amp;1 Articole</p>
              <p className="text-[11px] text-white/75">Raspundem in maxim 3 ore</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-600 max-w-[80%]">
                Buna ziua! 👋 Cum va putem ajuta? Lasati un mesaj si va raspundem in maxim 3 ore.
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  msg.sender === "customer"
                    ? "bg-brand text-white rounded-br-sm"
                    : "bg-neutral-100 text-neutral-800 rounded-bl-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-neutral-100 p-3 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && void send()}
              placeholder="Scrie un mesaj..."
              className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <button
              onClick={() => void send()}
              disabled={sending || !text.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white hover:bg-brand-dark disabled:opacity-40"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg hover:bg-brand-dark"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
