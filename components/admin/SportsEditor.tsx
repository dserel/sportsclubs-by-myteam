import { updateClubSports } from "@/lib/admin/actions";
import type { Sport, Category } from "@/lib/types";

export default function SportsEditor({
  clubId,
  sports,
  categories,
  currentIds,
}: {
  clubId: number;
  sports: Sport[];
  categories: Category[];
  currentIds: Set<number>;
}) {
  const byCat = new Map<number, Sport[]>();
  for (const s of sports) {
    const k = s.category_id ?? 0;
    if (!byCat.has(k)) byCat.set(k, []);
    byCat.get(k)!.push(s);
  }
  const catName = (id: number) => categories.find((c) => c.id === id)?.name ?? "Άλλα";

  return (
    <form action={updateClubSports} className="mt-4 rounded-xl border bg-white p-5">
      <input type="hidden" name="club_id" value={clubId} />
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">Αθλήματα συλλόγου</h2>
        <span className="text-xs text-slate-400">{currentIds.size} επιλεγμένα</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Τσέκαρε τα αθλήματα που έχει ο σύλλογος και πάτα Αποθήκευση.
      </p>

      <div className="mt-4 max-h-96 space-y-4 overflow-y-auto pr-2">
        {[...byCat.entries()]
          .sort((a, b) => a[0] - b[0])
          .map(([catId, list]) => (
            <div key={catId}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {catName(catId)}
              </h3>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {list
                  .sort((a, b) => a.name.localeCompare(b.name, "el"))
                  .map((s) => (
                    <label
                      key={s.id}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-transparent px-2 py-1 text-sm text-slate-700 hover:border-slate-200 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        name="sport_ids"
                        value={s.id}
                        defaultChecked={currentIds.has(s.id)}
                      />
                      <span className="capitalize">{s.name.toLowerCase()}</span>
                    </label>
                  ))}
              </div>
            </div>
          ))}
      </div>

      <button className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark">
        Αποθήκευση αθλημάτων
      </button>
    </form>
  );
}
