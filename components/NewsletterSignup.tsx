"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (data.ok) {
        setState("done");
      } else {
        setError(data.message || "Eroare. Incearca din nou.");
        setState("error");
      }
    } catch {
      setError("Eroare de retea. Incearca din nou.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="text-sm font-semibold text-green-400">
        ✓ Te-ai abonat cu succes! Vei primi ofertele noastre pe email.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="adresa@email.ro"
        className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-brand"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-black text-white hover:bg-red-700 disabled:opacity-60"
      >
        <Send size={14} />
        {state === "loading" ? "Se trimite..." : "Abonare"}
      </button>
      {error && <p className="w-full text-xs text-red-400">{error}</p>}
    </form>
  );
}
