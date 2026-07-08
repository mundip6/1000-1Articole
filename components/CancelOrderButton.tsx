"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function CancelOrderButton({
  orderId,
  action,
  redirectTo,
}: {
  orderId: string;
  action: (formData: FormData) => Promise<void>;
  redirectTo: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border-2 border-red-600 px-5 py-2.5 text-sm font-black text-red-600 hover:bg-red-50"
      >
        <X size={16} /> Anulare comandă
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle size={28} className="text-red-600" />
              </div>
            </div>
            <h3 className="mb-1 text-center text-lg font-black">Anulezi comanda?</h3>
            <p className="mb-6 text-center text-sm text-neutral-500">
              Stocul produselor va fi restaurat automat. Aceasta actiune nu poate fi anulata.
            </p>
            <form action={action} className="flex flex-col gap-3">
              <input type="hidden" name="id" value={orderId} />
              <input type="hidden" name="status" value="Anulata" />
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 font-black text-white hover:bg-red-700"
              >
                <X size={16} /> Confirmă anularea
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Renunță — păstrează comanda
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
