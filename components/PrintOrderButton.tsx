"use client";

import { Printer } from "lucide-react";
import type { Order } from "@/lib/orders";

function formatPrice(n: number) {
  return new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export default function PrintOrderButton({ order }: { order: Order }) {
  const handlePrint = () => {
    const d = new Date(order.createdAt);
    const dateTime = d.toLocaleString("ro-RO", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

    const estimatedTotal = order.items.reduce((s, item) => s + item.price * item.qty, 0);
    const finalTotal = order.items.reduce((s, item) => {
      const qty = item.unit === "kg" && item.actualQty !== undefined ? item.actualQty : item.qty;
      return s + item.price * qty;
    }, 0);
    const hasActualQty = order.items.some((i) => i.unit === "kg" && i.actualQty !== undefined);

    const rows = order.items.map((item) => {
      const actualQtyCell = item.unit === "kg" && item.actualQty !== undefined
        ? `${item.qty} kg <span style="color:#16a34a;font-weight:900">→ ${item.actualQty.toFixed(3)} kg</span>`
        : `${item.qty} ${item.unit}`;

      const finalQty = item.unit === "kg" && item.actualQty !== undefined ? item.actualQty : item.qty;
      const subtotal = item.price * finalQty;

      return `
        <tr>
          <td style="padding:8px 12px 8px 0;border-bottom:1px solid #e5e7eb;font-weight:600">${item.name}</td>
          <td style="padding:8px 12px 8px 0;border-bottom:1px solid #e5e7eb">${actualQtyCell}</td>
          <td style="padding:8px 12px 8px 0;border-bottom:1px solid #e5e7eb;color:#6b7280">${formatPrice(item.price)} lei/${item.unit}</td>
          <td style="padding:8px 0 8px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:900">${formatPrice(subtotal)} lei</td>
        </tr>`;
    }).join("");

    const totalRow = hasActualQty
      ? `<tr>
          <td colspan="3" style="padding-top:12px;text-align:right;font-weight:600;color:#6b7280">Total estimat</td>
          <td style="padding-top:12px;text-align:right;font-weight:900;color:#6b7280;text-decoration:line-through">${formatPrice(estimatedTotal)} lei</td>
        </tr>
        <tr>
          <td colspan="3" style="padding-top:4px;text-align:right;font-weight:600;color:#6b7280">Total final</td>
          <td style="padding-top:4px;text-align:right;font-weight:900;color:#16a34a;font-size:18px">${formatPrice(finalTotal)} lei</td>
        </tr>`
      : `<tr>
          <td colspan="3" style="padding-top:12px;text-align:right;font-weight:600;color:#6b7280">Total comanda</td>
          <td style="padding-top:12px;text-align:right;font-weight:900;color:#c8102e;font-size:18px">${formatPrice(estimatedTotal)} lei</td>
        </tr>`;

    const html = `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8"/>
  <title>Comanda ${order.id} — 1000&amp;1 Articole</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 13px; color: #111; padding: 32px; }
    h1 { font-size: 22px; font-weight: 900; color: #c8102e; margin-bottom: 2px; }
    .subtitle { color: #6b7280; font-size: 12px; margin-bottom: 24px; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .info-row { display: flex; gap: 6px; margin-bottom: 4px; }
    .label { color: #6b7280; min-width: 70px; }
    table { width: 100%; border-collapse: collapse; }
    .status-badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 900; }
    .status-Noua { background:#fee2e2; color:#b91c1c; }
    .status-Confirmata { background:#fef3c7; color:#92400e; }
    .status-Livrata { background:#dcfce7; color:#15803d; }
    .status-Anulata { background:#f3f4f6; color:#6b7280; }
    .notes { background:#fffbeb; border:1px solid #fde68a; border-radius:6px; padding:8px 12px; font-size:12px; color:#92400e; margin-top:6px; }
    @media print {
      body { padding: 16px; }
      @page { margin: 1cm; }
    }
  </style>
</head>
<body>
  <h1>1000&amp;1 Articole</h1>
  <div class="subtitle">Comanda #${order.id} &nbsp;·&nbsp; ${dateTime} &nbsp;·&nbsp; <span class="status-badge status-${order.status}">${order.status}</span></div>

  <div class="grid">
    <div class="section">
      <div class="section-title">Date client</div>
      ${order.company ? `<div class="info-row"><span class="label">Firma:</span><strong>${order.company}</strong></div>` : ""}
      ${order.cui ? `<div class="info-row"><span class="label">CUI:</span>${order.cui}</div>` : ""}
      <div class="info-row"><span class="label">Contact:</span>${order.contact}</div>
      <div class="info-row"><span class="label">Telefon:</span>${order.phone}</div>
      <div class="info-row"><span class="label">Email:</span>${order.email}</div>
    </div>
    <div class="section">
      <div class="section-title">Livrare</div>
      <div class="info-row"><span class="label">Judet:</span>${order.county}</div>
      ${order.city ? `<div class="info-row"><span class="label">Localitate:</span>${order.city}</div>` : ""}
      ${order.address ? `<div class="info-row"><span class="label">Adresa:</span>${order.address}</div>` : ""}
      ${order.notes ? `<div class="notes"><strong>Observatii:</strong> ${order.notes}</div>` : ""}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Produse comandate</div>
    <table>
      <thead>
        <tr style="font-size:10px;text-transform:uppercase;color:#9ca3af;letter-spacing:0.05em">
          <th style="padding:6px 12px 6px 0;text-align:left;border-bottom:2px solid #e5e7eb">Produs</th>
          <th style="padding:6px 12px 6px 0;text-align:left;border-bottom:2px solid #e5e7eb">Cantitate</th>
          <th style="padding:6px 12px 6px 0;text-align:left;border-bottom:2px solid #e5e7eb">Pret unitar</th>
          <th style="padding:6px 0 6px 0;text-align:right;border-bottom:2px solid #e5e7eb">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>${totalRow}</tfoot>
    </table>
  </div>

  ${order.weight > 0 ? `<div style="text-align:right;color:#6b7280;font-size:12px;margin-top:4px">Greutate estimata: <strong>${formatPrice(order.weight)} kg</strong></div>` : ""}

  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;text-align:center">
    1000&amp;1 Articole SRL &nbsp;·&nbsp; B-dul Regele Mihai I nr. 49G, Baia Mare &nbsp;·&nbsp; Tel: +40 750 266 304
  </div>
</body>
</html>`;

    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 250);
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-black text-neutral-700 hover:border-brand hover:text-brand"
    >
      <Printer size={16} /> Printeaza
    </button>
  );
}
