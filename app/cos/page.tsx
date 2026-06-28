"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle, ShoppingBag, Trash2, UserRound } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cartTotal, cartWeight, clearCart, getCart, removeFromCart, updateQty, type CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/data";
import CountyCitySelect from "@/components/CountyCitySelect";

type CustomerResponse = {
  ok: boolean;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    isBusiness: boolean;
    company: string;
    cui: string;
    phone: string;
    county: string;
    city: string;
    address: string;
  } | null;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(() => getCart());
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [prefilledFromAccount, setPrefilledFromAccount] = useState(false);
  const [form, setForm] = useState({
    isBusiness: false,
    company: "",
    cui: "",
    contact: "",
    phone: "",
    email: "",
    county: "",
    city: "",
    address: "",
    notes: "",
  });

  const total = cartTotal(cart);
  const weight = cartWeight(cart);
  const minimumValue = form.county === "Maramureș" ? 50 : 300;
  const meetsMinimum = total >= minimumValue;

  useEffect(() => {
    let ignore = false;

    async function loadCustomer() {
      try {
        const response = await fetch("/api/customer/me");
        const data = (await response.json()) as CustomerResponse;
        if (ignore || !data.customer) return;

        setForm((prev) => ({
          ...prev,
          isBusiness: Boolean(data.customer?.isBusiness),
          company: data.customer?.isBusiness ? data.customer.company : prev.company,
          cui: data.customer?.isBusiness ? data.customer.cui : prev.cui,
          contact: `${data.customer?.firstName || ""} ${data.customer?.lastName || ""}`.trim(),
          phone: data.customer?.phone || "",
          email: data.customer?.email || "",
          county: data.customer?.county || "",
          city: data.customer?.city || "",
          address: data.customer?.address || "",
        }));
        setPrefilledFromAccount(true);
      } catch {
        setPrefilledFromAccount(false);
      }
    }

    window.setTimeout(() => void loadCustomer(), 0);

    return () => {
      ignore = true;
    };
  }, []);

  const changeQty = (id: string, qty: number) => {
    if (qty < 1) return;
    setCart(updateQty(id, qty));
  };

  const remove = (id: string) => setCart(removeFromCart(id));

  const submitOrder = async () => {
    if (!form.contact || !form.phone || !form.email || !form.county) return;
    setSubmitting(true);
    setError("");

    try {
      if (form.isBusiness) {
        const validateResponse = await fetch("/api/validate-cui", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cui: form.cui }),
        });
        const validateData = (await validateResponse.json()) as { valid: boolean; message?: string };
        if (!validateData.valid) {
          throw new Error(validateData.message || "CUI invalid.");
        }
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items: cart }),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Comanda nu a putut fi salvata.");
      }

      clearCart();
      setCart([]);
      setSuccess(true);
    } catch (orderError) {
      setError(orderError instanceof Error ? orderError.message : "Comanda nu a putut fi salvata.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-24 text-center">
          <CheckCircle size={56} className="mx-auto mb-6 text-green-600" />
          <h1 className="mb-3 text-3xl font-black">Comanda plasata!</h1>
          <p className="mb-6 text-neutral-500">
            Va vom contacta la numarul furnizat pentru confirmare si stabilirea livrarii.
          </p>
          <Link href="/catalog" className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 font-black text-white hover:bg-brand-dark">
            <ShoppingBag size={16} /> Comanda din nou
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Link href="/catalog" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-neutral-500 hover:text-brand">
          <ArrowLeft size={15} /> Inapoi la catalog
        </Link>
        <h1 className="mb-6 text-3xl font-black">Cosul meu</h1>
        {cart.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag size={48} className="mx-auto mb-4 text-neutral-400" />
            <p className="mb-4 text-neutral-500">Cosul este gol.</p>
            <Link href="/catalog" className="inline-flex rounded-lg bg-brand px-6 py-3 font-black text-white">Vezi catalogul</Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-2">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold">{item.name}</div>
                    {item.weight && <div className="text-xs text-neutral-500">{item.weight}</div>}
                    <div className="mt-1 text-sm font-black text-brand">{formatPrice(item.price)} lei/{item.unit}</div>
                  </div>
                  <div className="flex items-center overflow-hidden rounded border border-neutral-200">
                    <button onClick={() => changeQty(item.id, item.qty - 1)} className="px-3 py-1 font-black text-neutral-500">-</button>
                    <span className="min-w-8 text-center text-sm font-bold">{item.qty}</span>
                    <button onClick={() => changeQty(item.id, item.qty + 1)} className="px-3 py-1 font-black text-neutral-500">+</button>
                  </div>
                  <div className="min-w-24 text-right text-sm font-black">{formatPrice(item.price * item.qty)} lei</div>
                  <button aria-label="Sterge produsul" onClick={() => remove(item.id)} className="text-neutral-400 hover:text-brand">
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
            <aside className="space-y-4">
              <div className="rounded-lg border border-neutral-200 bg-white p-5">
                <h2 className="mb-4 font-black">Sumar Comanda</h2>
                <div className="space-y-2 text-sm text-neutral-500">
                  <p className="flex justify-between"><span>Valoare totala</span><strong className="text-neutral-900">{formatPrice(total)} lei</strong></p>
                  <p className="flex justify-between"><span>Greutate estimata</span><strong className="text-neutral-900">{formatPrice(weight)} kg</strong></p>
                </div>
                {!meetsMinimum && (
                  <div className="mt-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    <AlertTriangle size={15} /> Comanda minima este {minimumValue} lei.
                  </div>
                )}
                {error && (
                  <div className="mt-4 flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    <AlertTriangle size={15} /> {error}
                  </div>
                )}
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white p-5">
                <h2 className="mb-4 font-black">Date Firma</h2>
                {prefilledFromAccount && (
                  <div className="mb-4 flex gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-xs font-semibold text-green-800">
                    <UserRound size={15} /> Date completate automat din contul tau.
                  </div>
                )}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                    <input
                      type="checkbox"
                      checked={form.isBusiness}
                      onChange={(event) => setForm((prev) => ({ ...prev, isBusiness: event.target.checked }))}
                      className="h-4 w-4 accent-brand"
                    />
                    Comanda pe firma
                  </label>
                  {form.isBusiness && (
                    <>
                      <label className="block text-xs font-semibold text-neutral-500">
                        Denumire firma
                        <input
                          value={form.company}
                          onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
                          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand"
                        />
                      </label>
                      <label className="block text-xs font-semibold text-neutral-500">
                        CUI *
                        <input
                          value={form.cui}
                          onChange={(event) => setForm((prev) => ({ ...prev, cui: event.target.value }))}
                          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand"
                        />
                      </label>
                    </>
                  )}
                  {[
                    ["contact", "Persoana contact *"],
                    ["phone", "Telefon *"],
                    ["email", "Email *"],
                    ["address", "Adresa livrare"],
                  ].map(([key, label]) => (
                    <label key={key} className="block text-xs font-semibold text-neutral-500">
                      {label}
                      <input
                        value={String(form[key as keyof typeof form])}
                        onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
                        className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand"
                      />
                    </label>
                  ))}
                  <CountyCitySelect
                    county={form.county}
                    city={form.city}
                    onCountyChange={(county) => setForm((prev) => ({ ...prev, county }))}
                    onCityChange={(city) => setForm((prev) => ({ ...prev, city }))}
                  />
                  <label className="block text-xs font-semibold text-neutral-500">
                    Observatii
                    <textarea
                      value={form.notes}
                      onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                      rows={3}
                      className="mt-1 w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand"
                    />
                  </label>
                </div>
                <button
                  onClick={submitOrder}
                  disabled={submitting || !meetsMinimum || !form.contact || !form.phone || !form.email || !form.county || (form.isBusiness && !form.cui)}
                  className="mt-4 w-full rounded-lg bg-brand py-3 font-black text-white hover:bg-brand-dark disabled:opacity-50"
                >
                  {submitting ? "Se salveaza..." : "Plaseaza Comanda"}
                </button>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
