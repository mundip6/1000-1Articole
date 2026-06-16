import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { listProducts } from "@/lib/products";
import CatalogClient from "./CatalogClient";

export const dynamic = "force-dynamic";

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
