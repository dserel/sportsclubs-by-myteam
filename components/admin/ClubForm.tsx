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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Facebook</label>
          <input name="facebook" defaultValue={club?.socials?.facebook ?? ""} className={`w-full ${field}`} placeholder="https://facebook.com/…" />
        </div>
        <div>
          <label className={label}>Instagram</label>
          <input name="instagram" defaultValue={club?.socials?.instagram ?? ""} className={`w-full ${field}`} placeholder="https://instagram.com/…" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={label}>Τύπος συλλόγου</label>
          <select name="club_type" defaultValue={club?.club_type ?? ""} className={`w-full ${field}`}>
            <option value="">—</option>
            <option value="Ψυχαγωγικό">Ψυχαγωγικό</option>
            <option value="Ακαδημία">Ακαδημία</option>
            <option value="Ανταγωνιστικό">Ανταγωνιστικό</option>
          </select>
        </div>
        <div>
          <label className={label}>Υπεύθυνος επικοινωνίας</label>
          <input name="contact_name" defaultValue={club?.contact_name ?? ""} className={`w-full ${field}`} />
        </div>
        <div>
          <label className={label}>Ρόλος υπευθύνου</label>
          <input name="contact_role" defaultValue={club?.contact_role ?? ""} className={`w-full ${field}`} placeholder="π.χ. Υπεύθυνος εγγραφών" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={label}>Έναρξη εγγραφών</label>
          <input name="registration_opens_at" type="date" defaultValue={club?.registration_opens_at ?? ""} className={`w-full ${field}`} />
        </div>
        <div>
          <label className={label}>Ετήσιο κόστος από (€)</label>
          <input name="annual_fee_min" type="number" defaultValue={club?.annual_fee_min ?? ""} className={`w-full ${field}`} />
        </div>
        <div>
          <label className={label}>έως (€)</label>
          <input name="annual_fee_max" type="number" defaultValue={club?.annual_fee_max ?? ""} className={`w-full ${field}`} />
        </div>
      </div>

      <div>
        <label className={label}>Link online εγγραφής (αν δεν είναι myTeam)</label>
        <input name="registration_url" defaultValue={club?.registration_url ?? ""} className={`w-full ${field}`} placeholder="https://…" />
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
