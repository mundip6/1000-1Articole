"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const GA_ID = "G-MLX3KMT88X";

export default function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("cookie-consent")) {
      setHasConsent(true);
      return;
    }
    const handler = () => setHasConsent(true);
    window.addEventListener("cookie-consent-given", handler);
    return () => window.removeEventListener("cookie-consent-given", handler);
  }, []);

  if (!hasConsent) return null;

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
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
