import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Μη έγκυρο αίτημα" }, { status: 400 });
  }

  const full_name = String(body.full_name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim() || null;
  const message = String(body.message || "").trim() || null;
  const club_id =
    body.club_id != null && !Number.isNaN(Number(body.club_id)) ? Number(body.club_id) : null;
  const sport_id =
    body.sport_id != null && !Number.isNaN(Number(body.sport_id)) ? Number(body.sport_id) : null;

  if (full_name.length < 2) return NextResponse.json({ error: "Συμπλήρωσε όνομα" }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Μη έγκυρο email" }, { status: 400 });

  const sb = createPublicClient();
  const { error } = await sb.from("registration_requests").insert({
    club_id,
    sport_id,
    full_name,
    email,
    phone,
    message,
    source: "web",
  });

  if (error) {
    return NextResponse.json({ error: "Αποτυχία αποθήκευσης" }, { status: 500 });
  }

  // TODO: forward by email via Supabase Edge Function (Resend/SMTP).
  // await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/forward-request`, { ... })

  return NextResponse.json({ ok: true });
}
