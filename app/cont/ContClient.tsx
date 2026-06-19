"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, LogOut, Mail, ShoppingBag, UserRound, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/data";
import { type Order } from "@/lib/orders";
import { type PublicCustomer } from "@/lib/customers";

type Mode = "login" | "register";

const emptyProfile = {
  firstName: "",
  lastName: "",
  isBusiness: false,
  company: "",
  cui: "",
  phone: "",
  county: "",
  city: "",
  address: "",
};

export default function CustomerAccountPage() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("login");
  const [customer, setCustomer] = useState<PublicCustomer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDone, setResendDone] = useState(false);
  const [auth, setAuth] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    isBusiness: false,
  });
  const [profile, setProfile] = useState(emptyProfile);

  const loadAccount = async () => {
    setLoading(true);
    setMessage("");
    try {
      const meResponse = await fetch("/api/customer/me");
      const meData = (await meResponse.json()) as { ok: boolean; customer: PublicCustomer | null };

      if (!meData.customer) {
        setCustomer(null);
        setOrders([]);
        return;
      }

      setCustomer(meData.customer);
      setProfile({
        firstName: meData.customer.firstName,
        lastName: meData.customer.lastName,
        isBusiness: meData.customer.isBusiness,
        company: meData.customer.company,
        cui: meData.customer.cui,
        phone: meData.customer.phone,
        county: meData.customer.county,
        city: meData.customer.city,
        address: meData.customer.address,
      });

      const ordersResponse = await fetch("/api/customer/orders");
      const ordersData = (await ordersResponse.json()) as { ok: boolean; orders: Order[] };
      setOrders(ordersData.ok ? ordersData.orders : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.setTimeout(() => void loadAccount(), 0);
  }, []);

  const submitAuth = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/customer/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(auth),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Operatia nu a reusit.");
      }
      await loadAccount();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Operatia nu a reusit.");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/customer/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Profilul nu a putut fi salvat.");
      }
      setMessage("Datele au fost salvate.");
      await loadAccount();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Profilul nu a putut fi salvat.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/customer/logout", { method: "POST" });
    setCustomer(null);
    setOrders([]);
    setMode("login");
  };

  const resendVerification = async () => {
    setResendLoading(true);
    await fetch("/api/customer/resend-verification", { method: "POST" });
    setResendLoading(false);
    setResendDone(true);
  };

  const cancelOrder = async (id: string) => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/customer/orders/${id}/cancel`, { method: "PATCH" });
      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Comanda nu a putut fi anulata.");
      }
      await loadAccount();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Comanda nu a putut fi anulata.");
    } finally {
      setLoading(false);
    }
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
            <p className="text-sm text-neutral-500">Autentificare, date personale si comenzi.</p>
          </div>
        </div>

        {searchParams.get("verified") === "1" && (
          <div className="mb-5 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">
            <CheckCircle2 size={18} className="shrink-0" /> Email verificat cu succes! Contul tau este acum activ.
          </div>
        )}
        {searchParams.get("verified") === "0" && (
          <div className="mb-5 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            <AlertCircle size={18} className="shrink-0" /> Link invalid sau expirat. Solicita un email nou mai jos.
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-lg border border-neutral-200 bg-white p-3 text-sm font-semibold text-neutral-700">
            {message}
          </div>
        )}

        {!customer ? (
          <section className="max-w-md rounded-lg border border-neutral-200 bg-white p-6">
            <div className="mb-5 flex rounded-lg border border-neutral-200 p-1">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-black ${mode === "login" ? "bg-brand text-white" : "text-neutral-600"}`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-black ${mode === "register" ? "bg-brand text-white" : "text-neutral-600"}`}
              >
                Register
              </button>
            </div>

            <h2 className="mb-2 text-xl font-black">{mode === "login" ? "Autentificare client" : "Creare cont client"}</h2>
            <p className="mb-5 text-sm text-neutral-500">
              {mode === "login"
                ? "Intra in cont cu email si parola."
                : "Daca nu ai cont, completeaza datele de mai jos."}
            </p>

            <form onSubmit={submitAuth} className="space-y-4">
              {mode === "register" && (
                <>
                  <label className="block text-sm font-semibold">
                    Prenume
                    <input
                      value={auth.firstName}
                      onChange={(event) => setAuth((prev) => ({ ...prev, firstName: event.target.value }))}
                      required
                      className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-3 outline-none focus:border-brand"
                    />
                  </label>
                  <label className="block text-sm font-semibold">
                    Nume
                    <input
                      value={auth.lastName}
                      onChange={(event) => setAuth((prev) => ({ ...prev, lastName: event.target.value }))}
                      required
                      className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-3 outline-none focus:border-brand"
                    />
                  </label>
                </>
              )}
              <label className="block text-sm font-semibold">
                Email
                <span className="relative mt-2 block">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    value={auth.email}
                    onChange={(event) => setAuth((prev) => ({ ...prev, email: event.target.value }))}
                    type="email"
                    required
                    className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-3 outline-none focus:border-brand"
                  />
                </span>
              </label>
              <label className="block text-sm font-semibold">
                Parola
                <input
                  value={auth.password}
                  onChange={(event) => setAuth((prev) => ({ ...prev, password: event.target.value }))}
                  type="password"
                  required
                  className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-3 outline-none focus:border-brand"
                />
              </label>
              {mode === "register" && (
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={auth.isBusiness}
                    onChange={(event) => setAuth((prev) => ({ ...prev, isBusiness: event.target.checked }))}
                    className="h-4 w-4 accent-brand"
                  />
                  Sunt firma
                </label>
              )}
              <button disabled={loading} className="w-full rounded-lg bg-brand py-3 font-black text-white hover:bg-brand-dark disabled:opacity-50">
                {loading ? "Se incarca..." : mode === "login" ? "Intra in cont" : "Creeaza cont"}
              </button>
            </form>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {!customer.emailVerified && (
            <div className="col-span-full mb-2 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                <AlertCircle size={17} className="shrink-0" />
                Email-ul nu este verificat. Verifica-ti inbox-ul sau solicita un nou email.
              </div>
              {resendDone ? (
                <span className="text-sm font-semibold text-green-700">Email trimis!</span>
              ) : (
                <button
                  onClick={() => void resendVerification()}
                  disabled={resendLoading}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-black text-white hover:bg-amber-700 disabled:opacity-50"
                >
                  {resendLoading ? "Se trimite..." : "Retrimite email"}
                </button>
              )}
            </div>
          )}

          <aside className="space-y-4">
              <section className="rounded-lg border border-neutral-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-black">Date personale</h2>
                  <button onClick={logout} className="inline-flex items-center gap-1 text-sm font-bold text-brand hover:underline">
                    <LogOut size={15} /> Iesire
                  </button>
                </div>
                <form onSubmit={saveProfile} className="space-y-3">
                  {[
                    ["firstName", "Prenume"],
                    ["lastName", "Nume"],
                    ["phone", "Telefon"],
                    ["county", "Judet"],
                    ["city", "Localitate"],
                    ["address", "Adresa"],
                  ].map(([key, label]) => (
                    <label key={key} className="block text-xs font-semibold text-neutral-500">
                      {label}
                      <input
                        value={String(profile[key as keyof typeof profile])}
                        onChange={(event) => setProfile((prev) => ({ ...prev, [key]: event.target.value }))}
                        className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand"
                      />
                    </label>
                  ))}
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="checkbox"
                      checked={profile.isBusiness}
                      onChange={(event) => setProfile((prev) => ({ ...prev, isBusiness: event.target.checked }))}
                      className="h-4 w-4 accent-brand"
                    />
                    Sunt firma
                  </label>
                  {profile.isBusiness && (
                    <>
                      <label className="block text-xs font-semibold text-neutral-500">
                        Denumire firma
                        <input
                          value={profile.company}
                          onChange={(event) => setProfile((prev) => ({ ...prev, company: event.target.value }))}
                          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand"
                        />
                      </label>
                      <label className="block text-xs font-semibold text-neutral-500">
                        CUI
                        <input
                          value={profile.cui}
                          onChange={(event) => setProfile((prev) => ({ ...prev, cui: event.target.value }))}
                          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand"
                          required={profile.isBusiness}
                        />
                      </label>
                    </>
                  )}
                  <p className="text-xs text-neutral-500">Email: {customer.email}</p>
                  <button className="w-full rounded-lg bg-neutral-900 py-2 text-sm font-black text-white hover:bg-brand">
                    Salveaza datele
                  </button>
                </form>
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
                  Nu exista comenzi pentru acest cont.
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
                          {order.status === "Noua" && (
                            <button
                              onClick={() => void cancelOrder(order.id)}
                              className="mt-2 inline-flex items-center gap-1 text-xs font-black text-red-600 hover:underline"
                            >
                              <XCircle size={14} /> Anuleaza comanda
                            </button>
                          )}
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
