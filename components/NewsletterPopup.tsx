"use client";

import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";

const STORAGE_KEY = "1001-newsletter-popup-v1";
const DELAY_MS = 8000;

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    timerRef.current = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
    }, DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function dismiss() {
    setAnimIn(false);
    setTimeout(() => setVisible(false), 300);
    localStorage.setItem(STORAGE_KEY, "1");
  }

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
        localStorage.setItem(STORAGE_KEY, "1");
        setTimeout(dismiss, 2200);
      } else {
        setError(data.message || "Eroare. Incearca din nou.");
        setState("error");
      }
    } catch {
      setError("Eroare de retea. Incearca din nou.");
      setState("error");
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(3px)",
        transition: "opacity 0.3s",
        opacity: animIn ? 1 : 0,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl shadow-2xl"
        style={{
          transform: animIn ? "scale(1) translateY(0)" : "scale(0.94) translateY(16px)",
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s",
          opacity: animIn ? 1 : 0,
        }}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Inchide"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col sm:flex-row">
          {/* Left — image (hidden on mobile) */}
          <div className="relative hidden sm:block sm:w-[60%] shrink-0 min-h-[420px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/facade.png"
              alt="1000&1 Articole"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
              }}
            />
          </div>

          {/* Mobile top image strip */}
          <div
            className="h-44 w-full sm:hidden"
            style={{
              backgroundImage: "url('/facade.png')",
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          />

          {/* Right — content */}
          <div className="flex flex-1 flex-col justify-center bg-brand px-7 py-8 sm:px-8 sm:py-10">
            <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-red-200">
              1000&amp;1 Articole
            </p>
            <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl">
              Aboneaza-te la<br />newsletter!
            </h2>

            <ul className="mt-5 space-y-2.5">
              {[
                "Oferte speciale si reduceri exclusive",
                "Produse noi in catalog",
                "Promotii sezoniere si noutati",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-white/90">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-black text-white">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            {state === "done" ? (
              <div className="mt-6 rounded-xl bg-white/15 px-5 py-4 text-center">
                <p className="text-base font-black text-white">✓ Te-ai abonat cu succes!</p>
                <p className="mt-1 text-sm text-white/80">Vei primi ofertele noastre direct pe email.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adresa@email.ro"
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:border-white/60 focus:bg-white/15"
                />
                {error && <p className="text-xs text-red-200">{error}</p>}
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-black text-brand transition hover:bg-red-50 disabled:opacity-60"
                >
                  <Send size={15} />
                  {state === "loading" ? "Se trimite..." : "Abonare"}
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  className="w-full text-center text-xs text-white/50 hover:text-white/80"
                >
                  Nu, multumesc
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
