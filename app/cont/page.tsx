"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { LogOut, Mail, Phone, ShoppingBag, UserRound } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/data";
import { type Order } from "@/lib/orders";

type Customer = {
  company?: string;
  contact?: string;
  phone: string;
  email: string;
  county?: string;
  city?: string;
  address?: string;
};

const SESSION_KEY = "1001-customer-session";

function getSavedSession() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null") as { email: string; phone: string } | null;
  } catch {
    return null;
  }
}

export default function CustomerAccountPage() {
  const [email, setEmail] = useState(() => getSavedSession()?.email || "");
  const [phone, setPhone] = useState(() => getSavedSession()?.phone || "");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async (credentials: { email: string; phone: string }) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/customer/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
        customer: Customer;
        orders: Order[];
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Nu am putut incarca comenzile.");
      }

      setCustomer(data.customer);
      setOrders(data.orders);
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(credentials));
    } catch (accountError) {
      setError(accountError instanceof Error ? accountError.message : "Nu am putut incarca comenzile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = getSavedSession();
    if (saved?.email && saved?.phone) {
      window.setTimeout(() => void loadOrders(saved), 0);
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void loadOrders({ email, phone });
  };

  const logout = () => {
    window.localStorage.removeItem(SESSION_KEY);
    setCustomer(null);
    setOrders([]);
    setEmail("");
    setPhone("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-brand">
            <UserRound size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black">Cont client</h1>
            <p className="text-sm text-neutral-500">Vezi datele tale si comenzile plasate.</p>
          </div>
        </div>

        {!customer ? (
          <section className="max-w-md rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-2 text-xl font-black">Autentificare client</h2>
            <p className="mb-5 text-sm text-neutral-500">
              Introdu emailul si telefonul folosite la comanda. Pentru versiunea locala, acestea tin loc de autentificare.
            </p>
            {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
            <form onSubmit={submit} className="space-y-4">
              <label className="block text-sm font-semibold">
                Email
                <span className="relative mt-2 block">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    required
                    className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-3 outline-none focus:border-brand"
                  />
                </span>
              </label>
              <label className="block text-sm font-semibold">
                Telefon
                <span className="relative mt-2 block">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                    className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-3 outline-none focus:border-brand"
                  />
                </span>
              </label>
              <button disabled={loading} className="w-full rounded-lg bg-brand py-3 font-black text-white hover:bg-brand-dark disabled:opacity-50">
                {loading ? "Se incarca..." : "Intra in cont"}
              </button>
            </form>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <aside className="space-y-4">
              <section className="rounded-lg border border-neutral-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-black">Date personale</h2>
                  <button onClick={logout} className="inline-flex items-center gap-1 text-sm font-bold text-brand hover:underline">
                    <LogOut size={15} /> Iesire
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  {customer.company && <p><strong>Firma:</strong> {customer.company}</p>}
                  {customer.contact && <p><strong>Contact:</strong> {customer.contact}</p>}
                  <p><strong>Email:</strong> {customer.email}</p>
                  <p><strong>Telefon:</strong> {customer.phone}</p>
                  {customer.county && <p><strong>Judet:</strong> {customer.county}</p>}
                  {customer.city && <p><strong>Localitate:</strong> {customer.city}</p>}
                  {customer.address && <p><strong>Adresa:</strong> {customer.address}</p>}
                </div>
              </section>
              <Link href="/catalog" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 font-black text-white hover:bg-brand-dark">
                <ShoppingBag size={17} /> Plaseaza comanda noua
              </Link>
            </aside>

            <section className="rounded-lg border border-neutral-200 bg-white p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-black">Comenzile mele</h2>
                <span className="text-sm font-semibold text-neutral-500">{orders.length} comenzi</span>
              </div>
              {orders.length === 0 ? (
                <div className="rounded-lg border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
                  Nu exista comenzi pentru acest email si telefon.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <article key={order.id} className="rounded-lg border border-neutral-200 p-4">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                          <h3 className="font-black">{order.id}</h3>
                          <p className="text-sm text-neutral-500">{new Date(order.createdAt).toLocaleString("ro-RO")}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-brand">{order.status}</span>
                          <p className="mt-2 text-sm font-black">{formatPrice(order.total)} lei</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2 border-t border-neutral-100 pt-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between gap-4 text-sm">
                            <span className="font-semibold">{item.name}</span>
                            <span className="shrink-0 text-neutral-500">{item.qty} {item.unit}</span>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
