import Link from "next/link";
import { UserPlus } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <AuthShell icon={UserPlus} title="Creeaza cont" subtitle="Datele contului pentru comenzi rapide" footer={<>Ai deja cont? <Link href="/login" className="font-bold text-brand hover:underline">Conectare</Link></>}>
      <AuthForm mode="register" />
    </AuthShell>
  );
}
