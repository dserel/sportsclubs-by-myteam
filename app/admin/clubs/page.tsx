import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";

type Row = {
  id: number;
  name: string;
  city: string | null;
  region: string | null;
  has_myteam: boolean;
  is_published: boolean;
};

export default async function AdminClubs({
  searchParams,
}: {
  searchParams: { q?: string; saved?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const supabase = createServerSupabase();
  let query = supabase
    .from("clubs")
    .select("id, name, city, region, has_myteam, is_published")
    .order("name")
    .limit(50);
  if (q) query = query.ilike("name", `%${q}%`);
  const { data } = await query;
  const rows = (data as Row[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Σύλλογοι</h1>
        <Link
          href="/admin/clubs/new"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          + Νέα καταχώρηση
        </Link>
      </div>

      {searchParams.saved && (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          Αποθηκεύτηκε.
        </p>
      )}

      <form className="mt-5 flex gap-2" action="/admin/clubs">
        <input
          name="q"
          defaultValue={q}
          placeholder="Αναζήτηση ονόματος…"
          className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
        <button className="rounded-lg border px-4 py-2 text-sm hover:border-brand">Αναζήτηση</button>
      </form>

      <div className="mt-5 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Όνομα</th>
              <th className="px-4 py-3">Περιοχή</th>
              <th className="px-4 py-3">myTeam</th>
              <th className="px-4 py-3">Δημοσ.</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                <td className="px-4 py-3 text-slate-500">
                  {[c.city, c.region].filter(Boolean).join(", ") || "—"}
                </td>
                <td className="px-4 py-3">{c.has_myteam ? "✓" : "—"}</td>
                <td className="px-4 py-3">{c.is_published ? "✓" : "✕"}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/clubs/${c.id}`} className="text-brand hover:underline">
                    Επεξεργασία
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Κανένα αποτέλεσμα.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!q && <p className="mt-3 text-xs text-slate-400">Εμφανίζονται 50. Χρησιμοποίησε αναζήτηση.</p>}
    </div>
  );
}
