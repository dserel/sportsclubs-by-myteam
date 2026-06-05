"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Opt = { value: string; label: string };

export default function SearchFilters({
  current,
  sports,
  regions,
  ages,
}: {
  current: { q: string; sport: string; region: string; type: string; age: string };
  sports: Opt[];
  regions: string[];
  ages: string[];
}) {
  const router = useRouter();
  const [q, setQ] = useState(current.q);

  function push(next: Partial<typeof current>) {
    const merged = { ...current, q, ...next };
    const params = new URLSearchParams();
    if (merged.q.trim()) params.set("q", merged.q.trim());
    if (merged.sport) params.set("sport", merged.sport);
    if (merged.region) params.set("region", merged.region);
    if (merged.type) params.set("type", merged.type);
    if (merged.age) params.set("age", merged.age);
    router.push(`/anazitisi?${params.toString()}`);
  }

  const sel = "rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand bg-white";
  const hasFilters = current.sport || current.region || current.type || current.age || current.q;

  return (
    <div className="rounded-2xl border bg-white p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          push({});
        }}
        className="flex gap-2"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Όνομα συλλόγου…"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-brand"
        />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
          Αναζήτηση
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        <select className={sel} value={current.sport} onChange={(e) => push({ sport: e.target.value })}>
          <option value="">Όλα τα αθλήματα</option>
          {sports.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select className={sel} value={current.region} onChange={(e) => push({ region: e.target.value })}>
          <option value="">Όλες οι περιοχές</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <select className={sel} value={current.type} onChange={(e) => push({ type: e.target.value })}>
          <option value="">Κάθε τύπος</option>
          <option value="Ψυχαγωγικό">Ψυχαγωγικό</option>
          <option value="Ακαδημία">Ακαδημία</option>
          <option value="Ανταγωνιστικό">Ανταγωνιστικό</option>
        </select>

        {ages.length > 0 && (
          <select className={sel} value={current.age} onChange={(e) => push({ age: e.target.value })}>
            <option value="">Κάθε ηλικία</option>
            {ages.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        )}

        {hasFilters && (
          <button
            onClick={() => router.push("/anazitisi")}
            className="rounded-lg border px-3 py-2 text-sm text-slate-500 hover:text-brand"
          >
            Καθαρισμός
          </button>
        )}
      </div>
    </div>
  );
}
