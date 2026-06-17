import { type NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file || !file.type.startsWith("image/")) {
    return Response.json({ error: "Fisier invalid" }, { status: 400 });
  }

  const blob = await put(`products/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return Response.json({ url: blob.url });
}
