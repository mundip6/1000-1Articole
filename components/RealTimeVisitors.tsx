"use client";

import { useEffect, useState } from "react";

export default function RealTimeVisitors({ initial }: { initial: number }) {
  const [count, setCount] = useState(initial);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/admin/realtime");
        const data = (await res.json()) as { ok: boolean; count: number };
        if (data.ok) {
          setCount(data.count);
          setLastUpdated(new Date());
        }
      } catch {}
    };

    const interval = setInterval(() => void poll(), 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
        </span>
        <span className="text-3xl font-black">{count}</span>
        <span className="text-sm text-neutral-500">vizitatori activi</span>
      </div>
      <span className="text-xs text-neutral-400">
        (ultimele 5 min · actualizat la {lastUpdated.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })})
      </span>
    </div>
  );
}
