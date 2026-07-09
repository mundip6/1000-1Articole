import Link from "next/link";
import { Mail, MailQuestion } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import { requestCustomerPasswordReset } from "./actions";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell
      icon={MailQuestion}
      title="Ai uitat parola?"
      subtitle="Introdu emailul contului tau si iti trimitem un cod de verificare"
      footer={<Link href="/cont" className="font-bold text-brand hover:underline">Inapoi la conectare</Link>}
    >
      {error === "not-found" && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          Nu exista niciun cont cu aceasta adresa de email.
        </div>
      )}
      {error === "expired" && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          Sesiunea a expirat. Te rugam sa incepi din nou.
        </div>
      )}

      <form action={requestCustomerPasswordReset} className="space-y-4">
        <label className="block text-sm font-semibold">
          Adresa de email
          <span className="relative mt-2 block">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              name="email"
              type="email"
              required
              autoFocus
              placeholder="email@exemplu.com"
              className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-3 outline-none focus:border-brand"
            />
          </span>
        </label>
        <button className="w-full rounded-lg bg-brand py-3 font-black text-white hover:bg-brand-dark">
          Trimite codul
        </button>
      </form>
    </AuthShell>
  );
}
