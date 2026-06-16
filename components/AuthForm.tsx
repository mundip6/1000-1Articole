"use client";

import { FormEvent, useState } from "react";
import { Lock, Mail, User } from "lucide-react";

export default function AuthForm({ mode }: { mode: "login" | "register" | "forgot" | "reset" }) {
  const [done, setDone] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setDone(true);
  };

  if (done) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">
        Demo local: formularul este valid vizual. Conectarea reala se adauga cand legam baza de date si autentificarea.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === "register" && (
        <label className="block text-sm font-semibold">
          Nume
          <span className="relative mt-2 block">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input required className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-3 outline-none focus:border-brand" />
          </span>
        </label>
      )}
      {mode !== "reset" && (
        <label className="block text-sm font-semibold">
          Email
          <span className="relative mt-2 block">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input required type="email" className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-3 outline-none focus:border-brand" />
          </span>
        </label>
      )}
      {mode !== "forgot" && (
        <label className="block text-sm font-semibold">
          Parola
          <span className="relative mt-2 block">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input required type="password" className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-3 outline-none focus:border-brand" />
          </span>
        </label>
      )}
      <button className="w-full rounded-lg bg-brand py-3 font-black text-white hover:bg-brand-dark">
        {mode === "login" && "Conectare"}
        {mode === "register" && "Creeaza cont"}
        {mode === "forgot" && "Trimite link"}
        {mode === "reset" && "Reseteaza parola"}
      </button>
    </form>
  );
}
