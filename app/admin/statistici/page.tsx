import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import AdminShell from "@/components/AdminShell";
import StatsCharts from "./StatsCharts";

export const dynamic = "force-dynamic";

type StatsResponse = {
  ok: boolean;
  monthly: { label: string; users: number; orders: number; revenue: number }[];
  totals: {
    users: number;
    orders: number;
    revenue: number;
    ordersThisMonth: number;
    revenueThisMonth: number;
  };
};

async function fetchStats(): Promise<StatsResponse> {
  const { prisma } = await import("@/lib/prisma");
  const { isAdminAuthenticated: auth } = await import("@/lib/adminAuth");

  const MONTHS_RO = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function monthKey(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 11);
  cutoff.setDate(1);
  cutoff.setHours(0, 0, 0, 0);

  const slots = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    d.setDate(1);
    return { key: monthKey(d), label: `${MONTHS_RO[d.getMonth()]} ${d.getFullYear()}` };
  });

  type RawRow = { month: Date; count: bigint };
  type RawOrderRow = { month: Date; count: bigint; revenue: number };

  const [customerRows, orderRows, totalUsers, totalOrders, totalRevenue] = await Promise.all([
    prisma.$queryRaw<RawRow[]>`
      SELECT DATE_TRUNC('month', "createdAt") AS month, COUNT(*)::bigint AS count
      FROM "Customer" WHERE "createdAt" >= ${cutoff}
      GROUP BY DATE_TRUNC('month', "createdAt") ORDER BY month ASC
    `,
    prisma.$queryRaw<RawOrderRow[]>`
      SELECT DATE_TRUNC('month', "createdAt") AS month, COUNT(*)::bigint AS count,
             COALESCE(SUM(total), 0)::float AS revenue
      FROM "Order" WHERE "createdAt" >= ${cutoff} AND status = 'Livrata'
      GROUP BY DATE_TRUNC('month', "createdAt") ORDER BY month ASC
    `,
    prisma.customer.count(),
    prisma.order.count({ where: { status: "Livrata" } }),
    prisma.order.aggregate({ where: { status: "Livrata" }, _sum: { total: true } }),
  ]);

  const cMap = new Map(customerRows.map((r) => [monthKey(new Date(r.month)), Number(r.count)]));
  const oMap = new Map(orderRows.map((r) => [monthKey(new Date(r.month)), Number(r.count)]));
  const rMap = new Map(orderRows.map((r) => [monthKey(new Date(r.month)), Number(r.revenue)]));

  const monthly = slots.map(({ key, label }) => ({
    label,
    users: cMap.get(key) ?? 0,
    orders: oMap.get(key) ?? 0,
    revenue: Number((rMap.get(key) ?? 0).toFixed(2)),
  }));

  const thisKey = monthKey(new Date());
  const thisMonth = monthly.find((_, i) => slots[i].key === thisKey);

  return {
    ok: true,
    monthly,
    totals: {
      users: totalUsers,
      orders: totalOrders,
      revenue: Number((totalRevenue._sum.total ?? 0).toFixed(2)),
      ordersThisMonth: thisMonth?.orders ?? 0,
      revenueThisMonth: thisMonth ? Number(thisMonth.revenue.toFixed(2)) : 0,
    },
  };
}

export default async function StatisticiPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  const stats = await fetchStats();

  return (
    <AdminShell
      title="Statistici"
      description="Evolutia utilizatorilor, comenzilor si veniturilor pe ultimele 12 luni."
      active="statistici"
    >
      <StatsCharts monthly={stats.monthly} totals={stats.totals} />
    </AdminShell>
  );
}
