"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle, ShoppingBag, Trash2, UserRound } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cartTotal, cartWeight, clearCart, effectivePrice, getCart, removeFromCart, updateQty, type CartItem } from "@/lib/cart";
import { sendMetaEvent, saveMetaUser } from "@/lib/meta/send";
import { formatPrice } from "@/lib/data";
import CountyCitySelect from "@/components/CountyCitySelect";
import { CITY_SCHEDULE } from "@/lib/deliverySchedule";

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

  const paymentInfoFired = useRef(false);

  function handleFormFocus() {
    if (paymentInfoFired.current || !cart.length) return;
    paymentInfoFired.current = true;
    void sendMetaEvent("AddPaymentInfo", {
      content_ids: cart.map((i) => i.id),
      contents: cart.map((i) => ({ id: i.id, quantity: i.qty, item_price: effectivePrice(i) })),
      content_type: "product",
      num_items: cart.reduce((s, i) => s + i.qty, 0),
      value: cartTotal(cart),
      currency: "RON",
    });
  }

  const snapshotId = useRef<string | null>(
    typeof window !== "undefined" ? sessionStorage.getItem("cart_snapshot_id") : null
  );

  const syncSnapshot = useCallback(async (extra?: { email?: string; phone?: string; contact?: string; county?: string; city?: string }) => {
    const currentCart = getCart();
    if (!currentCart.length) return;
    const body = {
      id: snapshotId.current ?? undefined,
      items: currentCart.map((i) => ({ id: i.id, name: i.name, price: i.price, salePrice: i.salePrice, unit: i.unit, qty: i.qty })),
      total: cartTotal(currentCart),
      ...extra,
    };
    try {
      const res = await fetch("/api/cart/snapshot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json() as { ok: boolean; id?: string };
      if (data.ok && data.id) {
        snapshotId.current = data.id;
        sessionStorage.setItem("cart_snapshot_id", data.id);
      }
    } catch {}
  }, []);

  const [minBM, setMinBM] = useState(50);
  const [minOther, setMinOther] = useState(300);
  const [feeBM, setFeeBM] = useState(0);
  const [feeOther, setFeeOther] = useState(0);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s: Record<string, string>) => {
        setMinBM(Number(s["min_order_baia_mare"] ?? 50));
        setMinOther(Number(s["min_order_other"] ?? 300));
        setFeeBM(Number(s["shipping_fee_baia_mare"] ?? 0));
        setFeeOther(Number(s["shipping_fee_other"] ?? 0));
      })
      .catch(() => {});
  }, []);

  const total = cartTotal(cart);
  const weight = cartWeight(cart);
  const minimumValue = form.county === "Maramureș" ? minBM : minOther;
  const feeForZone = form.county === "Maramureș" ? feeBM : feeOther;
  const meetsMinimum = total >= minimumValue;
  const shippingFee = !meetsMinimum && feeForZone > 0 ? feeForZone : 0;
  const canOrder = meetsMinimum || feeForZone > 0;

  // Initial cart snapshot on page load
  useEffect(() => {
    if (cart.length > 0) void syncSnapshot();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update snapshot with contact details as user fills the form (debounced 2s)
  useEffect(() => {
    if (!cart.length || (!form.email && !form.phone)) return;
    const t = window.setTimeout(() => {
      void syncSnapshot({
        email: form.email || undefined,
        phone: form.phone || undefined,
        contact: form.contact || undefined,
        county: form.county || undefined,
        city: form.city || undefined,
      });
    }, 2000);
    return () => window.clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.email, form.phone, form.contact, form.county, form.city]);

  useEffect(() => {
    if (cart.length === 0) return;
    void sendMetaEvent(
      "InitiateCheckout",
      {
        content_ids: cart.map((i) => i.id),
        contents: cart.map((i) => ({ id: i.id, quantity: i.qty, item_price: effectivePrice(i) })),
        content_type: "product",
        num_items: cart.reduce((s, i) => s + i.qty, 0),
        value: cartTotal(cart),
        currency: "RON",
      },
      form.email || form.phone ? { email: form.email || undefined, phone: form.phone || undefined, city: form.city || undefined, country: "ro" } : undefined,
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        saveMetaUser({
          email: data.customer?.email || undefined,
          phone: data.customer?.phone || undefined,
          city: data.customer?.city || undefined,
          country: "ro",
        });
        void syncSnapshot({
          email: data.customer?.email || undefined,
          phone: data.customer?.phone || undefined,
          contact: `${data.customer?.firstName || ""} ${data.customer?.lastName || ""}`.trim() || undefined,
          county: data.customer?.county || undefined,
          city: data.customer?.city || undefined,
        });
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
        body: JSON.stringify({ ...form, items: cart, shippingFee }),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Comanda nu a putut fi salvata.");
      }

      void sendMetaEvent(
        "Purchase",
        {
          content_ids: cart.map((i) => i.id),
          contents: cart.map((i) => ({ id: i.id, quantity: i.qty, item_price: effectivePrice(i) })),
          content_type: "product",
          num_items: cart.reduce((s, i) => s + i.qty, 0),
          value: total,
          currency: "RON",
        },
        {
          email: form.email,
          phone: form.phone,
          city: form.city,
          country: "ro",
        },
      );
      saveMetaUser({
        email: form.email || undefined,
        phone: form.phone || undefined,
        city: form.city || undefined,
        country: "ro",
      });
      // Mark cart snapshot as converted so it doesn't show as abandoned
      if (snapshotId.current) {
        void fetch("/api/cart/snapshot", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: snapshotId.current }),
        });
        sessionStorage.removeItem("cart_snapshot_id");
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
                    {item.salePrice ? (
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-sm font-black text-brand">{formatPrice(item.salePrice)} lei/{item.unit}</span>
                        <span className="text-xs text-neutral-400 line-through">{formatPrice(item.price)}</span>
                        <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-black text-red-600">-{Math.round((1 - item.salePrice / item.price) * 100)}%</span>
                      </div>
                    ) : (
                      <div className="mt-1 text-sm font-black text-brand">{formatPrice(item.price)} lei/{item.unit}</div>
                    )}
                  </div>
                  <div className="flex items-center overflow-hidden rounded border border-neutral-200">
                    <button onClick={() => changeQty(item.id, item.qty - 1)} className="px-3 py-1 font-black text-neutral-500">-</button>
                    <span className="min-w-8 text-center text-sm font-bold">{item.qty}</span>
                    <button onClick={() => changeQty(item.id, item.qty + 1)} className="px-3 py-1 font-black text-neutral-500">+</button>
                  </div>
                  <div className="min-w-24 text-right text-sm font-black">{formatPrice(effectivePrice(item) * item.qty)} lei</div>
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
                  <p className="flex justify-between"><span>Valoare produse</span><strong className="text-neutral-900">{formatPrice(total)} lei</strong></p>
                  {shippingFee > 0 && (
                    <p className="flex justify-between"><span>Taxa livrare</span><strong className="text-neutral-900">+{formatPrice(shippingFee)} lei</strong></p>
                  )}
                  {shippingFee > 0 && (
                    <p className="flex justify-between border-t border-neutral-100 pt-2"><span className="font-semibold text-neutral-700">Total comanda</span><strong className="text-neutral-900">{formatPrice(total + shippingFee)} lei</strong></p>
                  )}
                  <p className="flex justify-between"><span>Greutate estimata</span><strong className="text-neutral-900">{formatPrice(weight)} kg</strong></p>
                </div>
                {!meetsMinimum && feeForZone > 0 && (
                  <div className="mt-4 flex gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
                    <AlertTriangle size={15} /> Livrare gratuita peste <strong className="ml-1">{minimumValue} lei</strong>
                  </div>
                )}
                {!meetsMinimum && feeForZone === 0 && (
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
                        onFocus={key === "contact" ? handleFormFocus : undefined}
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
                  {form.city && CITY_SCHEDULE[form.city] && (
                    <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-800">
                      🚚 Livrare în <strong>{form.city}</strong>: <strong>{CITY_SCHEDULE[form.city].day}</strong>
                    </div>
                  )}
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
                  disabled={submitting || !canOrder || !form.contact || !form.phone || !form.email || !form.county || (form.isBusiness && !form.cui)}
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
