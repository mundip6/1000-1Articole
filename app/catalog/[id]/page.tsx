import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProduct, getSimilarProducts } from "@/lib/products";
import { categories, formatPrice } from "@/lib/data";
import AddToCartButton from "./AddToCartButton";
import ProductTabs from "./ProductTabs";
import SimilarProducts from "./SimilarProducts";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const [category, similar] = await Promise.all([
    Promise.resolve(categories.find((c) => c.name === product.category)),
    getSimilarProducts(product.category, product.id),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Link href="/catalog" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-brand">
          <ArrowLeft size={16} /> Înapoi la catalog
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="h-full max-h-[480px] w-full object-cover" />
            ) : (
              <div className="flex h-80 items-center justify-center text-8xl text-neutral-200">
                {category?.icon ?? "🧊"}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-black text-brand">
                  <span>{category?.icon}</span> {product.category}
                </span>
                {product.packagedByUs && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                    📦 Ambalat de noi
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-black">{product.name}</h1>
              {product.weight && (
                <p className="mt-1 text-sm text-neutral-500">{product.weight}</p>
              )}
            </div>

            <AddToCartButton product={product} />
          </div>
        </div>

        <ProductTabs nutritionInfo={product.nutritionInfo} specifications={product.specifications} />
        <SimilarProducts products={similar} />
      </main>
      <Footer />
    </div>
  );
}
