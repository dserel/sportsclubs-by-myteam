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

function num(fd: FormData, key: string): number | null {
  const s = str(fd, key);
  if (s == null) return null;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? Math.round(n) : null;
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
    myteam_slug: str(fd, "myteam_slug"),
    has_myteam: fd.get("has_myteam") === "on",
    is_published: fd.get("is_published") === "on",
    contact_name: str(fd, "contact_name"),
    contact_role: str(fd, "contact_role"),
    club_type: str(fd, "club_type"),
    registration_url: str(fd, "registration_url"),
    registration_opens_at: str(fd, "registration_opens_at"),
    annual_fee_min: num(fd, "annual_fee_min"),
    annual_fee_max: num(fd, "annual_fee_max"),
    socials: buildSocials(fd),
  };
}

function buildSocials(fd: FormData): Record<string, string> | null {
  const fb = str(fd, "facebook");
  const ig = str(fd, "instagram");
  const out: Record<string, string> = {};
  if (fb) out.facebook = fb;
  if (ig) out.instagram = ig;
  return Object.keys(out).length ? out : null;
}

export async function updateClub(fd: FormData) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return;
  const id = Number(fd.get("id"));
  const payload = clubPayloadFromForm(fd);
  if (!payload.name) return;
  const { data } = await supabase
    .from("clubs")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("slug")
    .single();
  revalidatePath(`/admin/clubs/${id}`);
  revalidatePath("/admin/clubs");
  if (data?.slug) revalidatePath(`/sullogoi/${data.slug}`); // φρεσκάρει τη δημόσια σελίδα
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
  revalidatePath(`/sullogoi/${slug}`);
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

/* ---------------- club <-> sports ---------------- */
export async function updateClubSports(fd: FormData) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return;
  const clubId = Number(fd.get("club_id"));
  const sportIds = fd
    .getAll("sport_ids")
    .map((v) => Number(v))
    .filter((n) => !Number.isNaN(n));

  // resolve slugs for the selected sports (denormalized array on clubs)
  const { data: rows } = await supabase
    .from("sports")
    .select("id, slug")
    .in("id", sportIds.length ? sportIds : [-1]);
  const slugs = (rows ?? []).map((r: { slug: string }) => r.slug);

  await supabase
    .from("clubs")
    .update({ sport_slugs: slugs, updated_at: new Date().toISOString() })
    .eq("id", clubId);

  // keep the normalized join table in sync
  await supabase.from("club_sports").delete().eq("club_id", clubId);
  if (sportIds.length) {
    await supabase
      .from("club_sports")
      .insert(sportIds.map((sid) => ({ club_id: clubId, sport_id: sid })));
  }

  const { data: club } = await supabase.from("clubs").select("slug").eq("id", clubId).single();
  revalidatePath(`/admin/clubs/${clubId}`);
  if (club?.slug) revalidatePath(`/sullogoi/${club.slug}`);
}

/* ---------------- club teams ---------------- */
async function revalidateClub(supabase: any, clubId: number) {
  const { data } = await supabase.from("clubs").select("slug").eq("id", clubId).single();
  revalidatePath(`/admin/clubs/${clubId}`);
  if (data?.slug) revalidatePath(`/sullogoi/${data.slug}`);
}

export async function addClubTeam(fd: FormData) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return;
  const clubId = Number(fd.get("club_id"));
  const name = str(fd, "name");
  if (!clubId || !name) return;
  await supabase.from("club_teams").insert({
    club_id: clubId,
    name,
    gender: str(fd, "gender"),
    age_group: str(fd, "age_group"),
    sport_id: fd.get("sport_id") ? Number(fd.get("sport_id")) : null,
    registration_opens_at: str(fd, "registration_opens_at"),
    registration_url: str(fd, "registration_url"),
    notes: str(fd, "notes"),
  });
  await revalidateClub(supabase, clubId);
}

export async function deleteClubTeam(fd: FormData) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return;
  const id = Number(fd.get("id"));
  const clubId = Number(fd.get("club_id"));
  await supabase.from("club_teams").delete().eq("id", id);
  await revalidateClub(supabase, clubId);
}

export async function toggleSportActive(fd: FormData) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return;
  const id = Number(fd.get("id"));
  const active = fd.get("active") === "true";
  await supabase.from("sports").update({ is_active: active }).eq("id", id);
  revalidatePath("/admin/sports");
}
