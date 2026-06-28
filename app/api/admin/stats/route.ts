import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

const MONTHS_RO = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function buildMonthSlots(n = 12) {
  const slots: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    slots.push({ key: monthKey(d), label: `${MONTHS_RO[d.getMonth()]} ${d.getFullYear()}` });
  }
  return slots;
}

type RawMonthRow = { month: Date; count: bigint };
type RawOrderRow = { month: Date; count: bigint; revenue: number };

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 11);
  cutoff.setDate(1);
  cutoff.setHours(0, 0, 0, 0);

  const [customerRows, orderRows, totals] = await Promise.all([
    prisma.$queryRaw<RawMonthRow[]>`
      SELECT DATE_TRUNC('month', "createdAt") AS month, COUNT(*)::bigint AS count
      FROM "Customer"
      WHERE "createdAt" >= ${cutoff}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `,
    prisma.$queryRaw<RawOrderRow[]>`
      SELECT DATE_TRUNC('month', "createdAt") AS month, COUNT(*)::bigint AS count, COALESCE(SUM(total), 0)::float AS revenue
      FROM "Order"
      WHERE "createdAt" >= ${cutoff}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `,
    prisma.$transaction([
      prisma.customer.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
    ]),
  ]);

  const slots = buildMonthSlots(12);

  const customerMap = new Map(customerRows.map((r) => [monthKey(new Date(r.month)), Number(r.count)]));
  const orderMap = new Map(orderRows.map((r) => [monthKey(new Date(r.month)), Number(r.count)]));
  const revenueMap = new Map(orderRows.map((r) => [monthKey(new Date(r.month)), Number(r.revenue)]));

  const monthly = slots.map(({ key, label }) => ({
    label,
    users: customerMap.get(key) ?? 0,
    orders: orderMap.get(key) ?? 0,
    revenue: revenueMap.get(key) ?? 0,
  }));

  const now = new Date();
  const thisMonthKey = monthKey(now);
  const thisMonth = monthly.find((m) => {
    const slot = slots.find((s) => s.label === m.label);
    return slot?.key === thisMonthKey;
  });

  return NextResponse.json({
    ok: true,
    monthly,
    totals: {
      users: totals[0],
      orders: totals[1],
      revenue: Number((totals[2]._sum.total ?? 0).toFixed(2)),
      ordersThisMonth: thisMonth?.orders ?? 0,
      revenueThisMonth: thisMonth ? Number(thisMonth.revenue.toFixed(2)) : 0,
    },
  });
}
