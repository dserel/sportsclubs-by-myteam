import { createPublicClient } from "@/lib/supabase/public";
import type { Club, Sport, Category, ClubTeam, ClubAchievement, ClubPhoto } from "@/lib/types";

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

export async function getClubTeams(clubId: number): Promise<ClubTeam[]> {
  const sb = createPublicClient();
  const { data } = await sb
    .from("club_teams")
    .select("*")
    .eq("club_id", clubId)
    .order("sort_order")
    .order("id");
  return (data as ClubTeam[]) ?? [];
}

export async function getClubAchievements(clubId: number): Promise<ClubAchievement[]> {
  const sb = createPublicClient();
  const { data } = await sb
    .from("club_achievements")
    .select("*")
    .eq("club_id", clubId)
    .order("year", { ascending: false, nullsFirst: false })
    .order("sort_order");
  return (data as ClubAchievement[]) ?? [];
}

export async function getClubPhotos(clubId: number): Promise<ClubPhoto[]> {
  const sb = createPublicClient();
  const { data } = await sb
    .from("club_photos")
    .select("*")
    .eq("club_id", clubId)
    .order("sort_order")
    .order("id");
  return (data as ClubPhoto[]) ?? [];
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

export async function getClubBySlug(slug: string): Promise<Club | null> {
  const sb = createPublicClient();
  const { data: club } = await sb
    .from("clubs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return (club as Club) ?? null;
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

export type ClubFilters = {
  q?: string;
  sport?: string;
  region?: string;
  type?: string;
  age?: string;
  page?: number;
};

export async function getAgeGroups(): Promise<string[]> {
  const sb = createPublicClient();
  const { data } = await sb.from("club_teams").select("age_group").not("age_group", "is", null).limit(5000);
  const set = new Set<string>();
  (data ?? []).forEach((r: { age_group: string | null }) => r.age_group && set.add(r.age_group));
  return Array.from(set).sort();
}

export async function searchClubsFiltered(
  f: ClubFilters
): Promise<{ clubs: Club[]; total: number }> {
  const sb = createPublicClient();
  const page = Math.max(0, f.page ?? 0);
  const from = page * PAGE_SIZE;

  // age filter resolves to a set of club ids via club_teams
  let ageClubIds: number[] | null = null;
  if (f.age) {
    const { data } = await sb.from("club_teams").select("club_id").eq("age_group", f.age).limit(10000);
    ageClubIds = Array.from(new Set((data ?? []).map((r: { club_id: number }) => r.club_id)));
    if (ageClubIds.length === 0) return { clubs: [], total: 0 };
  }

  let query = sb.from("clubs").select("*", { count: "exact" }).eq("is_published", true);
  if (f.q && f.q.trim()) query = query.ilike("name", `%${f.q.trim()}%`);
  if (f.sport) query = query.contains("sport_slugs", [f.sport]);
  if (f.region) query = query.eq("region", f.region);
  if (f.type) query = query.eq("club_type", f.type);
  if (ageClubIds) query = query.in("id", ageClubIds);

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
