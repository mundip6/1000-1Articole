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
  async rewrites() {
    return [
      // RFC 9116 canonical location — served by app/security.txt/route.ts
      { source: "/.well-known/security.txt", destination: "/security.txt" },
      // Some crawlers probe the singular name for the llms.txt standard
      { source: "/llm.txt", destination: "/llms.txt" },
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
