"use client";

import { useRef, useState } from "react";

export default function ImageZoom({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={onMove}
      className="overflow-hidden rounded-xl border border-neutral-200 bg-white cursor-zoom-in"
    >
      <img
        src={src}
        alt={alt}
        className="h-full max-h-[480px] w-full object-contain p-4 select-none"
        style={{
          transform: active ? "scale(2.5)" : "scale(1)",
          transformOrigin: `${pos.x}% ${pos.y}%`,
          transition: active
            ? "transform 0.05s ease-out"
            : "transform 0.2s ease-out",
        }}
        draggable={false}
      />
    </div>
  );
}
