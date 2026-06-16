import Link from "next/link";
import { MailQuestion } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import AuthForm from "@/components/AuthForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell icon={MailQuestion} title="Ai uitat parola?" subtitle="Introdu emailul pentru instructiuni" footer={<Link href="/login" className="font-bold text-brand hover:underline">Inapoi la conectare</Link>}>
      <AuthForm mode="forgot" />
    </AuthShell>
  );
}
