import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Mail, MapPin, Phone, Save, Scale } from "lucide-react";
import PackerShell from "@/components/PackerShell";
import { isPackerAuthenticated } from "@/lib/packerAuth";
import { formatPrice } from "@/lib/data";
import { getOrder, type OrderStatus } from "@/lib/orders";
import { updateOrderActualWeightsPackerAction, updateOrderStatusPackerAction } from "../../actions";

export const dynamic = "force-dynamic";

const statuses: OrderStatus[] = ["Noua", "Confirmata", "Livrata", "Anulata"];

const STATUS_STYLES: Record<string, string> = {
  Noua: "bg-red-100 text-red-700",
  Confirmata: "bg-amber-100 text-amber-700",
  Livrata: "bg-green-100 text-green-700",
  Anulata: "bg-neutral-100 text-neutral-500",
};

export default async function PackerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isPackerAuthenticated())) redirect("/admin");

  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const d = new Date(order.createdAt);
  const dateTime = d.toLocaleString("ro-RO", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
  const badge = STATUS_STYLES[order.status] ?? "bg-neutral-100 text-neutral-500";

  const kgItems = order.items.filter((item) => item.unit === "kg");
  const hasKgItems = kgItems.length > 0;
  const allWeighed = kgItems.every((item) => item.actualQty !== undefined);

  const estimatedTotal = order.items.reduce((s, item) => s + item.price * item.qty, 0);
  const finalTotal = order.items.reduce((s, item) => {
    const qty = item.unit === "kg" && item.actualQty !== undefined ? item.actualQty : item.qty;
    return s + item.price * qty;
  }, 0);
  const diff = finalTotal - estimatedTotal;

  return (
    <PackerShell title={order.id} description={`Plasata pe ${dateTime}`}>
      <div className="mb-4">
        <Link href="/packer/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-brand">
          <ArrowLeft size={15} /> Inapoi la comenzi
        </Link>
      </div>

      <div className="space-y-5">
        {/* Status bar */}
        <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-neutral-500">Status curent:</span>
            <span className={`rounded-full px-3 py-1 text-xs font-black ${badge}`}>{order.status}</span>
          </div>
          <form action={updateOrderStatusPackerAction} className="flex gap-2">
            <input type="hidden" name="id" value={order.id} />
            <input type="hidden" name="redirectTo" value={`/packer/orders/${order.id}`} />
            <select
              name="status"
              defaultValue={order.status}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold outline-none focus:border-brand"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-black text-white hover:bg-brand">
              <Save size={16} /> Salveaza
            </button>
          </form>
        </div>

        {/* Client info + delivery */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-black uppercase tracking-wide text-neutral-500">Date client</h2>
            <div className="space-y-2 text-sm">
              {order.company && <p><strong>Firma:</strong> {order.company}</p>}
              {order.cui && <p><strong>CUI:</strong> {order.cui}</p>}
              <p><strong>Contact:</strong> {order.contact}</p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-brand" />
                <a href={`tel:${order.phone}`} className="hover:text-brand">{order.phone}</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-brand" />
                <a href={`mailto:${order.email}`} className="hover:text-brand">{order.email}</a>
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-black uppercase tracking-wide text-neutral-500">Livrare</h2>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-brand" />
                {order.county}{order.city ? `, ${order.city}` : ""}
              </p>
              {order.address && <p><strong>Adresa:</strong> {order.address}</p>}
              <p className="flex items-center gap-2">
                <Calendar size={14} className="text-brand" /> {dateTime}
              </p>
              {order.notes && (
                <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  <strong>Observatii:</strong> {order.notes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Products table */}
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-black uppercase tracking-wide text-neutral-500">Produse comandate</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-xs uppercase text-neutral-500">
                  <th className="py-2 pr-4">Produs</th>
                  <th className="py-2 pr-4">Cantitate</th>
                  <th className="py-2 pr-4">Pret unitar</th>
                  <th className="py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100 last:border-0">
                    <td className="py-2.5 pr-4 font-semibold">{item.name}</td>
                    <td className="py-2.5 pr-4">
                      {item.qty} {item.unit}
                      {item.unit === "kg" && item.actualQty !== undefined && (
                        <span className="ml-2 font-black text-green-700">→ {item.actualQty.toFixed(3)} kg</span>
                      )}
                    </td>
                    <td className="py-2.5 pr-4 text-neutral-500">{formatPrice(item.price)} lei/{item.unit}</td>
                    <td className="py-2.5 text-right font-black">{formatPrice(item.price * item.qty)} lei</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-neutral-200">
                  <td colSpan={3} className="pt-3 text-right text-sm font-semibold text-neutral-500">Total comanda</td>
                  <td className="pt-3 text-right text-lg font-black text-brand">{formatPrice(order.total)} lei</td>
                </tr>
                {order.weight > 0 && (
                  <tr>
                    <td colSpan={3} className="pt-1 text-right text-sm font-semibold text-neutral-500">Greutate estimata</td>
                    <td className="pt-1 text-right text-sm font-bold">{formatPrice(order.weight)} kg</td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
        </div>

        {/* Actual weights section */}
        {hasKgItems && (
          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Scale size={18} className="text-brand" />
              <h2 className="text-sm font-black uppercase tracking-wide text-neutral-500">Cantarire reala</h2>
            </div>

            <form action={updateOrderActualWeightsPackerAction} className="space-y-4">
              <input type="hidden" name="orderId" value={order.id} />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 text-left text-xs uppercase text-neutral-500">
                      <th className="py-2 pr-4">Produs (kg)</th>
                      <th className="py-2 pr-4">Comandat</th>
                      <th className="py-2 pr-4">Cantitate reala (kg)</th>
                      <th className="py-2 text-right">Pret final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kgItems.map((item) => {
                      const actual = item.actualQty;
                      const finalSubtotal = actual !== undefined ? item.price * actual : null;
                      return (
                        <tr key={item.itemId} className="border-b border-neutral-100 last:border-0">
                          <td className="py-2.5 pr-4 font-semibold">{item.name}</td>
                          <td className="py-2.5 pr-4 text-neutral-500">{item.qty} kg</td>
                          <td className="py-2.5 pr-4">
                            <input
                              type="number"
                              name={`actualQty_${item.itemId}`}
                              defaultValue={actual?.toFixed(3) ?? ""}
                              min="0"
                              step="0.001"
                              placeholder="0.000"
                              className="w-28 rounded border border-neutral-200 px-2 py-1 text-sm font-bold outline-none focus:border-brand"
                            />
                          </td>
                          <td className="py-2.5 text-right font-black">
                            {finalSubtotal !== null
                              ? <span className="text-green-700">{formatPrice(finalSubtotal)} lei</span>
                              : <span className="text-neutral-400">—</span>
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2 text-sm font-black text-white hover:bg-brand">
                <Save size={15} /> Salveaza greutatile
              </button>
            </form>

            {allWeighed && (
              <div className="mt-5 grid grid-cols-3 gap-4 border-t border-neutral-100 pt-5">
                <div className="rounded-lg bg-neutral-50 p-4 text-center">
                  <p className="text-xs font-semibold uppercase text-neutral-500">Total estimat</p>
                  <p className="mt-1 text-xl font-black text-neutral-600">{formatPrice(estimatedTotal)} lei</p>
                </div>
                <div className="rounded-lg bg-green-50 p-4 text-center">
                  <p className="text-xs font-semibold uppercase text-neutral-500">Total final</p>
                  <p className="mt-1 text-xl font-black text-green-700">{formatPrice(finalTotal)} lei</p>
                </div>
                <div className={`rounded-lg p-4 text-center ${diff >= 0 ? "bg-red-50" : "bg-blue-50"}`}>
                  <p className="text-xs font-semibold uppercase text-neutral-500">Diferenta</p>
                  <p className={`mt-1 text-xl font-black ${diff >= 0 ? "text-red-600" : "text-blue-600"}`}>
                    {diff >= 0 ? "+" : ""}{formatPrice(diff)} lei
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PackerShell>
  );
}
