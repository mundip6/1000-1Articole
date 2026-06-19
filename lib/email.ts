import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${BASE_URL}/api/customer/verify-email?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verifica adresa de email — 1000&1 Articole",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;">
        <h2 style="color:#c8102e;margin-bottom:8px;">1000&amp;1 Articole</h2>
        <h3 style="margin-bottom:16px;">Verifica adresa de email</h3>
        <p style="color:#444;line-height:1.6;">
          Buna ziua,<br/><br/>
          Ai creat un cont pe site-ul nostru. Apasa butonul de mai jos pentru a-ti verifica adresa de email.
        </p>
        <a href="${link}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#c8102e;color:#fff;font-weight:700;text-decoration:none;border-radius:8px;">
          Verifica email-ul
        </a>
        <p style="color:#888;font-size:13px;">
          Daca nu ai creat un cont, ignora acest mesaj.<br/>
          Link-ul expira in 24 de ore.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="color:#aaa;font-size:12px;">1000&amp;1 Articole SRL — B-dul Regele Mihai I nr. 49G</p>
      </div>
    `,
  });
}
