import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import ClubCard from "@/components/ClubCard";
import Link from "next/link";
import { searchClubs, PAGE_SIZE } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Αναζήτηση συλλόγου",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const q = searchParams.q ?? "";
  const page = Math.max(0, parseInt(searchParams.page ?? "0", 10) || 0);
  const { clubs, total } = await searchClubs(q, page);
  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container-x py-10">
      <div className="mx-auto max-w-2xl">
        <SearchBar defaultValue={q} />
      </div>

      <p className="mt-6 text-sm text-slate-500">
        {q ? <>Αποτελέσματα για «{q}»: </> : "Όλοι οι σύλλογοι: "}
        {total.toLocaleString("el-GR")}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((c) => (
          <ClubCard key={c.id} club={c} />
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2 text-sm">
          {page > 0 && (
            <Link href={`/anazitisi?q=${encodeURIComponent(q)}&page=${page - 1}`} className="rounded border px-3 py-1.5 hover:border-brand">
              ← Προηγούμενα
            </Link>
          )}
          <span className="px-2 text-slate-500">Σελίδα {page + 1} / {pages}</span>
          {page + 1 < pages && (
            <Link href={`/anazitisi?q=${encodeURIComponent(q)}&page=${page + 1}`} className="rounded border px-3 py-1.5 hover:border-brand">
              Επόμενα →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
