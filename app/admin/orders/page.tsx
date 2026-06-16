import { redirect } from "next/navigation";
import { Calendar, Mail, MapPin, Phone, Save } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { formatPrice } from "@/lib/data";
import { listOrders, type OrderStatus } from "@/lib/orders";
import { updateOrderStatusAction } from "../actions";

export const dynamic = "force-dynamic";

const statuses: OrderStatus[] = ["Noua", "Confirmata", "Livrata", "Anulata"];

export default async function AdminOrdersPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  const orders = await listOrders();

  return (
    <AdminShell title="Admin comenzi" description="Vezi comenzile plasate de clienti si actualizeaza statusul." active="orders">
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
          <div className="space-y-5">
            {orders.map((order) => (
              <article key={order.id} className="rounded-lg border border-neutral-200 p-5">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-black">{order.id}</h3>
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-brand">{order.status}</span>
                    </div>
                    <p className="mt-1 flex items-center gap-2 text-sm text-neutral-500">
                      <Calendar size={15} /> {new Date(order.createdAt).toLocaleString("ro-RO")}
                    </p>
                  </div>
                  <form action={updateOrderStatusAction} className="flex gap-2">
                    <input type="hidden" name="id" value={order.id} />
                    <select
                      name="status"
                      defaultValue={order.status}
                      className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold outline-none focus:border-brand"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <button className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-black text-white hover:bg-brand">
                      <Save size={16} /> Salveaza
                    </button>
                  </form>
                </div>

                <div className="mt-5 grid gap-4 border-t border-neutral-100 pt-5 md:grid-cols-2">
                  <div className="space-y-2 text-sm">
                    <p><strong>Firma:</strong> {order.company}</p>
                    <p><strong>Contact:</strong> {order.contact}</p>
                    <p className="flex items-center gap-2"><Phone size={15} className="text-brand" /> <a href={`tel:${order.phone}`}>{order.phone}</a></p>
                    <p className="flex items-center gap-2"><Mail size={15} className="text-brand" /> <a href={`mailto:${order.email}`}>{order.email}</a></p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2"><MapPin size={15} className="text-brand" /> {order.county}{order.city ? `, ${order.city}` : ""}</p>
                    {order.address && <p><strong>Adresa:</strong> {order.address}</p>}
                    {order.notes && <p><strong>Observatii:</strong> {order.notes}</p>}
                    <p><strong>Total:</strong> {formatPrice(order.total)} lei | <strong>Kg:</strong> {formatPrice(order.weight)}</p>
                  </div>
                </div>

                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 text-left text-xs uppercase text-neutral-500">
                        <th className="py-2 pr-3">Produs</th>
                        <th className="py-2 pr-3">Cantitate</th>
                        <th className="py-2 pr-3">Pret</th>
                        <th className="py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id} className="border-b border-neutral-100">
                          <td className="py-2 pr-3 font-semibold">{item.name}</td>
                          <td className="py-2 pr-3">{item.qty} {item.unit}</td>
                          <td className="py-2 pr-3">{formatPrice(item.price)} lei/{item.unit}</td>
                          <td className="py-2 text-right font-black">{formatPrice(item.price * item.qty)} lei</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
