import { prisma } from "@/lib/prisma";

export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; retryAfter: number }> {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + windowSeconds * 1000);

  const existing = await prisma.rateLimit.findUnique({ where: { key } });

  if (!existing || existing.resetAt <= now) {
    await prisma.rateLimit.upsert({
      where: { key },
      update: { count: 1, resetAt: windowEnd },
      create: { key, count: 1, resetAt: windowEnd },
    });
    return { allowed: true, retryAfter: 0 };
  }

  if (existing.count >= maxRequests) {
    return {
      allowed: false,
      retryAfter: Math.ceil((existing.resetAt.getTime() - now.getTime()) / 1000),
    };
  }

  await prisma.rateLimit.update({ where: { key }, data: { count: { increment: 1 } } });
  return { allowed: true, retryAfter: 0 };
}

export function getIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
