"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function NewsletterSend({ count }: { count: number }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);
  const [error, setError] = useState("");

  async function handleSend() {
    if (!subject.trim() || !body.trim()) return;
    if (!window.confirm(`Trimiti emailul la toti cei ${count} abonati?`)) return;

    setState("loading");
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body, imageUrl: imageUrl.trim() || undefined }),
      });
      const data = (await res.json()) as { ok: boolean; sent?: number; failed?: number; message?: string };
      if (data.ok) {
        setResult({ sent: data.sent ?? 0, failed: data.failed ?? 0 });
        setState("done");
        setSubject("");
        setBody("");
        setImageUrl("");
      } else {
        setError(data.message || "Eroare la trimitere.");
        setState("error");
      }
    } catch {
      setError("Eroare de retea.");
      setState("error");
    }
  }

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-5">
      <h2 className="mb-1 text-lg font-black">Trimite newsletter</h2>
      <p className="mb-5 text-sm text-neutral-500">Se va trimite la toti cei <strong>{count}</strong> abonati.</p>

      <div className="space-y-4">
        <label className="block text-xs font-semibold uppercase text-neutral-500">
          Subiect email *
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ex: Oferta saptamanii — reduceri la carne de pui"
            className="mt-1 w-full rounded border border-neutral-200 px-3 py-2 text-sm normal-case text-neutral-900 outline-none focus:border-brand"
          />
        </label>

        <label className="block text-xs font-semibold uppercase text-neutral-500">
          Mesaj *
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder={"Buna ziua,\n\nAvem oferte speciale aceasta saptamana:\n- Produs 1 — pret special\n- Produs 2 — pret special\n\nComandati acum!"}
            className="mt-1 w-full resize-y rounded border border-neutral-200 px-3 py-2 text-sm normal-case text-neutral-900 outline-none focus:border-brand"
          />
        </label>

        <label className="block text-xs font-semibold uppercase text-neutral-500">
          URL imagine / flyer <span className="font-normal normal-case text-neutral-400">(optional — apare deasupra mesajului)</span>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1 w-full rounded border border-neutral-200 px-3 py-2 text-sm normal-case text-neutral-900 outline-none focus:border-brand"
          />
        </label>

        {imageUrl && (
          <div className="rounded border border-neutral-100 p-2">
            <p className="mb-2 text-xs font-semibold text-neutral-400">Previzualizare imagine:</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Previzualizare" className="max-h-48 rounded object-cover" />
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={state === "loading" || !subject.trim() || !body.trim() || count === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 font-black text-white hover:bg-red-700 disabled:opacity-50"
        >
          <Send size={16} />
          {state === "loading" ? "Se trimite..." : `Trimite la ${count} abonati`}
        </button>

        {state === "done" && result && (
          <p className="text-sm font-semibold text-green-700">
            ✓ Trimis: {result.sent} emailuri. {result.failed > 0 && `Esuate: ${result.failed}.`}
          </p>
        )}
        {(state === "error") && error && (
          <p className="text-sm font-semibold text-red-600">{error}</p>
        )}
      </div>
    </section>
  );
}
