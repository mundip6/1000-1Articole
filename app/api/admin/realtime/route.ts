import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const since = new Date(Date.now() - 5 * 60 * 1000);
  const count = await prisma.pageView.count({ where: { createdAt: { gte: since } } });

  return NextResponse.json({ ok: true, count });
}
