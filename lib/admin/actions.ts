"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/guard";
import { slugify } from "@/lib/slugify";

function str(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? null : s;
}

async function uniqueSlug(
  supabase: any,
  table: string,
  base: string,
  excludeId?: number
): Promise<string> {
  let slug = base || "item";
  let n = 2;
  // try a handful of suffixes
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const q = supabase.from(table).select("id").eq("slug", slug).limit(1);
    const { data } = await q;
    const taken = (data ?? []).some((r: { id: number }) => r.id !== excludeId);
    if (!taken) return slug;
    slug = `${base}-${n++}`;
  }
}

/* ---------------- registration requests ---------------- */
export async function updateRequestStatus(fd: FormData) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return;
  const id = Number(fd.get("id"));
  const status = String(fd.get("status") || "new");
  await supabase
    .from("registration_requests")
    .update({ status, handled_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin");
}

/* ---------------- clubs ---------------- */
function clubPayloadFromForm(fd: FormData) {
  return {
    name: str(fd, "name"),
    city: str(fd, "city"),
    region: str(fd, "region"),
    address: str(fd, "address"),
    postal_code: str(fd, "postal_code"),
    phone: str(fd, "phone"),
    email: str(fd, "email"),
    website: str(fd, "website"),
    description: str(fd, "description"),
    logo_url: str(fd, "logo_url"),
    cover_url: str(fd, "cover_url"),
    is_published: fd.get("is_published") === "on",
  };
}

export async function updateClub(fd: FormData) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return;
  const id = Number(fd.get("id"));
  const payload = clubPayloadFromForm(fd);
  if (!payload.name) return;
  await supabase
    .from("clubs")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath(`/admin/clubs/${id}`);
  revalidatePath("/admin/clubs");
  redirect("/admin/clubs?saved=1");
}

export async function createClub(fd: FormData) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return;
  const payload = clubPayloadFromForm(fd);
  if (!payload.name) return;
  const slug = await uniqueSlug(supabase, "clubs", slugify(payload.name));
  const has_myteam = fd.get("has_myteam") === "on";
  const { data } = await supabase
    .from("clubs")
    .insert({ ...payload, slug, has_myteam, sport_slugs: [], enrichment_source: "manual", enrichment_confidence: "high", enriched_at: new Date().toISOString() })
    .select("id")
    .single();
  revalidatePath("/admin/clubs");
  redirect(data?.id ? `/admin/clubs/${data.id}?saved=1` : "/admin/clubs");
}

/* ---------------- sports / activities ---------------- */
export async function upsertSport(fd: FormData) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return;
  const name = str(fd, "name");
  const category_id = fd.get("category_id") ? Number(fd.get("category_id")) : null;
  if (!name) return;
  const id = fd.get("id") ? Number(fd.get("id")) : null;

  if (id) {
    await supabase.from("sports").update({ name, category_id }).eq("id", id);
  } else {
    const slug = await uniqueSlug(supabase, "sports", slugify(name));
    await supabase
      .from("sports")
      .insert({ name, slug, category_id, source: "admin", club_count: 0, is_active: true });
  }
  revalidatePath("/admin/sports");
  revalidatePath("/athlimata");
}

export async function toggleSportActive(fd: FormData) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return;
  const id = Number(fd.get("id"));
  const active = fd.get("active") === "true";
  await supabase.from("sports").update({ is_active: active }).eq("id", id);
  revalidatePath("/admin/sports");
}
