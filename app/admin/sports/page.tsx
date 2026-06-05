import { createServerSupabase } from "@/lib/supabase/server";
import { upsertSport, toggleSportActive } from "@/lib/admin/actions";
import type { Sport, Category } from "@/lib/types";

export default async function AdminSports() {
  const supabase = createServerSupabase();
  const [{ data: cats }, { data: sportsData }] = await Promise.all([
    supabase.from("categories").select("*").order("id"),
    supabase.from("sports").select("*").order("source", { ascending: false }).order("name"),
  ]);
  const categories = (cats as Category[]) ?? [];
  const sports = (sportsData as Sport[]) ?? [];
  const catName = (id: number | null) => categories.find((c) => c.id === id)?.name ?? "—";
  const wellness = categories.find((c) => c.slug === "wellness");

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Αθλήματα & δραστηριότητες</h1>
      <p className="mt-1 text-sm text-slate-500">
        Πρόσθεσε νέες δραστηριότητες (π.χ. Pilates, Yoga) στην κατηγορία Wellness.
      </p>

      {/* Add new activity */}
      <form action={upsertSport} className="mt-5 flex flex-wrap items-end gap-3 rounded-xl border bg-white p-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Νέα δραστηριότητα</label>
          <input
            name="name"
            required
            placeholder="π.χ. Pilates"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Κατηγορία</label>
          <select
            name="category_id"
            defaultValue={wellness?.id ?? ""}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
          + Προσθήκη
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Δραστηριότητα</th>
              <th className="px-4 py-3">Κατηγορία</th>
              <th className="px-4 py-3">Πηγή</th>
              <th className="px-4 py-3">Σύλλογοι</th>
              <th className="px-4 py-3">Ενεργό</th>
            </tr>
          </thead>
          <tbody>
            {sports.map((s) => (
              <tr key={s.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium text-slate-800">{s.name}</td>
                <td className="px-4 py-3 text-slate-500">{catName(s.category_id)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${s.source === "admin" ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-500"}`}>
                    {s.source}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{s.club_count}</td>
                <td className="px-4 py-3">
                  <form action={toggleSportActive}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="active" value={(!s.is_active).toString()} />
                    <button className={`rounded px-2 py-1 text-xs ${s.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {s.is_active ? "Ενεργό" : "Ανενεργό"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
