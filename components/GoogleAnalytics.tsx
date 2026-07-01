"use client";

import { useEffect } from "react";
import Script from "next/script";

const GA_ID = "G-MLX3KMT88X";

export default function GoogleAnalytics() {
  useEffect(() => {
    const grant = () => {
      (window as any).gtag?.("consent", "update", { analytics_storage: "granted" });
    };

    if (localStorage.getItem("cookie-consent")) {
      grant();
    } else {
      window.addEventListener("cookie-consent-given", grant);
      return () => window.removeEventListener("cookie-consent-given", grant);
    }
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', { analytics_storage: 'denied' });
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
