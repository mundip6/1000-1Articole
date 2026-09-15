"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  /** Render without card chrome — for content that brings its own cards. */
  bare?: boolean;
  /** Set false for full-bleed content like tables that pad their own cells. */
  padded?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
};

export default function CollapsibleSection({
  title,
  subtitle,
  bare = false,
  padded = true,
  defaultOpen = true,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const header = (
    <button
      onClick={() => setOpen((v) => !v)}
      className={`flex w-full items-center gap-2 text-left ${bare ? "py-2" : "px-5 py-4"} hover:opacity-70`}
    >
      <ChevronDown
        size={16}
        className={`shrink-0 text-neutral-400 transition-transform ${open ? "" : "-rotate-90"}`}
      />
      <span className="text-sm font-black uppercase tracking-wide text-neutral-500">{title}</span>
      {subtitle && <span className="text-xs text-neutral-400">{subtitle}</span>}
    </button>
  );

  if (bare) {
    return (
      <section>
        {header}
        {open && <div className="mt-2">{children}</div>}
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-neutral-200 bg-white">
      {header}
      {open && (
        <div className={`border-t border-neutral-100 ${padded ? "p-5" : ""}`}>{children}</div>
      )}
    </section>
  );
}
