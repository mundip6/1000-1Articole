import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { listProducts } from "@/lib/products";
import CatalogClient from "./CatalogClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalog en-gros — carne, peste, legume congelate",
  description: "Cumpara en-gros carne congelata de pui si porc, peste, mezeluri, legume congelate si semi-preparate. Livrare in Maramures, Satu Mare si Salaj.",
  alternates: { canonical: "/catalog" },
};

export default async function CatalogPage() {
  const products = await listProducts();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Suspense>
        <CatalogClient products={products} />
      </Suspense>
      <Footer />
    </div>
  );
}
