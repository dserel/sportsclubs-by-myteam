"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/anazitisi?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="flex w-full gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Αναζήτησε σύλλογο, π.χ. Ολυμπιακός, καράτε Πάτρα…"
        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none focus:border-brand"
        aria-label="Αναζήτηση συλλόγου"
      />
      <button
        type="submit"
        className="rounded-lg bg-brand px-5 py-3 font-medium text-white transition hover:bg-brand-dark"
      >
        Αναζήτηση
      </button>
    </form>
  );
}
