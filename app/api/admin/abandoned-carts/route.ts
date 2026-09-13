import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const days = Math.min(Number(searchParams.get("days") ?? 30), 90);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const carts = await prisma.abandonedCart.findMany({
    where: { converted: false, createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const totalRevenueLost = carts.reduce((s, c) => s + c.total, 0);

  return NextResponse.json({ ok: true, carts, totalRevenueLost });
}
