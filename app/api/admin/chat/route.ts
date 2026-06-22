import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { listConversations } from "@/lib/chat";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const conversations = await listConversations();
  return NextResponse.json({ ok: true, conversations });
}
