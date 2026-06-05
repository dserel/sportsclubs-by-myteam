import { addClubTeam, deleteClubTeam } from "@/lib/admin/actions";
import type { ClubTeam, Sport } from "@/lib/types";

const field = "rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand";

export default function TeamsEditor({
  clubId,
  teams,
  sports,
}: {
  clubId: number;
  teams: ClubTeam[];
  sports: Sport[];
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <h2 className="font-semibold text-slate-900">Ομάδες / τμήματα ({teams.length})</h2>
      <p className="mt-1 text-xs text-slate-500">
        π.χ. «Ανδρικό», «Παίδες U14», «Γυναικείο U16». Φαίνονται στη σελίδα του συλλόγου.
      </p>

      {teams.length > 0 && (
        <ul className="mt-4 divide-y rounded-lg border">
          {teams.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <div>
                <span className="font-medium text-slate-800">{t.name}</span>
                <span className="ml-2 text-xs text-slate-400">
                  {[t.gender, t.age_group].filter(Boolean).join(" · ")}
                  {t.registration_opens_at ? ` · εγγραφές ${t.registration_opens_at}` : ""}
                </span>
              </div>
              <form action={deleteClubTeam}>
                <input type="hidden" name="id" value={t.id} />
                <input type="hidden" name="club_id" value={clubId} />
                <button className="text-xs text-red-600 hover:underline">Διαγραφή</button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form action={addClubTeam} className="mt-4 grid gap-3 sm:grid-cols-2">
        <input type="hidden" name="club_id" value={clubId} />
        <input name="name" required placeholder="Όνομα ομάδας *" className={field} />
        <select name="gender" defaultValue="" className={field}>
          <option value="">Φύλο…</option>
          <option value="Ανδρικό">Ανδρικό</option>
          <option value="Γυναικείο">Γυναικείο</option>
          <option value="Μικτό">Μικτό</option>
        </select>
        <input name="age_group" placeholder="Ηλικιακή κατηγορία (π.χ. U14)" className={field} list="agegroups" />
        <datalist id="agegroups">
          {["U6", "U8", "U10", "U12", "U14", "U16", "U18", "U21", "Ανδρών", "Γυναικών", "Masters"].map((a) => (
            <option key={a} value={a} />
          ))}
        </datalist>
        <select name="sport_id" defaultValue="" className={field}>
          <option value="">Άθλημα (προαιρετικό)…</option>
          {sports.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <input name="registration_opens_at" type="date" className={field} />
        <input name="registration_url" placeholder="Link εγγραφής (προαιρετικό)" className={field} />
        <input name="notes" placeholder="Σημειώσεις" className={`${field} sm:col-span-2`} />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark sm:col-span-2 sm:justify-self-start">
          + Προσθήκη ομάδας
        </button>
      </form>
    </div>
  );
}
