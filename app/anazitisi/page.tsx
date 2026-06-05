import type { Metadata } from "next";
import Link from "next/link";
import SearchFilters from "@/components/SearchFilters";
import ClubCard from "@/components/ClubCard";
import {
  searchClubsFiltered,
  getSports,
  listRegions,
  getAgeGroups,
  PAGE_SIZE,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Αναζήτηση συλλόγου",
  description: "Βρες αθλητικά σωματεία ανά άθλημα, περιοχή, τύπο και ηλικιακή κατηγορία.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; sport?: string; region?: string; type?: string; age?: string; page?: string };
}) {
  const current = {
    q: searchParams.q ?? "",
    sport: searchParams.sport ?? "",
    region: searchParams.region ?? "",
    type: searchParams.type ?? "",
    age: searchParams.age ?? "",
  };
  const page = Math.max(0, parseInt(searchParams.page ?? "0", 10) || 0);

  const [{ clubs, total }, sports, regions, ages] = await Promise.all([
    searchClubsFiltered({ ...current, page }),
    getSports(),
    listRegions(),
    getAgeGroups(),
  ]);
  const pages = Math.ceil(total / PAGE_SIZE);

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (current.q) params.set("q", current.q);
    if (current.sport) params.set("sport", current.sport);
    if (current.region) params.set("region", current.region);
    if (current.type) params.set("type", current.type);
    if (current.age) params.set("age", current.age);
    params.set("page", String(p));
    return `/anazitisi?${params.toString()}`;
  }

  return (
    <div className="container-x py-8">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Αναζήτηση συλλόγων</h1>

      <SearchFilters
        current={current}
        sports={sports.map((s) => ({ value: s.slug, label: s.name }))}
        regions={regions}
        ages={ages}
      />

      <p className="mt-5 text-sm text-slate-500">{total.toLocaleString("el-GR")} αποτελέσματα</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((c) => (
          <ClubCard key={c.id} club={c} />
        ))}
      </div>

      {clubs.length === 0 && (
        <p className="mt-10 text-center text-slate-400">
          Κανένα αποτέλεσμα — δοκίμασε λιγότερα φίλτρα.
        </p>
      )}

      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2 text-sm">
          {page > 0 && (
            <Link href={pageHref(page - 1)} className="rounded border px-3 py-1.5 hover:border-brand">
              ← Προηγούμενα
            </Link>
          )}
          <span className="px-2 text-slate-500">Σελίδα {page + 1} / {pages}</span>
          {page + 1 < pages && (
            <Link href={pageHref(page + 1)} className="rounded border px-3 py-1.5 hover:border-brand">
              Επόμενα →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
