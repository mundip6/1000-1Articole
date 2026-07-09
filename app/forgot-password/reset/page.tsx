import Link from "next/link";
import { Lock } from "lucide-react";
import { redirect } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import { saveCustomerNewPassword } from "../actions";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  if (!token) redirect("/forgot-password");

  return (
    <AuthShell
      icon={Lock}
      title="Parola noua"
      subtitle="Alege o parola noua pentru contul tau"
      footer={<Link href="/cont" className="font-bold text-brand hover:underline">Inapoi la conectare</Link>}
    >
      {error === "mismatch" && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          Parolele nu coincid. Incearca din nou.
        </div>
      )}
      {error === "short" && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          Parola trebuie sa aiba cel putin 6 caractere.
        </div>
      )}

      <form action={saveCustomerNewPassword} className="space-y-4">
        <input type="hidden" name="tokenId" value={token} />
        <label className="block text-sm font-semibold">
          Parola noua
          <span className="relative mt-2 block">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoFocus
              placeholder="Minim 6 caractere"
              className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-3 outline-none focus:border-brand"
            />
          </span>
        </label>
        <label className="block text-sm font-semibold">
          Confirma parola
          <span className="relative mt-2 block">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              name="confirm"
              type="password"
              required
              minLength={6}
              placeholder="Repeta parola"
              className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-3 outline-none focus:border-brand"
            />
          </span>
        </label>
        <button className="w-full rounded-lg bg-brand py-3 font-black text-white hover:bg-brand-dark">
          Salveaza parola noua
        </button>
      </form>
    </AuthShell>
  );
}
