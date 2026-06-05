import { createPublicClient } from "@/lib/supabase/public";
import type { Club, Sport, Category, MyteamClub } from "@/lib/types";

const PAGE_SIZE = 24;

export async function getSports(): Promise<Sport[]> {
  const sb = createPublicClient();
  const { data } = await sb
    .from("sports")
    .select("*")
    .eq("is_active", true)
    .order("club_count", { ascending: false });
  return data ?? [];
}

export async function getCategories(): Promise<Category[]> {
  const sb = createPublicClient();
  const { data } = await sb.from("categories").select("*").order("id");
  return data ?? [];
}

export async function getSportsBySlugs(
  slugs: string[]
): Promise<{ name: string; slug: string }[]> {
  if (!slugs || slugs.length === 0) return [];
  const sb = createPublicClient();
  const { data } = await sb.from("sports").select("name, slug").in("slug", slugs);
  const map = new Map((data ?? []).map((s: { name: string; slug: string }) => [s.slug, s.name]));
  // preserve original order, fall back to slug if missing
  return slugs.map((slug) => ({ slug, name: map.get(slug) ?? slug }));
}

export async function getSportBySlug(slug: string): Promise<Sport | null> {
  const sb = createPublicClient();
  const { data } = await sb.from("sports").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function getClubBySlug(
  slug: string
): Promise<{ club: Club; myteam: MyteamClub | null } | null> {
  const sb = createPublicClient();
  const { data: club } = await sb
    .from("clubs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!club) return null;

  let myteam: MyteamClub | null = null;
  if (club.myteam_club_id) {
    const { data } = await sb
      .from("myteam_clubs")
      .select("*")
      .eq("id", club.myteam_club_id)
      .maybeSingle();
    myteam = data;
  }
  return { club: club as Club, myteam };
}

export async function listClubsBySport(
  sportSlug: string,
  page = 0
): Promise<{ clubs: Club[]; total: number }> {
  const sb = createPublicClient();
  const from = page * PAGE_SIZE;
  const { data, count } = await sb
    .from("clubs")
    .select("*", { count: "exact" })
    .contains("sport_slugs", [sportSlug])
    .eq("is_published", true)
    .order("has_myteam", { ascending: false })
    .order("name")
    .range(from, from + PAGE_SIZE - 1);
  return { clubs: (data as Club[]) ?? [], total: count ?? 0 };
}

export async function searchClubs(
  q: string,
  page = 0
): Promise<{ clubs: Club[]; total: number }> {
  const sb = createPublicClient();
  const from = page * PAGE_SIZE;
  let query = sb
    .from("clubs")
    .select("*", { count: "exact" })
    .eq("is_published", true);

  if (q && q.trim()) {
    query = query.ilike("name", `%${q.trim()}%`);
  }
  const { data, count } = await query
    .order("has_myteam", { ascending: false })
    .order("name")
    .range(from, from + PAGE_SIZE - 1);
  return { clubs: (data as Club[]) ?? [], total: count ?? 0 };
}

export async function listRegions(): Promise<string[]> {
  const sb = createPublicClient();
  const { data } = await sb
    .from("clubs")
    .select("region")
    .not("region", "is", null)
    .limit(10000);
  const set = new Set<string>();
  (data ?? []).forEach((r: { region: string | null }) => {
    if (r.region) set.add(r.region);
  });
  return Array.from(set).sort();
}

export async function listClubsByRegion(
  region: string,
  page = 0
): Promise<{ clubs: Club[]; total: number }> {
  const sb = createPublicClient();
  const from = page * PAGE_SIZE;
  const { data, count } = await sb
    .from("clubs")
    .select("*", { count: "exact" })
    .ilike("region", region)
    .eq("is_published", true)
    .order("has_myteam", { ascending: false })
    .order("name")
    .range(from, from + PAGE_SIZE - 1);
  return { clubs: (data as Club[]) ?? [], total: count ?? 0 };
}

export async function getStats(): Promise<{ clubs: number; sports: number; myteam: number }> {
  const sb = createPublicClient();
  const [{ count: clubs }, { count: myteam }, sports] = await Promise.all([
    sb.from("clubs").select("id", { count: "exact", head: true }),
    sb.from("clubs").select("id", { count: "exact", head: true }).eq("has_myteam", true),
    getSports(),
  ]);
  return { clubs: clubs ?? 0, myteam: myteam ?? 0, sports: sports.length };
}

/** All published club slugs — for sitemap & static generation. */
export async function getAllClubSlugs(): Promise<{ slug: string }[]> {
  const sb = createPublicClient();
  const out: { slug: string }[] = [];
  const step = 1000;
  for (let from = 0; ; from += step) {
    const { data } = await sb
      .from("clubs")
      .select("slug")
      .eq("is_published", true)
      .range(from, from + step - 1);
    if (!data || data.length === 0) break;
    out.push(...(data as { slug: string }[]));
    if (data.length < step) break;
  }
  return out;
}

export { PAGE_SIZE };
