import type { Metadata } from "next";
import Link from "next/link";
import ClubCard from "@/components/ClubCard";
import { listClubsByRegion, PAGE_SIZE } from "@/lib/queries";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { region: string };
}): Promise<Metadata> {
  const region = decodeURIComponent(params.region);
  return {
    title: `Αθλητικά σωματεία — ${region}`,
    description: `Σωματεία και σύλλογοι στην περιοχή ${region}.`,
    alternates: { canonical: `/perioxes/${params.region}` },
  };
}

export default async function RegionPage({
  params,
  searchParams,
}: {
  params: { region: string };
  searchParams: { page?: string };
}) {
  const region = decodeURIComponent(params.region);
  const page = Math.max(0, parseInt(searchParams.page ?? "0", 10) || 0);
  const { clubs, total } = await listClubsByRegion(region, page);
  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container-x py-10">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/perioxes" className="hover:text-brand">Περιοχές</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{region}</span>
      </nav>
      <h1 className="text-3xl font-bold text-slate-900">Σωματεία — {region}</h1>
      <p className="mt-2 text-slate-600">{total.toLocaleString("el-GR")} σύλλογοι</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((c) => (
          <ClubCard key={c.id} club={c} />
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2 text-sm">
          {page > 0 && (
            <Link href={`/perioxes/${params.region}?page=${page - 1}`} className="rounded border px-3 py-1.5 hover:border-brand">
              ← Προηγούμενα
            </Link>
          )}
          <span className="px-2 text-slate-500">Σελίδα {page + 1} / {pages}</span>
          {page + 1 < pages && (
            <Link href={`/perioxes/${params.region}?page=${page + 1}`} className="rounded border px-3 py-1.5 hover:border-brand">
              Επόμενα →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
