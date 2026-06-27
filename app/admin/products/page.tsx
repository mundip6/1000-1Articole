import { redirect } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { categories, formatPrice, type Product } from "@/lib/data";
import { listProducts } from "@/lib/products";
import { createProductAction, deleteProductAction, updateProductAction } from "../actions";
import ImageUpload from "./ImageUpload";
import ImportExcel from "./ImportExcel";

export const dynamic = "force-dynamic";

function CategorySelect({ defaultValue }: { defaultValue?: string }) {
  return (
    <select
      name="category"
      defaultValue={defaultValue || "Pui"}
      className="w-full rounded border border-neutral-200 px-2 py-2 text-sm outline-none focus:border-brand"
    >
      {categories.map((category) => (
        <option key={category.name} value={category.name}>
          {category.name}
        </option>
      ))}
    </select>
  );
}

function UnitSelect({ defaultValue }: { defaultValue?: Product["unit"] }) {
  return (
    <select
      name="unit"
      defaultValue={defaultValue || "kg"}
      className="w-full rounded border border-neutral-200 px-2 py-2 text-sm outline-none focus:border-brand"
    >
      <option value="kg">kg</option>
      <option value="buc">buc</option>
    </select>
  );
}

export default async function AdminProductsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  const products = await listProducts();

  return (
    <AdminShell title="Admin produse" description="Adauga produse noi sau modifica nume, preturi si categorii." active="products">
        <section className="mb-6 rounded-lg border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-black"><Plus size={20} className="text-brand" /> Produs nou</h2>
          <form action={createProductAction} className="space-y-3">
            <div className="grid gap-3 md:grid-cols-[2fr_1fr_120px_100px_1fr_100px]">
              <input name="name" required placeholder="Nume produs" className="rounded border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand" />
              <CategorySelect />
              <input name="price" required type="number" min="0" step="0.01" placeholder="Pret" className="rounded border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand" />
              <UnitSelect />
              <input name="weight" placeholder="Greutate / calibru" className="rounded border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand" />
              <input name="stock" type="number" min="0" step="1" placeholder="Stoc" defaultValue={0} className="rounded border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-neutral-500">Foto produs</p>
                <ImageUpload />
              </div>
              <div className="grid gap-3">
                <label className="text-xs font-semibold uppercase text-neutral-500">
                  Valori nutritionale 100g
                  <textarea
                    name="nutritionInfo"
                    rows={4}
                    placeholder={"Energie: 250 kcal\nProteine: 18g\nGrăsimi: 12g\nGlucide: 0g\nSare: 0.8g"}
                    className="mt-1 w-full rounded border border-neutral-200 px-3 py-2 text-sm normal-case text-neutral-900 outline-none focus:border-brand"
                  />
                </label>
                <label className="text-xs font-semibold uppercase text-neutral-500">
                  Specificatii
                  <textarea
                    name="specifications"
                    rows={4}
                    placeholder={"Tara de origine: Polonia\nAmbalaj: Vrac\nTemperatura depozitare: -18°C"}
                    className="mt-1 w-full rounded border border-neutral-200 px-3 py-2 text-sm normal-case text-neutral-900 outline-none focus:border-brand"
                  />
                </label>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                <input type="checkbox" name="packagedByUs" className="h-4 w-4 accent-brand" />
                Ambalat de noi
              </label>
              <button className="inline-flex items-center justify-center gap-2 rounded bg-brand px-4 py-2 text-sm font-black text-white hover:bg-brand-dark">
                <Plus size={16} /> Adauga
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-xl font-black">Produse existente</h2>
              <span className="text-sm font-semibold text-neutral-500">{products.length} produse</span>
            </div>
            <ImportExcel />
          </div>
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="rounded-lg border border-neutral-200 p-4">
                <form action={updateProductAction} className="space-y-3">
                  <input type="hidden" name="id" value={product.id} />
                  <div className="grid gap-3 lg:grid-cols-[2fr_1fr_120px_100px_1fr_100px_auto_auto]">
                    <label className="text-xs font-semibold uppercase text-neutral-500">
                      Nume
                      <input name="name" defaultValue={product.name} required className="mt-1 w-full rounded border border-neutral-200 px-3 py-2 text-sm normal-case text-neutral-900 outline-none focus:border-brand" />
                    </label>
                    <label className="text-xs font-semibold uppercase text-neutral-500">
                      Categorie
                      <span className="mt-1 block normal-case">
                        <CategorySelect defaultValue={product.category} />
                      </span>
                    </label>
                    <label className="text-xs font-semibold uppercase text-neutral-500">
                      Pret
                      <input name="price" defaultValue={product.price} required type="number" min="0" step="0.01" className="mt-1 w-full rounded border border-neutral-200 px-3 py-2 text-sm normal-case text-neutral-900 outline-none focus:border-brand" />
                    </label>
                    <label className="text-xs font-semibold uppercase text-neutral-500">
                      Unitate
                      <span className="mt-1 block normal-case">
                        <UnitSelect defaultValue={product.unit} />
                      </span>
                    </label>
                    <label className="text-xs font-semibold uppercase text-neutral-500">
                      Greutate
                      <input name="weight" defaultValue={product.weight || ""} className="mt-1 w-full rounded border border-neutral-200 px-3 py-2 text-sm normal-case text-neutral-900 outline-none focus:border-brand" />
                    </label>
                    <label className="text-xs font-semibold uppercase text-neutral-500">
                      Stoc
                      <input name="stock" type="number" min="0" step="1" defaultValue={product.stock} className="mt-1 w-full rounded border border-neutral-200 px-3 py-2 text-sm normal-case text-neutral-900 outline-none focus:border-brand" />
                    </label>
                    <div className="flex items-end">
                      <button className="inline-flex w-full items-center justify-center gap-2 rounded bg-neutral-900 px-4 py-2 text-sm font-black text-white hover:bg-brand">
                        <Save size={16} /> Salveaza
                      </button>
                    </div>
                    <div className="flex items-end">
                      <button form={`delete-${product.id}`} className="inline-flex w-full items-center justify-center gap-2 rounded border border-red-200 px-4 py-2 text-sm font-black text-red-700 hover:bg-red-50">
                        <Trash2 size={16} /> Sterge
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase text-neutral-500">Foto produs</p>
                      <ImageUpload currentUrl={product.imageUrl} />
                      <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm font-semibold">
                        <input type="checkbox" name="packagedByUs" defaultChecked={product.packagedByUs} className="h-4 w-4 accent-brand" />
                        Ambalat de noi
                      </label>
                    </div>
                    <div className="grid gap-3">
                      <label className="text-xs font-semibold uppercase text-neutral-500">
                        Valori nutritionale 100g
                        <textarea
                          name="nutritionInfo"
                          defaultValue={product.nutritionInfo || ""}
                          rows={4}
                          placeholder={"Energie: 250 kcal\nProteine: 18g\nGrăsimi: 12g\nGlucide: 0g\nSare: 0.8g"}
                          className="mt-1 w-full rounded border border-neutral-200 px-3 py-2 text-sm normal-case text-neutral-900 outline-none focus:border-brand"
                        />
                      </label>
                      <label className="text-xs font-semibold uppercase text-neutral-500">
                        Specificatii
                        <textarea
                          name="specifications"
                          defaultValue={product.specifications || ""}
                          rows={4}
                          placeholder={"Tara de origine: Polonia\nAmbalaj: Vrac\nTemperatura depozitare: -18°C"}
                          className="mt-1 w-full rounded border border-neutral-200 px-3 py-2 text-sm normal-case text-neutral-900 outline-none focus:border-brand"
                        />
                      </label>
                    </div>
                  </div>
                </form>
                <form id={`delete-${product.id}`} action={deleteProductAction}>
                  <input type="hidden" name="id" value={product.id} />
                </form>
                <p className="mt-2 text-xs text-neutral-500">
                  ID: {product.id} | Afisat in catalog ca {formatPrice(product.price)} lei/{product.unit}
                </p>
              </div>
            ))}
          </div>
        </section>
    </AdminShell>
  );
}
