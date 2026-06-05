import Link from "next/link";
import { notFound } from "next/navigation";
import ClubForm from "@/components/admin/ClubForm";
import { updateClub } from "@/lib/admin/actions";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Club } from "@/lib/types";

export default async function EditClubPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { saved?: string };
}) {
  const supabase = createServerSupabase();
  const { data } = await supabase.from("clubs").select("*").eq("id", Number(params.id)).maybeSingle();
  if (!data) notFound();
  const club = data as Club;

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

      {club.sport_slugs?.length > 0 && (
        <p className="mt-3 text-xs text-slate-400">Αθλήματα: {club.sport_slugs.join(", ")}</p>
      )}

      <ClubForm action={updateClub} club={club} />
    </div>
  );
}
