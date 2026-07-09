import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import { verifyCustomerResetCode } from "../actions";

export default async function VerifyResetCodePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  if (!token) redirect("/forgot-password");

  return (
    <AuthShell
      icon={ShieldCheck}
      title="Introdu codul"
      subtitle="Am trimis un cod de 6 cifre pe adresa ta de email"
      footer={<Link href="/forgot-password" className="font-bold text-brand hover:underline">Trimite un cod nou</Link>}
    >
      {error === "invalid" && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          Codul este gresit. Verifica emailul si incearca din nou.
        </div>
      )}

      <form action={verifyCustomerResetCode} className="space-y-4">
        <input type="hidden" name="tokenId" value={token} />
        <label className="block text-sm font-semibold">
          Codul de verificare
          <input
            name="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            autoFocus
            placeholder="123456"
            className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-3 text-center text-2xl font-black tracking-[0.35em] outline-none focus:border-brand"
          />
        </label>
        <p className="text-center text-xs text-neutral-400">Codul este valabil 15 minute</p>
        <button className="w-full rounded-lg bg-brand py-3 font-black text-white hover:bg-brand-dark">
          Verifica codul
        </button>
      </form>
    </AuthShell>
  );
}
