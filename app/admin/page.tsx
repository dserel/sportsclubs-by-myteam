import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import type { RegistrationRequest } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const sb = createServerSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/login");

  // RLS: admins only can read these rows. Non-admins get empty / no access.
  const { data: profile } = await sb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    return (
      <div className="container-x py-16">
        <h1 className="text-2xl font-bold">Δεν έχεις πρόσβαση</h1>
        <p className="mt-2 text-slate-600">
          Ο λογαριασμός {user.email} δεν είναι διαχειριστής. Ζήτησε από έναν admin να σου δώσει ρόλο
          <code className="mx-1 rounded bg-slate-100 px-1">admin</code> στον πίνακα profiles.
        </p>
        <form action="/auth/signout" method="post" className="mt-6">
          <button className="text-sm text-brand hover:underline">Αποσύνδεση</button>
        </form>
      </div>
    );
  }

  const { data: requests } = await sb
    .from("registration_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const list = (requests as RegistrationRequest[]) ?? [];

  return (
    <div className="container-x py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Πίνακας διαχείρισης</h1>
        <Link href="/" className="text-sm text-brand hover:underline">Στο site →</Link>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-slate-800">
        Αιτήματα εγγραφής ({list.length})
      </h2>

      <div className="mt-4 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Ημ/νία</th>
              <th className="px-4 py-3">Όνομα</th>
              <th className="px-4 py-3">Επικοινωνία</th>
              <th className="px-4 py-3">Σύλλογος</th>
              <th className="px-4 py-3">Κατάσταση</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Δεν υπάρχουν αιτήματα ακόμη.
                </td>
              </tr>
            )}
            {list.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="px-4 py-3 text-slate-500">
                  {new Date(r.created_at).toLocaleDateString("el-GR")}
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">{r.full_name}</td>
                <td className="px-4 py-3 text-slate-600">
                  <div>{r.email}</div>
                  {r.phone && <div className="text-xs text-slate-400">{r.phone}</div>}
                </td>
                <td className="px-4 py-3 text-slate-600">#{r.club_id ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Επόμενα: CRUD για συλλόγους & αθλήματα (πρόσθεση pilates/yoga ως κατηγορία wellness),
        αλλαγή κατάστασης αιτημάτων, αποστολή email.
      </p>
    </div>
  );
}
