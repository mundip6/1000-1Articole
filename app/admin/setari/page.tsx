import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import AdminShell from "@/components/AdminShell";
import { getSettings, setSetting, SETTINGS_KEYS } from "@/lib/settings";
import { revalidatePath } from "next/cache";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";

async function saveSettingsAction(formData: FormData) {
  "use server";
  const fields: [keyof typeof SETTINGS_KEYS, string][] = [
    ["MIN_ORDER_BAIA_MARE", "min_order_baia_mare"],
    ["MIN_ORDER_OTHER", "min_order_other"],
    ["SHIPPING_FEE_BAIA_MARE", "shipping_fee_baia_mare"],
    ["SHIPPING_FEE_OTHER", "shipping_fee_other"],
  ];
  for (const [key, name] of fields) {
    const val = String(formData.get(name) || "").trim();
    if (val !== "" && !isNaN(Number(val)) && Number(val) >= 0) {
      await setSetting(SETTINGS_KEYS[key], val);
    }
  }
  revalidatePath("/", "layout");
  redirect("/admin/setari?saved=1");
}

export default async function SetariPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  const { saved } = await searchParams;

  const settings = await getSettings([
    SETTINGS_KEYS.MIN_ORDER_BAIA_MARE,
    SETTINGS_KEYS.MIN_ORDER_OTHER,
    SETTINGS_KEYS.SHIPPING_FEE_BAIA_MARE,
    SETTINGS_KEYS.SHIPPING_FEE_OTHER,
  ]);

  return (
    <AdminShell
      title="Setari"
      description="Configurari generale ale site-ului."
      active="setari"
    >
      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-black">
          <Settings size={18} className="text-brand" /> Comenzi minime
        </h2>
        <p className="mb-5 text-sm text-neutral-500">
          Valorile se actualizeaza automat in banda de livrare, footer, cos si pagina "Cum comand".
          Taxa de livrare se adauga la comenzile sub valoarea minima. Seteaza 0 pentru a pastra comportamentul actual (comanda minima obligatorie).
        </p>

        {saved && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            ✓ Setarile au fost salvate cu succes.
          </div>
        )}

        <form action={saveSettingsAction} className="space-y-5 max-w-sm">
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-wide text-neutral-400">Comenzi minime</p>
            <label className="block text-xs font-semibold uppercase text-neutral-500">
              Comanda minima Baia Mare (lei)
              <input
                name="min_order_baia_mare"
                type="number"
                min="0"
                step="1"
                defaultValue={settings[SETTINGS_KEYS.MIN_ORDER_BAIA_MARE]}
                className="mt-1 w-full rounded border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand"
              />
            </label>
            <label className="block text-xs font-semibold uppercase text-neutral-500">
              Comanda minima alte localitati (lei)
              <input
                name="min_order_other"
                type="number"
                min="0"
                step="1"
                defaultValue={settings[SETTINGS_KEYS.MIN_ORDER_OTHER]}
                className="mt-1 w-full rounded border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand"
              />
            </label>
          </div>

          <div className="space-y-3 border-t border-neutral-100 pt-5">
            <p className="text-xs font-black uppercase tracking-wide text-neutral-400">Taxa de livrare (0 = comanda minima obligatorie)</p>
            <label className="block text-xs font-semibold uppercase text-neutral-500">
              Taxa livrare Baia Mare (lei)
              <input
                name="shipping_fee_baia_mare"
                type="number"
                min="0"
                step="1"
                defaultValue={settings[SETTINGS_KEYS.SHIPPING_FEE_BAIA_MARE]}
                className="mt-1 w-full rounded border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand"
              />
            </label>
            <label className="block text-xs font-semibold uppercase text-neutral-500">
              Taxa livrare alte localitati (lei)
              <input
                name="shipping_fee_other"
                type="number"
                min="0"
                step="1"
                defaultValue={settings[SETTINGS_KEYS.SHIPPING_FEE_OTHER]}
                className="mt-1 w-full rounded border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand"
              />
            </label>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 text-sm font-black text-white hover:bg-red-700"
          >
            Salveaza
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
