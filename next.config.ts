import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/catalog/amestec-leg-gradina-2-5kg",
        destination: "/catalog/amestec-legume-gradina-2-5kg",
        permanent: true,
      },
      {
        source: "/catalog/amestec-leg-tigaie-400g-agrosp",
        destination: "/catalog/amestec-legume-tigaie-400g-agrosp",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: __dirname,
  },
  serverExternalPackages: ["xlsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
