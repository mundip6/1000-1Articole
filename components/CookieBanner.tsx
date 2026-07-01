"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white px-4 py-4 shadow-lg sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-600">
          Acest site foloseste cookie-uri strict necesare pentru functionarea cosului de cumparaturi si autentificarii.{" "}
          <Link href="/politica-confidentialitate" className="font-semibold text-brand underline underline-offset-2">
            Politica de confidentialitate
          </Link>
        </p>
        <button
          onClick={accept}
          className="shrink-0 rounded-lg bg-brand px-5 py-2 text-sm font-black text-white hover:bg-red-700"
        >
          Am inteles
        </button>
      </div>
    </div>
  );
}
