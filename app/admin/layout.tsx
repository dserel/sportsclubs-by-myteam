import Link from "next/link";
import { requireAdmin } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = await requireAdmin();

  if (!isAdmin) {
    return (
      <div className="container-x py-16">
        <h1 className="text-2xl font-bold">Δεν έχεις πρόσβαση</h1>
        <p className="mt-2 text-slate-600">
          Ο λογαριασμός {user.email} δεν είναι διαχειριστής.
        </p>
        <form action="/auth/signout" method="post" className="mt-6">
          <button className="text-sm text-brand hover:underline">Αποσύνδεση</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container-x py-8">
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-6">
          <span className="font-bold text-slate-900">Admin</span>
          <nav className="flex gap-4 text-sm font-medium text-slate-600">
            <Link href="/admin" className="hover:text-brand">Αιτήματα</Link>
            <Link href="/admin/clubs" className="hover:text-brand">Σύλλογοι</Link>
            <Link href="/admin/sports" className="hover:text-brand">Αθλήματα</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Link href="/" className="hover:text-brand">Στο site →</Link>
          <form action="/auth/signout" method="post">
            <button className="hover:text-brand">Αποσύνδεση</button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
