"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { addClubPhoto, deleteClubPhoto } from "@/lib/admin/actions";
import type { ClubPhoto } from "@/lib/types";

export default function PhotoUploader({
  clubId,
  photos,
}: {
  clubId: number;
  photos: ClubPhoto[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const sb = createBrowserSupabase();
      const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const path = `${clubId}/${Date.now()}-${safe}`;
      const { error: upErr } = await sb.storage.from("club-photos").upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { data } = sb.storage.from("club-photos").getPublicUrl(path);
      await addClubPhoto(clubId, path, data.publicUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Αποτυχία ανεβάσματος");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="rounded-xl border bg-white p-5">
      <h2 className="font-semibold text-slate-900">Φωτογραφίες ({photos.length})</h2>
      <p className="mt-1 text-xs text-slate-500">Γήπεδο, χώροι, δράσεις. Ανεβαίνουν στο Supabase Storage.</p>

      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((p) => (
            <div key={p.id} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" className="h-24 w-full rounded-lg object-cover" />
              <form action={deleteClubPhoto} className="absolute right-1 top-1">
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="club_id" value={clubId} />
                <input type="hidden" name="path" value={p.path} />
                <button className="rounded bg-black/60 px-1.5 text-xs text-white opacity-0 group-hover:opacity-100">
                  ✕
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      <label className="mt-4 inline-block cursor-pointer rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-600 hover:border-brand hover:text-brand">
        {busy ? "Ανέβασμα…" : "+ Ανέβασμα φωτογραφίας"}
        <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={busy} />
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
