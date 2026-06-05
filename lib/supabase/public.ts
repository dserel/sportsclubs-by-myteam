import { createClient } from "@supabase/supabase-js";

/**
 * Anonymous, cookie-less Supabase client for public read-only data.
 * Safe to use in Server Components, generateStaticParams, sitemap, ISR.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
