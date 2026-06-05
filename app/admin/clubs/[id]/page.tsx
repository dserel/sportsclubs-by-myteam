import Link from "next/link";
import { notFound } from "next/navigation";
import ClubForm from "@/components/admin/ClubForm";
import SportsEditor from "@/components/admin/SportsEditor";
import TeamsEditor from "@/components/admin/TeamsEditor";
import { updateClub } from "@/lib/admin/actions";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Club, Sport, Category, ClubTeam } from "@/lib/types";

export default async function EditClubPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { saved?: string };
}) {
  const supabase = createServerSupabase();
  const [{ data }, { data: sportsData }, { data: catsData }, { data: teamsData }] = await Promise.all([
    supabase.from("clubs").select("*").eq("id", Number(params.id)).maybeSingle(),
    supabase.from("sports").select("*").eq("is_active", true).order("name"),
    supabase.from("categories").select("*").order("id"),
    supabase.from("club_teams").select("*").eq("club_id", Number(params.id)).order("sort_order").order("id"),
  ]);
  if (!data) notFound();
  const club = data as Club;
  const sports = (sportsData as Sport[]) ?? [];
  const categories = (catsData as Category[]) ?? [];
  const teams = (teamsData as ClubTeam[]) ?? [];
  const currentIds = new Set(
    sports.filter((s) => (club.sport_slugs ?? []).includes(s.slug)).map((s) => s.id)
  );

  return (
    <div>
      <nav className="mb-2 text-sm text-slate-500">
        <Link href="/admin/clubs" className="hover:text-brand">Σύλλογοι</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{club.name}</span>
      </nav>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Επεξεργασία συλλόγου</h1>
        <Link href={`/sullogoi/${club.slug}`} className="text-sm text-brand hover:underline" target="_blank">
          Προβολή landing →
        </Link>
      </div>

      {searchParams.saved && (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">Αποθηκεύτηκε.</p>
      )}

      <ClubForm action={updateClub} club={club} />

      <div className="mt-8 max-w-2xl space-y-6">
        <TeamsEditor clubId={club.id} teams={teams} sports={sports} />
        <SportsEditor
          clubId={club.id}
          sports={sports}
          categories={categories}
          currentIds={currentIds}
        />
      </div>
    </div>
  );
}
