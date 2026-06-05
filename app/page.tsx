import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { getStats, getSports } from "@/lib/queries";

export const revalidate = 3600;

export default async function HomePage() {
  const [stats, sports] = await Promise.all([getStats(), getSports()]);
  const topSports = sports.slice(0, 18);

  return (
    <>
      <section className="bg-gradient-to-b from-white to-slate-50">
        <div className="container-x py-16 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
            Όλα τα αθλητικά σωματεία της Ελλάδας σε ένα μέρος
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            {stats.clubs.toLocaleString("el-GR")} σύλλογοι · {stats.sports} αθλήματα.
            Βρες τον σύλλογό σου και κάνε εγγραφή online ή στείλε αίτημα εγγραφής.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="container-x py-12">
        <h2 className="mb-5 text-xl font-bold text-slate-900">Δημοφιλή αθλήματα</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {topSports.map((s) => (
            <Link
              key={s.id}
              href={`/athlimata/${s.slug}`}
              className="rounded-lg border bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-brand hover:text-brand"
            >
              {s.name}
              <span className="ml-1 text-xs text-slate-400">({s.club_count})</span>
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/athlimata" className="text-sm font-medium text-brand hover:underline">
            Όλα τα αθλήματα →
          </Link>
        </div>
      </section>
    </>
  );
}
