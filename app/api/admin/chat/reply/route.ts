import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { addMessage, getMessages } from "@/lib/chat";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  const messages = await getMessages(id);
  return NextResponse.json({ ok: true, messages });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = await request.json() as { conversationId?: string; text?: string };
  const { conversationId, text } = body;
  if (!conversationId || !text?.trim()) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const message = await addMessage(conversationId, text.trim(), "admin");
  return NextResponse.json({ ok: true, message });
}
