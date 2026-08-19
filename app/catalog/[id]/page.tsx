import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/FooterServer";
import { getProduct, getSimilarProducts } from "@/lib/products";
import { categories, formatPrice } from "@/lib/data";
import AddToCartButton from "./AddToCartButton";
import ImageZoom from "./ImageZoom";
import ProductTabs from "./ProductTabs";
import SimilarProducts from "./SimilarProducts";
import { ProductTracking } from "./ProductTracking";
import DeliveryInfo from "@/components/DeliveryInfo";
import { getSettings, SETTINGS_KEYS } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return {};
  const effectivePrice = product.salePrice ?? product.price;
  const autoDescription = `Cumpara ${product.name} en-gros la ${formatPrice(effectivePrice)} lei/${product.unit}. Disponibil la 1000&1 Articole Baia Mare — livrare in Maramures, Satu Mare, Salaj.`;
  const description = product.metaDescription || autoDescription;

  // Keep full title under 60 chars — template appends " | 1000&1 Articole" (18 chars)
  const SUFFIX_LEN = " | 1000&1 Articole".length; // 18
  const titleName = product.name.length + SUFFIX_LEN <= 60
    ? product.name
    : product.name.substring(0, 60 - SUFFIX_LEN).trimEnd();

  return {
    title: titleName,
    description,
    alternates: { canonical: `/catalog/${id}` },
    openGraph: {
      title: product.name,
      description: product.metaDescription || `${product.name} — ${formatPrice(effectivePrice)} lei/${product.unit} | 1000&1 Articole engros Baia Mare`,
      ...(product.imageUrl ? { images: [{ url: product.imageUrl }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const [category, similar, settings] = await Promise.all([
    Promise.resolve(categories.find((c) => c.name === product.category)),
    getSimilarProducts(product.category, product.id),
    getSettings([SETTINGS_KEYS.MIN_ORDER_BAIA_MARE, SETTINGS_KEYS.MIN_ORDER_OTHER, SETTINGS_KEYS.SHIPPING_FEE_BAIA_MARE, SETTINGS_KEYS.SHIPPING_FEE_OTHER]),
  ]);

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.1000-1-articole.com";
  const effectivePrice = product.salePrice ?? product.price;
  const priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString().split("T")[0];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Acasa", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Catalog", item: `${BASE_URL}/catalog` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${BASE_URL}/catalog/${product.id}` },
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(product.imageUrl ? { image: product.imageUrl } : {}),
    description: product.metaDescription || `${product.name} en-gros la ${formatPrice(effectivePrice)} lei/${product.unit}. Distribuitor angro Baia Mare — livrare in Maramures, Satu Mare, Salaj.`,
    sku: product.id,
    brand: { "@type": "Brand", name: "1000&1 Articole" },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/catalog/${product.id}`,
      priceCurrency: "RON",
      price: effectivePrice.toFixed(2),
      priceValidUntil,
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "1000&1 Articole SRL" },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductTracking sku={product.id} name={product.name} price={effectivePrice} category={product.category} />
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Link href="/catalog" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-brand">
          <ArrowLeft size={16} /> Înapoi la catalog
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {product.imageUrl ? (
            <ImageZoom src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="flex h-80 items-center justify-center rounded-xl border border-neutral-200 bg-white text-8xl text-neutral-200">
              {category?.icon ?? "🧊"}
            </div>
          )}

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
            <DeliveryInfo
              minBM={settings[SETTINGS_KEYS.MIN_ORDER_BAIA_MARE]}
              minOther={settings[SETTINGS_KEYS.MIN_ORDER_OTHER]}
              feeBM={settings[SETTINGS_KEYS.SHIPPING_FEE_BAIA_MARE]}
              feeOther={settings[SETTINGS_KEYS.SHIPPING_FEE_OTHER]}
            />
          </div>
        </div>

        <ProductTabs nutritionInfo={product.nutritionInfo} specifications={product.specifications} />
        <SimilarProducts products={similar} />
      </main>
      <Footer />
    </div>
  );
}
