import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.1000-1-articole.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/packer", "/cos", "/cont", "/api/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
