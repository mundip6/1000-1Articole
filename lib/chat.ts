import { prisma } from "@/lib/prisma";

export type ChatMsg = {
  id: string;
  text: string;
  sender: string;
  createdAt: Date;
};

export async function getOrCreateConversation(ip: string, sessionToken: string) {
  if (sessionToken) {
    const existing = await prisma.conversation.findFirst({
      where: { sessionToken, status: "open" },
    });
    if (existing) return existing;
  }
  return prisma.conversation.create({ data: { ip, sessionToken } });
}

export async function addMessage(conversationId: string, text: string, sender: "customer" | "admin") {
  const [message] = await prisma.$transaction([
    prisma.chatMessage.create({ data: { conversationId, text, sender } }),
    prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } }),
  ]);
  return message;
}

export async function getMessages(conversationId: string) {
  return prisma.chatMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}

export async function listConversations() {
  return prisma.conversation.findMany({
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
}
