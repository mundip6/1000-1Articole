"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, MessageCircle, Send, X } from "lucide-react";

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

function emailSavedKey(token: string) {
  return `chat-email-saved-${token}`;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  // "none" = no customer msg yet, "prompt" = show card, "input" = email field open, "done" = saved
  const [emailStep, setEmailStep] = useState<"none" | "prompt" | "input" | "done">("none");
  const [emailInput, setEmailInput] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const token = getSessionToken();
    const res = await fetch("/api/chat", {
      headers: { "x-chat-token": token },
    });
    const data = await res.json() as { ok: boolean; conversationId: string; messages: Msg[] };
    if (data.ok) {
      setMessages(data.messages);
      // If email already saved in localStorage, mark done
      if (localStorage.getItem(emailSavedKey(token))) {
        setEmailStep("done");
      } else if (data.messages.some((m) => m.sender === "customer")) {
        setEmailStep((prev) => prev === "none" ? "prompt" : prev);
      }
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
  }, [messages, emailStep]);

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

  const saveEmail = async () => {
    const email = emailInput.trim();
    if (!email || emailSending) return;
    setEmailSending(true);
    const token = getSessionToken();
    await fetch("/api/chat", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-chat-token": token },
      body: JSON.stringify({ email }),
    });
    localStorage.setItem(emailSavedKey(token), "1");
    setEmailStep("done");
    setEmailSending(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div className="flex w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl sm:w-[340px]" style={{ height: "min(480px, calc(100vh - 100px))" }}>
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
              <div className="rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-600 max-w-[82%]">
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

            {/* Email capture card */}
            {emailStep === "prompt" && (
              <div className="max-w-[82%] rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-700">
                <p className="font-semibold leading-snug">In caz ca plecati sau raspundem mai tarziu:</p>
                <p className="text-xs text-neutral-500 mt-0.5 mb-3 italic">cum va putem contacta?</p>
                <button
                  onClick={() => setEmailStep("input")}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:border-brand hover:text-brand"
                >
                  <Mail size={13} /> Email
                </button>
              </div>
            )}

            {emailStep === "input" && (
              <div className="max-w-[82%] rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-700">
                <p className="font-semibold mb-2 leading-snug">Adresa ta de email:</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && void saveEmail()}
                    placeholder="ex: ion@gmail.com"
                    autoFocus
                    className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-brand"
                  />
                  <button
                    onClick={() => void saveEmail()}
                    disabled={!emailInput.trim() || emailSending}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand text-white hover:bg-brand-dark disabled:opacity-40"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>
            )}

            {emailStep === "done" && (
              <div className="max-w-[82%] rounded-xl bg-green-50 border border-green-100 px-4 py-2.5 text-xs text-green-700 font-semibold">
                ✓ Va vom trimite transcriptul conversatiei pe email dupa ce va raspundem.
              </div>
            )}

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
