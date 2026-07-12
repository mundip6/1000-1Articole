import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function detectSource(utmSource: string, referrer: string): string {
  if (utmSource) {
    const u = utmSource.toLowerCase();
    if (u.includes("facebook") || u === "fb") return "Facebook";
    if (u.includes("tiktok")) return "TikTok";
    if (u.includes("instagram") || u === "ig") return "Instagram";
    if (u.includes("google")) return "Google";
    if (u.includes("youtube")) return "YouTube";
    return utmSource.charAt(0).toUpperCase() + utmSource.slice(1);
  }

  if (!referrer) return "Direct";

  try {
    const host = new URL(referrer).hostname.toLowerCase().replace("www.", "");
    if (host.includes("google")) return "Google";
    if (host.includes("facebook") || host === "l.facebook.com" || host === "fb.com") return "Facebook";
    if (host.includes("tiktok")) return "TikTok";
    if (host.includes("instagram")) return "Instagram";
    if (host.includes("youtube") || host === "youtu.be") return "YouTube";
    if (host.includes("bing")) return "Bing";
    if (host.includes("yahoo")) return "Yahoo";
    return "Altul";
  } catch {
    return "Direct";
  }
}

export async function POST(request: NextRequest) {
  try {
    const { utmSource, referrer, page } = (await request.json()) as {
      utmSource?: string;
      referrer?: string;
      page?: string;
    };

    const source = detectSource(String(utmSource ?? ""), String(referrer ?? ""));

    await prisma.pageView.create({
      data: { source, page: String(page ?? "/").slice(0, 200) },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
