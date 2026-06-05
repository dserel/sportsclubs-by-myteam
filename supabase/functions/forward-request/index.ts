// Supabase Edge Function: forward a registration request by email.
// Deploy: supabase functions deploy forward-request
// Set secrets: RESEND_API_KEY, FORWARD_TO_EMAIL
//
// Trigger options:
//  (a) Call it from the Next.js API route after insert, or
//  (b) Add a Postgres trigger / Database Webhook on registration_requests INSERT.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  try {
    const payload = await req.json();
    const r = payload.record ?? payload; // supports DB webhook { record } or direct body

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const TO = Deno.env.get("FORWARD_TO_EMAIL") ?? "info@example.gr";
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ skipped: "no RESEND_API_KEY" }), { status: 200 });
    }

    const html = `
      <h2>Νέο αίτημα εγγραφής</h2>
      <p><b>Όνομα:</b> ${r.full_name ?? ""}</p>
      <p><b>Email:</b> ${r.email ?? ""}</p>
      <p><b>Τηλέφωνο:</b> ${r.phone ?? "-"}</p>
      <p><b>Σύλλογος (club_id):</b> ${r.club_id ?? "-"}</p>
      <p><b>Μήνυμα:</b> ${r.message ?? "-"}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Clubs Directory <onboarding@resend.dev>",
        to: [TO],
        subject: "Νέο αίτημα εγγραφής συλλόγου",
        html,
      }),
    });

    return new Response(await res.text(), { status: res.status });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
