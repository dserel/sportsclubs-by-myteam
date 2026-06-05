import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Δεν βρέθηκε</h1>
      <p className="mt-2 text-slate-600">Η σελίδα που ζητήσατε δεν υπάρχει.</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-brand px-5 py-2.5 font-medium text-white hover:bg-brand-dark">
        Επιστροφή στην αρχική
      </Link>
    </div>
  );
}
