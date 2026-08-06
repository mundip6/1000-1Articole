import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token) {
    await prisma.newsletterSubscriber.deleteMany({ where: { unsubscribeToken: token } }).catch(() => {});
  }
  return NextResponse.redirect(`${BASE_URL}/newsletter/dezabonat`);
}
