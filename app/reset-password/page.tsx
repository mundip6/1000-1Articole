import Link from "next/link";
import { KeyRound } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import AuthForm from "@/components/AuthForm";

export default function ResetPasswordPage() {
  return (
    <AuthShell icon={KeyRound} title="Reseteaza parola" subtitle="Alege o parola noua pentru cont" footer={<Link href="/login" className="font-bold text-brand hover:underline">Inapoi la conectare</Link>}>
      <AuthForm mode="reset" />
    </AuthShell>
  );
}
