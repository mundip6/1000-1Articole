import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  if (!fromParam || !toParam) {
    return NextResponse.json({ ok: false, message: "Missing from/to" }, { status: 400 });
  }

  const from = new Date(fromParam);
  const to = new Date(toParam);
  to.setHours(23, 59, 59, 999);

  const [sourceGroups, total] = await Promise.all([
    prisma.pageView.groupBy({
      by: ["source"],
      where: { createdAt: { gte: from, lte: to } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
    prisma.pageView.count({ where: { createdAt: { gte: from, lte: to } } }),
  ]);

  return NextResponse.json({
    ok: true,
    sources: sourceGroups.map((r) => ({ source: r.source, count: r._count.id })),
    total,
  });
}
