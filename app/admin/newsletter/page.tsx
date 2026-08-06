import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import AdminShell from "@/components/AdminShell";
import { prisma } from "@/lib/prisma";
import NewsletterSend from "./NewsletterSend";
import { CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  const [subscribers, customers] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.customer.findMany({ select: { email: true } }),
  ]);

  const customerEmails = new Set(customers.map((c) => c.email));

  return (
    <AdminShell
      title="Newsletter"
      description="Trimite emailuri cu oferte si promotii catre abonati."
      active="newsletter"
    >
      <div className="space-y-6">
        <NewsletterSend count={subscribers.length} />

        <section className="rounded-lg border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 px-5 py-4">
            <h2 className="text-sm font-black uppercase tracking-wide text-neutral-500">Abonati newsletter</h2>
            <p className="mt-0.5 text-xs text-neutral-400">{subscribers.length} abonati</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-100 text-left text-xs font-black uppercase tracking-wide text-neutral-400">
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3 text-center">Are cont</th>
                  <th className="px-5 py-3 text-right">Abonat de la</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                    <td className="px-5 py-3 font-semibold">{s.email}</td>
                    <td className="px-5 py-3 text-center">
                      {customerEmails.has(s.email)
                        ? <CheckCircle size={16} className="mx-auto text-green-600" />
                        : <span className="text-neutral-300">—</span>}
                    </td>
                    <td className="px-5 py-3 text-right text-neutral-400">
                      {new Date(s.createdAt).toLocaleDateString("ro-RO")}
                    </td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-5 py-10 text-center text-neutral-400">
                      Nu exista abonati inca. Formularul apare in footer-ul site-ului.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
