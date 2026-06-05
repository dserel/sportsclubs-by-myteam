import type { Metadata } from "next";
import Link from "next/link";
import { listRegions } from "@/lib/queries";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Σωματεία ανά περιοχή",
  description: "Βρες αθλητικά σωματεία ανά περιοχή / νομό στην Ελλάδα.",
  alternates: { canonical: "/perioxes" },
};

function slugifyRegion(r: string) {
  return encodeURIComponent(r.trim());
}

export default async function RegionsIndex() {
  const regions = await listRegions();
  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-bold text-slate-900">Περιοχές</h1>
      <p className="mt-2 text-slate-600">
        Επίλεξε περιοχή για να δεις τα σωματεία. (Διαθέσιμο για συλλόγους με καταχωρημένη περιοχή.)
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {regions.map((r) => (
          <Link
            key={r}
            href={`/perioxes/${slugifyRegion(r)}`}
            className="rounded-full border bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-brand hover:text-brand"
          >
            {r}
          </Link>
        ))}
      </div>
    </div>
  );
}
