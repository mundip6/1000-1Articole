import Link from "next/link";
import { LogIn } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import AuthForm from "@/components/AuthForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;

  return (
    <AuthShell
      icon={LogIn}
      title="Bine ai revenit"
      subtitle="Conecteaza-te la contul tau"
      footer={<>Nu ai cont? <Link href="/register" className="font-bold text-brand hover:underline">Creeaza unul</Link></>}
    >
      {success === "password-reset" && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-700">
          Parola a fost schimbata cu succes. Poti acum sa te conectezi.
        </div>
      )}
      <AuthForm mode="login" />
      <Link href="/forgot-password" className="mt-4 block text-right text-xs font-bold text-brand hover:underline">Ai uitat parola?</Link>
    </AuthShell>
  );
}
