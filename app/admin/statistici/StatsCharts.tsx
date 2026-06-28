"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@/lib/data";

type MonthPoint = { label: string; users: number; orders: number; revenue: number };
type Totals = {
  users: number; orders: number; revenue: number;
  ordersThisMonth: number; revenueThisMonth: number;
};

const BRAND = "#c8102e";
const GRID = "#f0f0f0";

function KPI({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-1 text-3xl font-black text-neutral-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-neutral-400">{sub}</p>}
    </div>
  );
}

function Chart({ title, data, dataKey, color = BRAND, unit = "" }: {
  title: string;
  data: MonthPoint[];
  dataKey: keyof MonthPoint;
  color?: string;
  unit?: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <h3 className="mb-4 text-base font-black">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#888" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#888" }}
            axisLine={false}
            tickLine={false}
            width={55}
            tickFormatter={(v: number) => unit ? `${formatPrice(v)}` : String(v)}
          />
          <Tooltip
            cursor={{ fill: "#fef2f2" }}
            formatter={(v) => [unit ? `${formatPrice(Number(v))} ${unit}` : v, title]}
            labelStyle={{ fontWeight: 700, fontSize: 12 }}
            contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey={dataKey as string} fill={color} radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function StatsCharts({ monthly, totals }: { monthly: MonthPoint[]; totals: Totals }) {
  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI label="Total utilizatori" value={String(totals.users)} />
        <KPI label="Comenzi luna aceasta" value={String(totals.ordersThisMonth)} />
        <KPI label="Venituri luna aceasta" value={`${formatPrice(totals.revenueThisMonth)} lei`} />
        <KPI label="Venituri totale" value={`${formatPrice(totals.revenue)} lei`} sub="din toate comenzile" />
      </div>

      {/* Charts */}
      <Chart title="Utilizatori noi pe luna" data={monthly} dataKey="users" />
      <Chart title="Comenzi pe luna" data={monthly} dataKey="orders" />
      <Chart title="Venituri pe luna (lei)" data={monthly} dataKey="revenue" unit="lei" />
    </div>
  );
}
