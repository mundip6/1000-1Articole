"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/packer")) return;

    const utmSource = searchParams.get("utm_source") ?? "";
    const referrer = typeof document !== "undefined" ? document.referrer : "";

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ utmSource, referrer, page: pathname }),
    }).catch(() => {});
  }, [pathname, searchParams]);

  return null;
}
