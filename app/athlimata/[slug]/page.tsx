import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ClubCard from "@/components/ClubCard";
import { getSportBySlug, getSports, listClubsBySport, PAGE_SIZE } from "@/lib/queries";

export const revalidate = 86400;

export async function generateStaticParams() {
  const sports = await getSports();
  return sports.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const sport = await getSportBySlug(params.slug);
  if (!sport) return {};
  return {
    title: `Σωματεία ${sport.name} στην Ελλάδα`,
    description: `Όλα τα αθλητικά σωματεία ${sport.name} στην Ελλάδα — ${sport.club_count} σύλλογοι. Βρες σύλλογο και κάνε εγγραφή.`,
    alternates: { canonical: `/athlimata/${sport.slug}` },
  };
}

export default async function SportPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const sport = await getSportBySlug(params.slug);
  if (!sport) notFound();

  const page = Math.max(0, parseInt(searchParams.page ?? "0", 10) || 0);
  const { clubs, total } = await listClubsBySport(sport.slug, page);
  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container-x py-10">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/athlimata" className="hover:text-brand">Αθλήματα</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{sport.name}</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900">Σωματεία {sport.name}</h1>
      <p className="mt-2 text-slate-600">{total.toLocaleString("el-GR")} σύλλογοι στην Ελλάδα</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((c) => (
          <ClubCard key={c.id} club={c} />
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2 text-sm">
          {page > 0 && (
            <Link href={`/athlimata/${sport.slug}?page=${page - 1}`} className="rounded border px-3 py-1.5 hover:border-brand">
              ← Προηγούμενα
            </Link>
          )}
          <span className="px-2 text-slate-500">Σελίδα {page + 1} / {pages}</span>
          {page + 1 < pages && (
            <Link href={`/athlimata/${sport.slug}?page=${page + 1}`} className="rounded border px-3 py-1.5 hover:border-brand">
              Επόμενα →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
