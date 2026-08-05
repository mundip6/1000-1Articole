import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import type { MetaEventData, MetaEventName, MetaUserData } from "@/lib/meta/types";

const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const TOKEN = process.env.FB_CAPI_ACCESS_TOKEN;
const TEST_CODE = process.env.FB_TEST_EVENT_CODE;
const API_VERSION = "v21.0";

function hash(value?: string): string | undefined {
  if (!value) return undefined;
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function hashPhone(phone?: string): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "40" + digits.slice(1);
  return createHash("sha256").update(digits).digest("hex");
}

interface CapiBody {
  eventName: MetaEventName;
  eventId: string;
  eventSourceUrl: string;
  customData?: MetaEventData;
  userData?: MetaUserData;
}

export async function POST(req: NextRequest) {
  if (!PIXEL_ID || !TOKEN) {
    return NextResponse.json({ error: "Meta not configured" }, { status: 500 });
  }

  const body = (await req.json()) as CapiBody;
  const { eventName, eventId, eventSourceUrl, customData, userData } = body;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl,
        action_source: "website",
        user_data: {
          em: hash(userData?.email),
          ph: hashPhone(userData?.phone),
          fn: hash(userData?.firstName),
          ln: hash(userData?.lastName),
          ct: hash(userData?.city),
          country: hash(userData?.country ?? "ro"),
          client_ip_address: ip,
          client_user_agent: req.headers.get("user-agent") ?? undefined,
          fbc: req.cookies.get("_fbc")?.value,
          fbp: req.cookies.get("_fbp")?.value,
        },
        custom_data: customData,
      },
    ],
    ...(TEST_CODE ? { test_event_code: TEST_CODE } : {}),
  };

  const res = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Meta CAPI error:", err);
    return NextResponse.json({ error: "CAPI failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
