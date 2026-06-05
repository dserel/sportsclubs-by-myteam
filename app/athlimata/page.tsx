import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getSports } from "@/lib/queries";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Όλα τα αθλήματα",
  description: "Δες όλα τα αθλήματα και βρες σωματεία ανά άθλημα σε όλη την Ελλάδα.",
  alternates: { canonical: "/athlimata" },
};

export default async function SportsIndex() {
  const [categories, sports] = await Promise.all([getCategories(), getSports()]);
  const byCat = new Map<number, typeof sports>();
  for (const s of sports) {
    if (s.category_id == null) continue;
    if (!byCat.has(s.category_id)) byCat.set(s.category_id, []);
    byCat.get(s.category_id)!.push(s);
  }

  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-bold text-slate-900">Αθλήματα</h1>
      <p className="mt-2 text-slate-600">Επίλεξε άθλημα για να δεις τα σωματεία.</p>

      <div className="mt-8 space-y-8">
        {categories.map((cat) => {
          const list = (byCat.get(cat.id) ?? []).sort((a, b) => b.club_count - a.club_count);
          if (list.length === 0) return null;
          return (
            <div key={cat.id}>
              <h2 className="mb-3 text-lg font-semibold text-slate-800">{cat.name}</h2>
              <div className="flex flex-wrap gap-2">
                {list.map((s) => (
                  <Link
                    key={s.id}
                    href={`/athlimata/${s.slug}`}
                    className="rounded-full border bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:border-brand hover:text-brand"
                  >
                    {s.name} <span className="text-xs text-slate-400">({s.club_count})</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
