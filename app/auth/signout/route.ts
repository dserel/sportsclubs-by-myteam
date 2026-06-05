import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const sb = createServerSupabase();
  await sb.auth.signOut();
  return NextResponse.redirect(new URL("/login", req.url), { status: 303 });
}
