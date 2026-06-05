import { createServerSupabase } from "@/lib/supabase/server";
import { updateRequestStatus } from "@/lib/admin/actions";

const STATUSES = ["new", "sent", "contacted", "closed"] as const;

const BADGE: Record<string, string> = {
  new: "bg-amber-100 text-amber-700",
  sent: "bg-blue-100 text-blue-700",
  contacted: "bg-violet-100 text-violet-700",
  closed: "bg-green-100 text-green-700",
};

type Row = {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: string;
  created_at: string;
  club: { name: string; slug: string } | null;
};

export default async function AdminRequests() {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("registration_requests")
    .select("*, club:clubs(name, slug)")
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = (data as Row[]) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Αιτήματα εγγραφής ({rows.length})</h1>
      <p className="mt-1 text-sm text-slate-500">
        Αλλαγή κατάστασης και αποστολή email στον ενδιαφερόμενο.
      </p>

      <div className="mt-5 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Ημ/νία</th>
              <th className="px-4 py-3">Όνομα</th>
              <th className="px-4 py-3">Επικοινωνία</th>
              <th className="px-4 py-3">Σύλλογος</th>
              <th className="px-4 py-3">Κατάσταση</th>
              <th className="px-4 py-3">Ενέργειες</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Δεν υπάρχουν αιτήματα ακόμη.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-b align-top last:border-0">
                <td className="px-4 py-3 text-slate-500">
                  {new Date(r.created_at).toLocaleDateString("el-GR")}
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">{r.full_name}</td>
                <td className="px-4 py-3 text-slate-600">
                  <div>{r.email}</div>
                  {r.phone && <div className="text-xs text-slate-400">{r.phone}</div>}
                  {r.message && <div className="mt-1 max-w-xs text-xs text-slate-400">{r.message}</div>}
                </td>
                <td className="px-4 py-3 text-slate-600">{r.club?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${BADGE[r.status] ?? "bg-slate-100 text-slate-600"}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-2">
                    <form action={updateRequestStatus} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={r.id} />
                      <select
                        name="status"
                        defaultValue={r.status}
                        className="rounded border border-slate-300 px-2 py-1 text-xs"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button className="rounded bg-slate-800 px-2 py-1 text-xs text-white hover:bg-slate-700">
                        OK
                      </button>
                    </form>
                    <a
                      href={`mailto:${r.email}?subject=${encodeURIComponent(
                        `Εγγραφή στον σύλλογο ${r.club?.name ?? ""}`
                      )}`}
                      className="text-xs text-brand hover:underline"
                    >
                      ✉ Email στον ενδιαφερόμενο
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
