"use client";

import { useState } from "react";

export default function RegistrationForm({
  clubId,
  clubName,
}: {
  clubId: number;
  clubName: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = {
      club_id: clubId,
      full_name: String(fd.get("full_name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      message: String(fd.get("message") || ""),
    };
    try {
      const res = await fetch("/api/registration-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Σφάλμα");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Κάτι πήγε στραβά");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-green-800">
        <p className="font-semibold">Το αίτημά σου στάλθηκε!</p>
        <p className="mt-1 text-sm">
          Θα προωθήσουμε το ενδιαφέρον σου στον σύλλογο «{clubName}» και θα επικοινωνήσουμε μαζί σου.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border bg-white p-5">
      <p className="text-sm text-slate-600">
        Ο σύλλογος δεν έχει ακόμη online εγγραφή. Συμπλήρωσε τα στοιχεία σου και θα προωθήσουμε το
        αίτημα εγγραφής.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="full_name" required placeholder="Ονοματεπώνυμο *"
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand" />
        <input name="email" type="email" required placeholder="Email *"
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand" />
      </div>
      <input name="phone" placeholder="Τηλέφωνο"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand" />
      <textarea name="message" rows={3} placeholder="Μήνυμα (προαιρετικό) — π.χ. άθλημα, ηλικία, διαθεσιμότητα"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand" />
      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-brand px-5 py-2.5 font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "sending" ? "Αποστολή…" : "Αποστολή αιτήματος"}
      </button>
    </form>
  );
}
