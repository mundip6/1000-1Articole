import { NextResponse } from "next/server";
import { getOrCreateConversation, addMessage, getMessages } from "@/lib/chat";

function getIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

export async function GET(request: Request) {
  const ip = getIP(request);
  const conv = await getOrCreateConversation(ip);
  const messages = await getMessages(conv.id);
  return NextResponse.json({ ok: true, conversationId: conv.id, messages });
}

export async function POST(request: Request) {
  const ip = getIP(request);
  const body = await request.json() as { text?: string };
  const text = body.text?.trim();
  if (!text) return NextResponse.json({ ok: false }, { status: 400 });

  const conv = await getOrCreateConversation(ip);
  const message = await addMessage(conv.id, text, "customer");
  return NextResponse.json({ ok: true, message });
}
