import { addAchievement, deleteAchievement } from "@/lib/admin/actions";
import type { ClubAchievement } from "@/lib/types";

const field = "rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand";

export default function AchievementsEditor({
  clubId,
  achievements,
}: {
  clubId: number;
  achievements: ClubAchievement[];
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <h2 className="font-semibold text-slate-900">Επιτεύγματα ({achievements.length})</h2>
      <p className="mt-1 text-xs text-slate-500">π.χ. «Πρωταθλητής Β’ Εθνικής», έτος 2023.</p>

      {achievements.length > 0 && (
        <ul className="mt-4 divide-y rounded-lg border">
          {achievements.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <span className="text-slate-800">
                {a.year ? <span className="mr-2 font-medium text-slate-500">{a.year}</span> : null}
                {a.title}
              </span>
              <form action={deleteAchievement}>
                <input type="hidden" name="id" value={a.id} />
                <input type="hidden" name="club_id" value={clubId} />
                <button className="text-xs text-red-600 hover:underline">Διαγραφή</button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form action={addAchievement} className="mt-4 flex flex-wrap items-end gap-3">
        <input type="hidden" name="club_id" value={clubId} />
        <input name="title" required placeholder="Τίτλος επιτεύγματος *" className={`${field} min-w-64 flex-1`} />
        <input name="year" type="number" placeholder="Έτος" className={`${field} w-28`} />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
          + Προσθήκη
        </button>
      </form>
    </div>
  );
}
