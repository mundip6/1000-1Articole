import { redirect } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import AdminShell from "@/components/AdminShell";
import { formatPrice } from "@/lib/data";
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

async function fetchCustomerStats() {
  const { prisma } = await import("@/lib/prisma");

  const [customers, orderGroups] = await Promise.all([
    prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, firstName: true, lastName: true, email: true, emailVerified: true, createdAt: true },
    }),
    prisma.order.groupBy({
      by: ["email", "status"],
      _count: { id: true },
      _sum: { total: true },
    }),
  ]);

  return customers.map((c) => {
    const rows = orderGroups.filter((r) => r.email === c.email);
    const delivered = rows.find((r) => r.status === "Livrata");
    const cancelled = rows.find((r) => r.status === "Anulata");
    return {
      ...c,
      deliveredOrders: delivered?._count.id ?? 0,
      cancelledOrders: cancelled?._count.id ?? 0,
      totalSpent: Number((delivered?._sum.total ?? 0).toFixed(2)),
    };
  });
}

export default async function StatisticiPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  const [stats, customers] = await Promise.all([fetchStats(), fetchCustomerStats()]);

  return (
    <AdminShell
      title="Statistici"
      description="Evolutia utilizatorilor, comenzilor si veniturilor pe ultimele 12 luni."
      active="statistici"
    >
      <StatsCharts monthly={stats.monthly} totals={stats.totals} />

      <div className="mt-8 rounded-lg border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="text-sm font-black uppercase tracking-wide text-neutral-500">Clienti inregistrati</h2>
          <p className="mt-0.5 text-xs text-neutral-400">{customers.length} conturi</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs font-black uppercase tracking-wide text-neutral-400">
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3 text-center">Verificat</th>
                <th className="px-5 py-3 text-center">Livrate</th>
                <th className="px-5 py-3 text-center">Anulate</th>
                <th className="px-5 py-3 text-right">Total cheltuit</th>
                <th className="px-5 py-3 text-right">Inregistrat</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  <td className="px-5 py-3 font-semibold">{c.firstName} {c.lastName}</td>
                  <td className="px-5 py-3 text-neutral-500">{c.email}</td>
                  <td className="px-5 py-3 text-center">
                    {c.emailVerified
                      ? <CheckCircle size={16} className="mx-auto text-green-600" />
                      : <XCircle size={16} className="mx-auto text-neutral-300" />}
                  </td>
                  <td className="px-5 py-3 text-center font-black text-green-700">{c.deliveredOrders}</td>
                  <td className="px-5 py-3 text-center font-black text-red-500">{c.cancelledOrders}</td>
                  <td className="px-5 py-3 text-right font-black">{formatPrice(c.totalSpent)} lei</td>
                  <td className="px-5 py-3 text-right text-neutral-400">
                    {new Date(c.createdAt).toLocaleDateString("ro-RO")}
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-neutral-400">
                    Nu exista clienti inregistrati.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
