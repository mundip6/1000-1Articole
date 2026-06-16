import Link from "next/link";
import { LogIn } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <AuthShell icon={LogIn} title="Bine ai revenit" subtitle="Conecteaza-te la contul tau" footer={<>Nu ai cont? <Link href="/register" className="font-bold text-brand hover:underline">Creeaza unul</Link></>}>
      <AuthForm mode="login" />
      <Link href="/forgot-password" className="mt-4 block text-right text-xs font-bold text-brand hover:underline">Ai uitat parola?</Link>
    </AuthShell>
  );
}
