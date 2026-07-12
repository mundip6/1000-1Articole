"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/packer")) return;
    if (sessionStorage.getItem("sv")) return; // already tracked this session

    sessionStorage.setItem("sv", "1");

    const utmSource = searchParams.get("utm_source") ?? "";
    const referrer = document.referrer;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ utmSource, referrer, page: pathname }),
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fires once on mount — intentional, sessionStorage prevents double-counting

  return null;
}
