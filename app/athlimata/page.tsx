import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getSports } from "@/lib/queries";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Όλα τα αθλήματα",
  description: "Δες όλα τα αθλήματα και βρες σωματεία ανά άθλημα σε όλη την Ελλάδα.",
  alternates: { canonical: "/athlimata" },
};

const CAT_EMOJI: Record<string, string> = {
  team: "⚽", combat: "🥋", racket: "🎾", water: "🏊", gymnastics: "🤸",
  athletics: "🏃", target: "🎯", mind: "♟️", motor: "🏍️", air: "🪂",
  mountain: "⛷️", wheels: "🚴", equestrian: "🐎", fencing: "🤺",
  wellness: "🧘", other: "🏅",
};

export default async function SportsIndex() {
  const [categories, sports] = await Promise.all([getCategories(), getSports()]);
  const byCat = new Map<number, typeof sports>();
  for (const s of sports) {
    if (s.category_id == null) continue;
    if (!byCat.has(s.category_id)) byCat.set(s.category_id, []);
    byCat.get(s.category_id)!.push(s);
  }
  const totalClubs = sports.reduce((a, s) => a + s.club_count, 0);

  return (
    <>
      <section className="border-b bg-gradient-to-b from-white to-slate-50">
        <div className="container-x py-12">
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Αθλήματα & δραστηριότητες</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            {sports.length} αθλήματα σε {categories.length} κατηγορίες. Επίλεξε ένα για να δεις τα σωματεία.
          </p>
        </div>
      </section>

      <section className="container-x py-10">
        <div className="grid gap-5 md:grid-cols-2">
          {categories.map((cat) => {
            const list = (byCat.get(cat.id) ?? []).sort((a, b) => b.club_count - a.club_count);
            if (list.length === 0) return null;
            return (
              <div
                key={cat.id}
                className="rounded-2xl border bg-white p-5 transition hover:shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xl">
                    {CAT_EMOJI[cat.slug] ?? "🏅"}
                  </span>
                  <div>
                    <h2 className="font-bold leading-tight text-slate-900">{cat.name}</h2>
                    <p className="text-xs text-slate-400">{list.length} αθλήματα</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {list.map((s) => (
                    <Link
                      key={s.id}
                      href={`/athlimata/${s.slug}`}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 transition hover:border-brand hover:bg-white hover:text-brand"
                    >
                      <span className="capitalize">{s.name.toLowerCase()}</span>
                      <span className="rounded-full bg-slate-200 px-1.5 text-xs text-slate-500 group-hover:bg-brand/10 group-hover:text-brand">
                        {s.club_count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          Σύνολο {totalClubs.toLocaleString("el-GR")} καταχωρήσεων αθλημάτων σε όλη την Ελλάδα
        </p>
      </section>
    </>
  );
}
