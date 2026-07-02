"use server";

import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export type PriceResult = {
  store: string;
  price: number;
  url: string;
  snippet: string;
};

function extractPrices(text: string): number[] {
  const prices: number[] = [];
  const regex = /(\d{1,4}(?:[.,]\d{1,2})?)\s*lei/gi;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const val = parseFloat(match[1].replace(",", "."));
    if (val >= 0.5 && val <= 9999) prices.push(val);
  }
  return prices;
}

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
}

export async function checkCompetitorPrices(productName: string): Promise<PriceResult[]> {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) throw new Error("BRAVE_SEARCH_API_KEY nu este configurat in Vercel.");

  const query = encodeURIComponent(`${productName} pret lei Romania cumparare`);
  const res = await fetch(
    `https://api.search.brave.com/res/v1/web/search?q=${query}&country=RO&search_lang=ro&count=10`,
    {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": apiKey,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error(`Eroare Brave API: ${res.status}`);

  const data = await res.json();
  const results: { title: string; url: string; description: string }[] = data?.web?.results ?? [];

  const found: PriceResult[] = [];
  for (const r of results) {
    const prices = extractPrices(`${r.title} ${r.description}`);
    if (prices.length > 0) {
      found.push({
        store: getDomain(r.url),
        price: Math.min(...prices),
        url: r.url,
        snippet: (r.description || r.title).slice(0, 120),
      });
    }
  }

  return found.sort((a, b) => a.price - b.price).slice(0, 6);
}
