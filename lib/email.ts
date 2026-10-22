import { Resend } from "resend";
import { formatCompact, formatDateTime } from "@/lib/datetime";
import { formatPrice } from "@/lib/data";
import { resolveDelivery } from "@/lib/deliverySchedule";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function sendAbandonedCartReminderEmail(
  toEmail: string,
  items: { name: string; price: number; salePrice?: number; unit: string; qty: number }[],
  total: number,
  contact?: string | null,
) {
  const cartUrl = `${BASE_URL}/cos`;

  const rows = items.map((item) => {
    const price = item.salePrice ?? item.price;
    return `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#222;font-weight:600;">${item.name}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#666;text-align:center;">${item.qty} ${item.unit}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#222;font-weight:700;text-align:right;">${(price * item.qty).toFixed(2)} lei</td>
      </tr>`;
  }).join("");

  const greeting = contact ? `Buna ziua, ${contact}!` : "Buna ziua!";

  await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: "Ai uitat ceva in cos 🛒 — 1000&1 Articole",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:0;background:#fff;">
        <!-- Header -->
        <div style="background:#c8102e;padding:28px 32px;">
          <h1 style="margin:0;color:#fff;font-size:20px;font-weight:900;letter-spacing:-0.5px;">1000&amp;1 Articole</h1>
        </div>

        <!-- Body -->
        <div style="padding:32px;">
          <h2 style="margin:0 0 8px;font-size:22px;color:#111;">${greeting}</h2>
          <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">
            Ai lasat cateva produse in cosul tau. Le-am pastrat pentru tine — finalizeaza comanda acum cat sunt inca disponibile!
          </p>

          <!-- Items table -->
          <div style="background:#f9f9f9;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
            <p style="margin:0 0 14px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#999;">Cosul tau</p>
            <table style="width:100%;border-collapse:collapse;">
              <tbody>${rows}</tbody>
            </table>
            <div style="margin-top:14px;padding-top:14px;border-top:2px solid #e0e0e0;display:flex;justify-content:space-between;">
              <span style="font-size:14px;font-weight:700;color:#111;">Total</span>
              <span style="font-size:18px;font-weight:900;color:#c8102e;">${total.toFixed(2)} lei</span>
            </div>
          </div>

          <!-- CTA Button -->
          <div style="text-align:center;margin-bottom:28px;">
            <a href="${cartUrl}" style="display:inline-block;background:#c8102e;color:#fff;font-weight:900;font-size:16px;text-decoration:none;padding:16px 40px;border-radius:10px;letter-spacing:-0.3px;">
              Finalizează comanda →
            </a>
          </div>

          <p style="color:#aaa;font-size:13px;line-height:1.6;text-align:center;margin:0;">
            Daca ai intrebari ne poti scrie oricand pe site sau la telefon.<br/>
            Livram rapid si cu drag! 🚚
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#f5f5f5;padding:20px 32px;border-top:1px solid #eee;">
          <p style="margin:0;color:#bbb;font-size:12px;text-align:center;">
            1000&amp;1 Articole SRL — B-dul Regele Mihai I nr. 49G, Baia Mare<br/>
            Ai primit acest email deoarece ai lasat produse in cosul de cumparaturi.
          </p>
        </div>
      </div>
    `,
  });
}

/**
 * Alerts the shop that an order came in. Takes a structural shape rather than
 * the Order type so lib/orders can import this without an import cycle.
 */
export async function sendNewOrderEmail(order: {
  id: string;
  createdAt: string;
  contact: string;
  phone: string;
  email: string;
  company: string;
  cui: string;
  county: string;
  city: string;
  address: string;
  notes: string;
  total: number;
  weight: number;
  items: { name: string; qty: number; unit: string; price: number }[];
}) {
  const recipients = (process.env.ADMIN_EMAIL || "").split(",").map((e) => e.trim()).filter(Boolean);
  if (!recipients.length) return;

  const itemsTotal = order.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingFee = Math.max(0, Number((order.total - itemsTotal).toFixed(2)));

  const match = resolveDelivery(order.city, order.county);
  const deliveryDay = match.kind === "route" ? match.day : null;

  const rows = order.items.map((i) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#222;">${i.name}</td>
      <td style="padding:8px 8px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#666;text-align:center;white-space:nowrap;">${i.qty} ${i.unit}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#222;font-weight:700;text-align:right;white-space:nowrap;">${formatPrice(i.price * i.qty)} lei</td>
    </tr>`).join("");

  const line = (label: string, value: string) => `
    <tr><td style="padding:3px 0;font-size:14px;color:#888;width:120px;">${label}</td>
        <td style="padding:3px 0;font-size:14px;color:#222;font-weight:600;">${value}</td></tr>`;

  await resend.emails.send({
    from: FROM,
    to: recipients,
    replyTo: order.email,
    subject: `Comanda noua ${order.id} — ${formatPrice(order.total)} lei · ${order.city || order.county}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;">
        <div style="background:#c8102e;padding:20px 28px;">
          <p style="margin:0;color:rgba(255,255,255,0.8);font-size:13px;">Comanda noua</p>
          <h1 style="margin:2px 0 0;color:#fff;font-size:22px;font-weight:900;">${order.id} — ${formatPrice(order.total)} lei</h1>
        </div>

        <div style="padding:24px 28px;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            ${line("Primita", formatDateTime(order.createdAt))}
            ${line("Client", order.contact)}
            ${order.company ? line("Firma", `${order.company}${order.cui ? ` (CUI ${order.cui})` : ""}`) : ""}
            ${line("Telefon", `<a href="tel:${order.phone}" style="color:#c8102e;">${order.phone}</a>`)}
            ${line("Email", `<a href="mailto:${order.email}" style="color:#c8102e;">${order.email}</a>`)}
            ${line("Livrare", `${order.city ? `${order.city}, ` : ""}${order.county}${deliveryDay ? ` — ${deliveryDay}` : ""}`)}
            ${order.address ? line("Adresa", order.address) : ""}
            ${order.weight > 0 ? line("Greutate", `${formatPrice(order.weight)} kg`) : ""}
          </table>

          ${order.notes ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 14px;margin-bottom:20px;font-size:14px;color:#92400e;"><strong>Observatii:</strong> ${order.notes}</div>` : ""}

          <table style="width:100%;border-collapse:collapse;">
            <tbody>${rows}</tbody>
          </table>

          <table style="width:100%;border-collapse:collapse;margin-top:12px;">
            <tr><td style="font-size:14px;color:#666;">Subtotal produse</td>
                <td style="font-size:14px;color:#222;text-align:right;font-weight:600;">${formatPrice(itemsTotal)} lei</td></tr>
            ${shippingFee > 0 ? `<tr><td style="font-size:14px;color:#666;">Taxa livrare</td>
                <td style="font-size:14px;color:#b45309;text-align:right;font-weight:600;">${formatPrice(shippingFee)} lei</td></tr>` : ""}
            <tr><td style="padding-top:8px;font-size:15px;font-weight:900;color:#111;border-top:2px solid #e5e5e5;">Total</td>
                <td style="padding-top:8px;font-size:18px;font-weight:900;color:#c8102e;text-align:right;border-top:2px solid #e5e5e5;">${formatPrice(order.total)} lei</td></tr>
          </table>

          <div style="text-align:center;margin-top:26px;">
            <a href="${BASE_URL}/admin/orders/${order.id}" style="display:inline-block;background:#111;color:#fff;font-weight:700;font-size:15px;text-decoration:none;padding:13px 32px;border-radius:8px;">
              Deschide comanda in admin →
            </a>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendAdminOtpEmail(code: string) {
  const raw = process.env.ADMIN_EMAIL;
  if (!raw) throw new Error("ADMIN_EMAIL nu este configurat in variabilele de mediu.");

  const adminEmails = raw.split(",").map((e) => e.trim()).filter(Boolean);

  await resend.emails.send({
    from: FROM,
    to: adminEmails,
    subject: `${code} — Cod verificare admin 1000&1 Articole`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
        <h2 style="color:#c8102e;margin-bottom:8px;">1000&amp;1 Articole</h2>
        <h3 style="margin-bottom:16px;">Cod de verificare admin</h3>
        <p style="color:#444;line-height:1.6;">Codul tau de verificare este:</p>
        <div style="font-size:36px;font-weight:900;letter-spacing:10px;color:#111;margin:24px 0;padding:20px;background:#f5f5f5;border-radius:8px;text-align:center;">
          ${code}
        </div>
        <p style="color:#888;font-size:13px;">Codul este valabil <strong>10 minute</strong>.<br/>Daca nu ai incercat sa te autentifici, ignora acest mesaj.</p>
      </div>
    `,
  });
}

export async function sendPackerOtpEmail(code: string) {
  const raw = process.env.PACKER_EMAIL;
  if (!raw) throw new Error("PACKER_EMAIL nu este configurat in variabilele de mediu.");

  const packerEmails = raw.split(",").map((e) => e.trim()).filter(Boolean);

  await resend.emails.send({
    from: FROM,
    to: packerEmails,
    subject: `${code} — Cod verificare impachetare 1000&1 Articole`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
        <h2 style="color:#c8102e;margin-bottom:8px;">1000&amp;1 Articole</h2>
        <h3 style="margin-bottom:16px;">Cod de verificare zona impachetare</h3>
        <p style="color:#444;line-height:1.6;">Codul tau de verificare este:</p>
        <div style="font-size:36px;font-weight:900;letter-spacing:10px;color:#111;margin:24px 0;padding:20px;background:#f5f5f5;border-radius:8px;text-align:center;">
          ${code}
        </div>
        <p style="color:#888;font-size:13px;">Codul este valabil <strong>10 minute</strong>.<br/>Daca nu ai incercat sa te autentifici, ignora acest mesaj.</p>
      </div>
    `,
  });
}

export async function sendCustomerPasswordResetEmail(code: string, toEmail: string) {
  await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: `${code} — Resetare parola cont 1000&1 Articole`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
        <h2 style="color:#c8102e;margin-bottom:8px;">1000&amp;1 Articole</h2>
        <h3 style="margin-bottom:16px;">Resetare parola cont</h3>
        <p style="color:#444;line-height:1.6;">Ai solicitat resetarea parolei contului tau. Codul tau este:</p>
        <div style="font-size:36px;font-weight:900;letter-spacing:10px;color:#111;margin:24px 0;padding:20px;background:#f5f5f5;border-radius:8px;text-align:center;">
          ${code}
        </div>
        <p style="color:#888;font-size:13px;">Codul este valabil <strong>15 minute</strong>.<br/>Daca nu ai solicitat resetarea parolei, ignora acest mesaj — contul tau este in siguranta.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="color:#aaa;font-size:12px;">1000&amp;1 Articole SRL — B-dul Regele Mihai I nr. 49G, Baia Mare</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(code: string, toEmail: string) {
  await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: `${code} — Resetare parola 1000&1 Articole`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
        <h2 style="color:#c8102e;margin-bottom:8px;">1000&amp;1 Articole</h2>
        <h3 style="margin-bottom:16px;">Resetare parola</h3>
        <p style="color:#444;line-height:1.6;">Ai solicitat resetarea parolei. Codul tau este:</p>
        <div style="font-size:36px;font-weight:900;letter-spacing:10px;color:#111;margin:24px 0;padding:20px;background:#f5f5f5;border-radius:8px;text-align:center;">
          ${code}
        </div>
        <p style="color:#888;font-size:13px;">Codul este valabil <strong>15 minute</strong>.<br/>Daca nu ai solicitat resetarea parolei, ignora acest mesaj.</p>
      </div>
    `,
  });
}

export async function sendChatTranscriptEmail(
  toEmail: string,
  messages: { text: string; sender: string; createdAt: Date }[],
) {
  const rows = messages
    .map((m) => {
      const who = m.sender === "admin" ? "1000&amp;1 Articole" : "Tu";
      const time = formatCompact(m.createdAt);
      return `
        <tr>
          <td style="padding:10px 14px;vertical-align:top;white-space:nowrap;font-size:12px;color:#888;">${who}<br/><span style="color:#bbb;">${time}</span></td>
          <td style="padding:10px 14px;font-size:14px;color:#222;line-height:1.6;">${m.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
        </tr>`;
    })
    .join("");

  await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: "Conversatia ta cu 1000&1 Articole",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
        <h2 style="color:#c8102e;margin-bottom:4px;">1000&amp;1 Articole</h2>
        <p style="color:#666;margin-bottom:24px;font-size:14px;">Transcriptul conversatiei tale cu echipa noastra:</p>
        <table style="width:100%;border-collapse:collapse;background:#f9f9f9;border-radius:8px;overflow:hidden;">
          ${rows}
        </table>
        <p style="margin-top:24px;font-size:13px;color:#888;">Daca ai alte intrebari ne poti contacta oricand pe site.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="color:#aaa;font-size:12px;">1000&amp;1 Articole SRL — B-dul Regele Mihai I nr. 49G, Baia Mare</p>
      </div>
    `,
  });
}

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
