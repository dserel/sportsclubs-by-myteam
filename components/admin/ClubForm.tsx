import type { Club } from "@/lib/types";

const field = "rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand";
const label = "block text-xs font-medium text-slate-500 mb-1";

export default function ClubForm({
  action,
  club,
  isNew = false,
}: {
  action: (fd: FormData) => void | Promise<void>;
  club?: Partial<Club>;
  isNew?: boolean;
}) {
  return (
    <form action={action} className="mt-6 max-w-2xl space-y-4">
      {club?.id != null && <input type="hidden" name="id" value={club.id} />}

      <div>
        <label className={label}>Όνομα συλλόγου *</label>
        <input name="name" required defaultValue={club?.name ?? ""} className={`w-full ${field}`} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Πόλη</label>
          <input name="city" defaultValue={club?.city ?? ""} className={`w-full ${field}`} />
        </div>
        <div>
          <label className={label}>Περιοχή / Νομός</label>
          <input name="region" defaultValue={club?.region ?? ""} className={`w-full ${field}`} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Διεύθυνση</label>
          <input name="address" defaultValue={club?.address ?? ""} className={`w-full ${field}`} />
        </div>
        <div>
          <label className={label}>Τ.Κ.</label>
          <input name="postal_code" defaultValue={club?.postal_code ?? ""} className={`w-full ${field}`} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Τηλέφωνο</label>
          <input name="phone" defaultValue={club?.phone ?? ""} className={`w-full ${field}`} />
        </div>
        <div>
          <label className={label}>Email</label>
          <input name="email" type="email" defaultValue={club?.email ?? ""} className={`w-full ${field}`} />
        </div>
      </div>

      <div>
        <label className={label}>Ιστότοπος</label>
        <input name="website" defaultValue={club?.website ?? ""} className={`w-full ${field}`} placeholder="https://…" />
      </div>

      <div>
        <label className={label}>Περιγραφή (landing page)</label>
        <textarea name="description" rows={4} defaultValue={club?.description ?? ""} className={`w-full ${field}`} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Logo URL</label>
          <input name="logo_url" defaultValue={club?.logo_url ?? ""} className={`w-full ${field}`} />
        </div>
        <div>
          <label className={label}>Cover URL</label>
          <input name="cover_url" defaultValue={club?.cover_url ?? ""} className={`w-full ${field}`} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="is_published" defaultChecked={club?.is_published ?? true} />
          Δημοσιευμένο
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="has_myteam" defaultChecked={club?.has_myteam ?? false} />
          Έχει λογαριασμό myTeam
        </label>
      </div>

      <div>
        <label className={label}>myTeam slug (για το κουμπί εγγραφής)</label>
        <input
          name="myteam_slug"
          defaultValue={club?.myteam_slug ?? ""}
          className={`w-full ${field}`}
          placeholder="π.χ. kifisia-fc"
        />
        <p className="mt-1 text-xs text-slate-400">
          Το κουμπί θα οδηγεί στο app.my-team.co/create-profile?club=&lt;slug&gt;&amp;registration=1
        </p>
      </div>

      <button className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark">
        {isNew ? "Δημιουργία" : "Αποθήκευση"}
      </button>
    </form>
  );
}
