import Link from "next/link";
import ClubForm from "@/components/admin/ClubForm";
import { createClub } from "@/lib/admin/actions";

export default function NewClubPage() {
  return (
    <div>
      <nav className="mb-2 text-sm text-slate-500">
        <Link href="/admin/clubs" className="hover:text-brand">Σύλλογοι</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Νέα καταχώρηση</span>
      </nav>
      <h1 className="text-2xl font-bold text-slate-900">Νέος σύλλογος</h1>
      <p className="mt-1 text-sm text-slate-500">
        Χειροκίνητη καταχώρηση. Το URL (slug) δημιουργείται αυτόματα από το όνομα.
      </p>
      <ClubForm action={createClub} isNew />
    </div>
  );
}
