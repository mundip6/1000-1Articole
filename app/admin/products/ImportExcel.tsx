"use client";

import { useRef, useState } from "react";
import { FileSpreadsheet } from "lucide-react";

type Result = { imported: number; skipped: number };

export default function ImportExcel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setResult(null);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/import-excel", { method: "POST", body: formData });
      const data = (await res.json()) as { ok: boolean; imported?: number; skipped?: number; message?: string };
      if (data.ok) {
        setResult({ imported: data.imported ?? 0, skipped: data.skipped ?? 0 });
        window.location.reload();
      } else {
        setError(data.message || "Eroare la import.");
      }
    } catch {
      setError("Eroare de retea.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFile} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded border border-brand px-4 py-2 text-sm font-black text-brand hover:bg-red-50 disabled:opacity-50"
      >
        <FileSpreadsheet size={16} />
        {loading ? "Se importa..." : "Import Excel"}
      </button>
      {result && (
        <span className="text-sm font-semibold text-green-700">
          ✓ {result.imported} produse importate, {result.skipped} sarite
        </span>
      )}
      {error && <span className="text-sm font-semibold text-red-600">{error}</span>}
    </div>
  );
}
