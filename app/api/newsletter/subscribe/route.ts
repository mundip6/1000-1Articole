import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as { email?: string };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, message: "Adresa de email invalida." }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email: normalized } });
  if (existing) {
    return NextResponse.json({ ok: true });
  }

  const subscriber = await prisma.newsletterSubscriber.create({ data: { email: normalized } });

  await resend.emails.send({
    from: FROM,
    to: normalized,
    subject: "Bun venit la newsletter-ul 1000&1 Articole!",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;">
        <div style="background:#c8102e;padding:28px 24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:900;">1000&amp;1 Articole</h1>
          <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Distribuitor engros Baia Mare</p>
        </div>
        <div style="padding:32px 24px;">
          <h2 style="color:#111;margin-top:0;">Te-ai abonat cu succes!</h2>
          <p style="color:#444;line-height:1.7;">
            Buna ziua,<br/><br/>
            Iti multumim ca te-ai abonat la newsletter-ul nostru.<br/>
            Vei fi primul care afla despre <strong>ofertele speciale</strong>, <strong>produse noi</strong> si <strong>promotii</strong>.
          </p>
          <div style="text-align:center;margin:28px 0;">
            <a href="${BASE_URL}/catalog"
               style="display:inline-block;padding:14px 32px;background:#c8102e;color:#fff;font-weight:700;text-decoration:none;border-radius:8px;font-size:15px;">
              Vezi catalogul
            </a>
          </div>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="color:#aaa;font-size:12px;text-align:center;">
            1000&amp;1 Articole SRL — B-dul Regele Mihai I nr. 49G, Baia Mare<br/>
            <a href="${BASE_URL}/api/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}"
               style="color:#aaa;">Dezaboneaza-te</a>
          </p>
        </div>
      </div>
    `,
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
