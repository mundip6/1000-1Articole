"use client";

import { useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { MessageCircle, Send } from "lucide-react";
import AdminShell from "@/components/AdminShell";

type Msg = { id: string; text: string; sender: string; createdAt: string };
type Conv = { id: string; ip: string; updatedAt: string; messages: Msg[] };

export const dynamic = "force-dynamic";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conv[]>([]);
  const [selected, setSelected] = useState<Conv | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadConversations = async () => {
    const res = await fetch("/api/admin/chat");
    if (res.status === 401) { redirect("/admin"); return; }
    const data = await res.json() as { ok: boolean; conversations: Conv[] };
    if (data.ok) setConversations(data.conversations);
  };

  const loadMessages = async (convId: string) => {
    const res = await fetch(`/api/admin/chat/reply?id=${convId}`);
    const data = await res.json() as { ok: boolean; messages: Msg[] };
    if (data.ok) setMessages(data.messages);
  };

  useEffect(() => {
    void loadConversations();
    const interval = setInterval(() => void loadConversations(), 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selected) return;
    void loadMessages(selected.id);
    const interval = setInterval(() => void loadMessages(selected.id), 4000);
    return () => clearInterval(interval);
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = async () => {
    if (!reply.trim() || !selected || sending) return;
    setSending(true);
    await fetch("/api/admin/chat/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: selected.id, text: reply.trim() }),
    });
    setReply("");
    await loadMessages(selected.id);
    await loadConversations();
    setSending(false);
  };

  const fmt = (date: string) =>
    new Date(date).toLocaleString("ro-RO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

  return (
    <AdminShell title="Conversatii" description="Mesaje primite de la vizitatori." active="conversations">
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">

        {/* Conversation list */}
        <section className="rounded-lg border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-4 py-3 flex items-center justify-between">
            <h2 className="font-black">Conversatii</h2>
            <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-black text-white">{conversations.length}</span>
          </div>
          <div className="divide-y divide-neutral-100">
            {conversations.length === 0 && (
              <p className="p-6 text-center text-sm text-neutral-400">Nicio conversatie inca.</p>
            )}
            {conversations.map((conv) => {
              const last = conv.messages[0];
              return (
                <button
                  key={conv.id}
                  onClick={() => { setSelected(conv); setMessages([]); }}
                  className={`w-full px-4 py-3 text-left hover:bg-neutral-50 ${selected?.id === conv.id ? "bg-red-50" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-brand">IP: {conv.ip}</span>
                    <span className="text-[10px] text-neutral-400">{fmt(conv.updatedAt)}</span>
                  </div>
                  {last && (
                    <p className={`mt-1 truncate text-xs ${last.sender === "customer" ? "text-neutral-700" : "text-neutral-400"}`}>
                      {last.sender === "admin" ? "Tu: " : ""}{last.text}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Chat panel */}
        <section className="flex flex-col rounded-lg border border-neutral-200 bg-white">
          {!selected ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-neutral-400">
              <MessageCircle size={40} className="opacity-30" />
              <p className="text-sm">Selecteaza o conversatie</p>
            </div>
          ) : (
            <>
              <div className="border-b border-neutral-100 px-5 py-3">
                <p className="font-black">IP: {selected.ip}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3" style={{ minHeight: 300, maxHeight: 480 }}>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                      msg.sender === "admin"
                        ? "bg-brand text-white rounded-br-sm"
                        : "bg-neutral-100 text-neutral-800 rounded-bl-sm"
                    }`}>
                      <p>{msg.text}</p>
                      <p className={`mt-1 text-[10px] ${msg.sender === "admin" ? "text-white/60" : "text-neutral-400"}`}>
                        {fmt(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="border-t border-neutral-100 p-4 flex gap-3">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && void sendReply()}
                  placeholder="Scrie raspuns..."
                  className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand"
                />
                <button
                  onClick={() => void sendReply()}
                  disabled={sending || !reply.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-black text-white hover:bg-brand-dark disabled:opacity-40"
                >
                  <Send size={15} /> Trimite
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
