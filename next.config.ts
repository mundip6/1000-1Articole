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
  async headers() {
    // Report-only for now: it logs violations to the browser console without
    // blocking anything, so a missing allowlist entry cannot silently kill
    // Google Analytics, the Meta Pixel or the Maps embed. Promote to
    // "Content-Security-Policy" once the console is clean.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://*.google-analytics.com https://www.googletagmanager.com https://*.facebook.com https://maps.gstatic.com https://*.googleapis.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.facebook.com",
      "frame-src https://maps.google.com https://www.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Content-Security-Policy-Report-Only", value: csp },
        ],
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
