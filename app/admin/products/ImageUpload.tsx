"use client";

import { useRef, useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";

export default function ImageUpload({ currentUrl }: { currentUrl?: string }) {
  const [url, setUrl] = useState(currentUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUrl(data.url);
    } catch {
      setError("Eroare la upload. Incearca din nou.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name="imageUrl" value={url} />
      <div
        role="button"
        tabIndex={0}
        aria-label="Incarca imagine produs"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        className="relative flex h-28 w-28 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-neutral-200 bg-neutral-50 hover:border-brand"
      >
        {url ? (
          <img src={url} alt="Produs" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-neutral-400">
            <ImageIcon size={22} />
            <span className="text-xs">Foto produs</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          </div>
        )}
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1 rounded border border-neutral-200 px-2 py-1 text-xs font-semibold hover:border-brand disabled:opacity-50"
        >
          <Upload size={11} /> {url ? "Schimba" : "Incarca"}
        </button>
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="inline-flex items-center gap-1 rounded border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            <X size={11} /> Sterge
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
