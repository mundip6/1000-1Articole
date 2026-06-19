"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User } from "lucide-react";

export default function AuthForm({ mode }: { mode: "login" | "register" | "forgot" | "reset" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    isBusiness: false,
  });

  const set = (key: string, value: string | boolean) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const response = await fetch("/api/customer/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: fields.email, password: fields.password }),
        });
        const data = (await response.json()) as { ok: boolean; message?: string };
        if (!data.ok) throw new Error(data.message || "Autentificarea a esuat.");
        router.push("/cont");
      } else if (mode === "register") {
        const response = await fetch("/api/customer/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fields),
        });
        const data = (await response.json()) as { ok: boolean; message?: string };
        if (!data.ok) throw new Error(data.message || "Contul nu a putut fi creat.");
        router.push("/cont");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "A aparut o eroare.");
    } finally {
      setLoading(false);
    }
  };

  if (mode === "forgot" || mode === "reset") {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm font-semibold text-neutral-600">
        Aceasta functionalitate va fi disponibila curand. Contacteaza-ne la{" "}
        <a href="tel:+40723021114" className="text-brand hover:underline">0723 021 114</a> pentru resetarea parolei.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {mode === "register" && (
        <>
          <label className="block text-sm font-semibold">
            Prenume
            <span className="relative mt-2 block">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                required
                value={fields.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-3 outline-none focus:border-brand"
              />
            </span>
          </label>
          <label className="block text-sm font-semibold">
            Nume
            <span className="relative mt-2 block">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                required
                value={fields.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-3 outline-none focus:border-brand"
              />
            </span>
          </label>
        </>
      )}

      <label className="block text-sm font-semibold">
        Email
        <span className="relative mt-2 block">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            required
            type="email"
            value={fields.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-3 outline-none focus:border-brand"
          />
        </span>
      </label>

      <label className="block text-sm font-semibold">
        Parola
        <span className="relative mt-2 block">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            required
            type="password"
            minLength={6}
            value={fields.password}
            onChange={(e) => set("password", e.target.value)}
            className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-3 outline-none focus:border-brand"
          />
        </span>
      </label>

      {mode === "register" && (
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={fields.isBusiness}
            onChange={(e) => set("isBusiness", e.target.checked)}
            className="h-4 w-4 accent-brand"
          />
          Sunt firma
        </label>
      )}

      <button
        disabled={loading}
        className="w-full rounded-lg bg-brand py-3 font-black text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {loading ? "Se incarca..." : mode === "login" ? "Conectare" : "Creeaza cont"}
      </button>
    </form>
  );
}
