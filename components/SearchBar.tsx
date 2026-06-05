"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";

type Suggestion = {
  name: string;
  slug: string;
  city: string | null;
  region: string | null;
  has_myteam: boolean;
};

export default function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  // debounced fetch
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      const sb = createBrowserSupabase();
      const { data } = await sb
        .from("clubs")
        .select("name, slug, city, region, has_myteam")
        .eq("is_published", true)
        .ilike("name", `%${term}%`)
        .order("has_myteam", { ascending: false })
        .limit(8);
      setItems((data as Suggestion[]) ?? []);
      setLoading(false);
      setOpen(true);
      setActive(-1);
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  // close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function goSearch() {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/anazitisi?${params.toString()}`);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || items.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        goSearch();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && items[active]) {
        router.push(`/sullogoi/${items[active].slug}`);
        setOpen(false);
      } else {
        goSearch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="flex w-full gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => items.length > 0 && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Αναζήτησε σύλλογο, π.χ. Ολυμπιακός, Άρης Πάτρα…"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none focus:border-brand"
          aria-label="Αναζήτηση συλλόγου"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={goSearch}
          className="rounded-lg bg-brand px-5 py-3 font-medium text-white transition hover:bg-brand-dark"
        >
          Αναζήτηση
        </button>
      </div>

      {open && q.trim().length >= 2 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border bg-white text-left shadow-lg">
          {loading && items.length === 0 && (
            <div className="px-4 py-3 text-sm text-slate-400">Αναζήτηση…</div>
          )}
          {!loading && items.length === 0 && (
            <div className="px-4 py-3 text-sm text-slate-400">Κανένα αποτέλεσμα.</div>
          )}
          {items.map((it, i) => (
            <button
              key={it.slug}
              onMouseDown={(e) => {
                e.preventDefault();
                router.push(`/sullogoi/${it.slug}`);
                setOpen(false);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left ${
                active === i ? "bg-slate-50" : ""
              }`}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-slate-800">{it.name}</span>
                {(it.city || it.region) && (
                  <span className="block truncate text-xs text-slate-400">
                    {[it.city, it.region].filter(Boolean).join(", ")}
                  </span>
                )}
              </span>
              {it.has_myteam && (
                <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  myTeam
                </span>
              )}
            </button>
          ))}
          {items.length > 0 && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                goSearch();
              }}
              className="block w-full border-t px-4 py-2.5 text-left text-sm font-medium text-brand hover:bg-slate-50"
            >
              Δες όλα τα αποτελέσματα για «{q.trim()}» →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
