import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function buildHtml(subject: string, body: string, imageUrl: string | undefined, unsubscribeToken: string): string {
  const bodyHtml = body.replace(/\n/g, "<br/>");
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;">
      <div style="background:#c8102e;padding:28px 24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;font-weight:900;">1000&amp;1 Articole</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Distribuitor engros Baia Mare</p>
      </div>
      ${imageUrl ? `<img src="${imageUrl}" alt="${subject}" style="width:100%;display:block;max-height:500px;object-fit:cover;" />` : ""}
      <div style="padding:32px 24px;">
        <h2 style="color:#111;margin-top:0;">${subject}</h2>
        <div style="color:#444;line-height:1.7;font-size:15px;">${bodyHtml}</div>
        <div style="text-align:center;margin:32px 0;">
          <a href="${BASE_URL}/catalog"
             style="display:inline-block;padding:14px 32px;background:#c8102e;color:#fff;font-weight:700;text-decoration:none;border-radius:8px;font-size:15px;">
            Vezi catalogul
          </a>
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="color:#aaa;font-size:12px;text-align:center;">
          1000&amp;1 Articole SRL — B-dul Regele Mihai I nr. 49G, Baia Mare<br/>
          <a href="${BASE_URL}/api/newsletter/unsubscribe?token=${unsubscribeToken}" style="color:#aaa;">Dezaboneaza-te</a>
        </p>
      </div>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, message: "Neautorizat." }, { status: 401 });
  }

  const { subject, body, imageUrl } = (await req.json()) as {
    subject?: string;
    body?: string;
    imageUrl?: string;
  };

  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json({ ok: false, message: "Subiectul si mesajul sunt obligatorii." }, { status: 400 });
  }

  const subscribers = await prisma.newsletterSubscriber.findMany();
  if (subscribers.length === 0) {
    return NextResponse.json({ ok: false, message: "Nu exista abonati." }, { status: 400 });
  }

  const BATCH = 100;
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < subscribers.length; i += BATCH) {
    const chunk = subscribers.slice(i, i + BATCH);
    const emails = chunk.map((sub) => ({
      from: FROM,
      to: sub.email,
      subject: subject.trim(),
      html: buildHtml(subject.trim(), body.trim(), imageUrl || undefined, sub.unsubscribeToken),
    }));

    const results = await Promise.allSettled(emails.map((e) => resend.emails.send(e)));
    results.forEach((r) => (r.status === "fulfilled" ? sent++ : failed++));
  }

  return NextResponse.json({ ok: true, sent, failed });
}
