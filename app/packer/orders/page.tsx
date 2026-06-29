import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock, Calendar } from "lucide-react";
import PackerShell from "@/components/PackerShell";
import { isPackerAuthenticated } from "@/lib/packerAuth";
import { listOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  Noua: "bg-red-100 text-red-700",
  Confirmata: "bg-amber-100 text-amber-700",
  Livrata: "bg-green-100 text-green-700",
  Anulata: "bg-neutral-100 text-neutral-500",
};

const ROW_STYLES: Record<string, string> = {
  Noua: "bg-red-50 hover:bg-red-100",
  Confirmata: "bg-white hover:bg-neutral-50",
  Livrata: "bg-green-50 hover:bg-green-100",
  Anulata: "bg-white hover:bg-neutral-50 opacity-60",
};

export default async function PackerOrdersPage() {
  if (!(await isPackerAuthenticated())) redirect("/admin");

  const orders = await listOrders();

  return (
    <PackerShell title="Comenzi" description="Click pe o comanda pentru a vedea detaliile si a actualiza statusul.">
      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-black">Comenzi primite</h2>
          <span className="text-sm font-semibold text-neutral-500">{orders.length} comenzi</span>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
            Nu exista comenzi plasate inca.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-neutral-200">
            {orders.map((order, i) => {
              const d = new Date(order.createdAt);
              const date = d.toLocaleDateString("ro-RO", { day: "2-digit", month: "short", year: "numeric" });
              const time = d.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
              const rowBg = ROW_STYLES[order.status] ?? "bg-white hover:bg-neutral-50";
              const badge = STATUS_STYLES[order.status] ?? "bg-neutral-100 text-neutral-500";

              return (
                <Link
                  key={order.id}
                  href={`/packer/orders/${order.id}`}
                  className={`flex items-center gap-4 px-5 py-4 transition-colors ${rowBg} ${i !== 0 ? "border-t border-neutral-200" : ""}`}
                >
                  <span className="min-w-0 flex-1 font-black text-neutral-900">{order.id}</span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap text-sm text-neutral-500">
                    <Calendar size={14} /> {date}
                  </span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap text-sm text-neutral-500">
                    <Clock size={14} /> {time}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${badge}`}>
                    {order.status}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </PackerShell>
  );
}
