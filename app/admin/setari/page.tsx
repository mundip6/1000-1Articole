import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import AdminShell from "@/components/AdminShell";
import { getSettings, setSetting, SETTINGS_KEYS } from "@/lib/settings";
import { revalidatePath } from "next/cache";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";

async function saveSettingsAction(formData: FormData) {
  "use server";
  const minBM = String(formData.get("min_order_baia_mare") || "").trim();
  const minOther = String(formData.get("min_order_other") || "").trim();
  if (minBM && !isNaN(Number(minBM)) && Number(minBM) >= 0) {
    await setSetting(SETTINGS_KEYS.MIN_ORDER_BAIA_MARE, minBM);
  }
  if (minOther && !isNaN(Number(minOther)) && Number(minOther) >= 0) {
    await setSetting(SETTINGS_KEYS.MIN_ORDER_OTHER, minOther);
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
        </p>

        {saved && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            ✓ Setarile au fost salvate cu succes.
          </div>
        )}

        <form action={saveSettingsAction} className="space-y-4 max-w-sm">
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
