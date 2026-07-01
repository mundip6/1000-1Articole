import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.1000-1-articole.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "1000&1 Articole | Distribuitor engros Baia Mare",
    template: "%s | 1000&1 Articole",
  },
  description: "Distribuitor engros de carne congelata, peste, mezeluri, legume congelate si semi-preparate din Baia Mare. Livrare in Maramures, Satu Mare si Salaj.",
  keywords: ["engros", "carne congelata", "distribuit engros Baia Mare", "peste engros", "legume congelate", "1000 si 1 articole", "1001 articole"],
  authors: [{ name: "1000&1 Articole SRL" }],
  creator: "1000&1 Articole SRL",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: BASE,
    siteName: "1000&1 Articole",
    title: "1000&1 Articole | Distribuitor engros Baia Mare",
    description: "Distribuitor engros de carne congelata, peste, mezeluri, legume congelate si semi-preparate din Baia Mare.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "1000&1 Articole SRL",
    description: "Distribuitor engros de carne congelata, peste, mezeluri, legume congelate si semi-preparate.",
    url: BASE,
    telephone: "+40750266304",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bulevardul Regele Mihai I nr. 49G",
      addressLocality: "Baia Mare",
      addressRegion: "Maramures",
      addressCountry: "RO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 47.6567,
      longitude: 23.5699,
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "17:00" },
    ],
    servesCuisine: "Engros alimentar",
    areaServed: ["Maramures", "Satu Mare", "Salaj"],
  };

  return (
    <html lang="ro" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <ChatWidget />
        <CookieBanner />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
