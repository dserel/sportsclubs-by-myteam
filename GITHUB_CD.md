# Αυτόματο deploy (GitHub → Netlify)

Στόχος: κάθε `git push` να χτίζει & ανεβάζει μόνο του στο Netlify.

## Βήμα 1 — Ανέβασε τον κώδικα στο GitHub

```bash
cd ~/Downloads/Metabase/clubs-directory
bash setup-github.sh
```

- Αν έχεις το **GitHub CLI** (`gh`), φτιάχνει ιδιωτικό repo και κάνει push αυτόματα.
- Αν όχι, φτιάξε κενό repo στο https://github.com/new και τρέξε τις 2 εντολές που θα σου τυπώσει το script.

## Βήμα 2 — Σύνδεσε το repo με το υπάρχον Netlify site

Έτσι κρατάμε το ίδιο URL (athlitika-somateia.netlify.app) **και** τα env vars που έχουν ήδη οριστεί.

1. Netlify → project **athlitika-somateia** → **Site configuration → Build & deploy → Continuous deployment**.
2. **Link repository** → GitHub → εξουσιοδότηση → διάλεξε το repo `sportsclubs-by-myteam`, branch **main**.
3. Build settings (αν δεν συμπληρωθούν αυτόματα από το `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Plugin: `@netlify/plugin-nextjs` (ήδη στο `netlify.toml`)
4. **Deploy site**.

Τα env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_MYTEAM_BASE_URL`) έχουν ήδη οριστεί στο site από το προηγούμενο deploy. Έλεγξέ τα στο **Environment variables**.

## Από δω και πέρα

```bash
# κάνεις αλλαγές…
git add -A && git commit -m "η αλλαγή μου"
git push
```

Το Netlify χτίζει αυτόματα και ενημερώνει το live URL σε ~2-3 λεπτά.

> Σημείωση ασφαλείας: το `.env.local` ΔΕΝ ανεβαίνει (είναι στο `.gitignore`). Το anon key είναι δημόσιο (NEXT_PUBLIC) και χρησιμοποιείται από το build μέσω των env vars του Netlify.
