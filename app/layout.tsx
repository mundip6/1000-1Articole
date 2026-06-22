import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "1000&1 Articole | Magazin engros",
  description: "Distribuitor engros de carne, peste, mezeluri, legume congelate si semi-preparate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
