import Link from "next/link";
import type { Club } from "@/lib/types";

export default function ClubCard({ club }: { club: Club }) {
  return (
    <Link
      href={`/sullogoi/${club.slug}`}
      className="block rounded-xl border bg-white p-4 transition hover:border-brand hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug text-slate-900">{club.name}</h3>
        {club.has_myteam && (
          <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            myTeam
          </span>
        )}
      </div>
      {(club.city || club.region) && (
        <p className="mt-1 text-sm text-slate-500">
          {[club.city, club.region].filter(Boolean).join(", ")}
        </p>
      )}
      {club.sport_slugs?.length > 0 && (
        <p className="mt-2 line-clamp-1 text-xs text-slate-400">
          {club.sport_slugs.slice(0, 4).join(" · ")}
        </p>
      )}
    </Link>
  );
}
