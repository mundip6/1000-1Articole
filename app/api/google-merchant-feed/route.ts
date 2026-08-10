import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.1000-1-articole.com";
const BRAND = "1000&1 Articole";
const CURRENCY = "RON";

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildDescription(name: string, category: string, price: number, unit: string): string {
  return `${name} — produs en-gros disponibil la ${price.toFixed(2)} RON/${unit}. Categorie: ${category}. Distribuitor angro Baia Mare, livrare in Maramures, Satu Mare si Salaj.`;
}

export async function GET() {
  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      category: true,
      price: true,
      salePrice: true,
      unit: true,
      imageUrl: true,
      stock: true,
      metaDescription: true,
      updatedAt: true,
    },
  });

  const items = products.map((p) => {
    const effectivePrice = p.salePrice ?? p.price;
    const description = esc(p.metaDescription ?? buildDescription(p.name, p.category, effectivePrice, p.unit));
    const title = esc(p.name);
    const link = `${BASE}/catalog/${p.id}`;
    const availability = p.stock > 0 ? "in_stock" : "out_of_stock";

    return `
    <item>
      <g:id>${esc(p.id)}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${link}</g:link>
      ${p.imageUrl ? `<g:image_link>${esc(p.imageUrl)}</g:image_link>` : ""}
      <g:price>${effectivePrice.toFixed(2)} ${CURRENCY}</g:price>
      ${p.salePrice ? `<g:sale_price>${p.salePrice.toFixed(2)} ${CURRENCY}</g:sale_price>` : ""}
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>${esc(BRAND)}</g:brand>
      <g:google_product_category>Food, Beverages &amp; Tobacco &gt; Food Items</g:google_product_category>
      <g:product_type>${esc(p.category)}</g:product_type>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`.trim();
  }).join("\n    ");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${esc(BRAND)} — Catalog en-gros</title>
    <link>${BASE}/catalog</link>
    <description>Catalog de produse alimentare en-gros: carne, peste, legume congelate, semipreparate.</description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
