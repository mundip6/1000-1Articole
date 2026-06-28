import { NextResponse } from "next/server";
import { getOrCreateConversation, addMessage, getMessages } from "@/lib/chat";
import { checkRateLimit, getIP } from "@/lib/rateLimit";

export async function GET(request: Request) {
  const ip = getIP(request);
  const sessionToken = request.headers.get("x-chat-token") || "";
  const conv = await getOrCreateConversation(ip, sessionToken);
  const messages = await getMessages(conv.id);
  return NextResponse.json({ ok: true, conversationId: conv.id, messages });
}

export async function POST(request: Request) {
  const ip = getIP(request);
  const sessionToken = request.headers.get("x-chat-token") || "";

  const { allowed } = await checkRateLimit(`chat:${ip}`, 20, 5 * 60);
  if (!allowed) {
    return NextResponse.json({ ok: false, message: "Prea multe mesaje. Asteapta cateva minute." }, { status: 429 });
  }

  const body = await request.json() as { text?: string };
  const text = body.text?.trim();
  if (!text) return NextResponse.json({ ok: false }, { status: 400 });

  const conv = await getOrCreateConversation(ip, sessionToken);
  const message = await addMessage(conv.id, text, "customer");
  return NextResponse.json({ ok: true, message });
}
