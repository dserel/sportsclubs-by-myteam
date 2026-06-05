# Clubs Directory

Κατάλογος αθλητικών σωματείων Ελλάδας (Next.js + Supabase). SEO-first, με δύο ροές εγγραφής
(myTeam deep-link ή αίτημα εγγραφής) και admin για διαχείριση.

## Τοπική εκτέλεση

```bash
npm install
npm run dev      # http://localhost:3000
```

Το `.env.local` είναι ήδη συμπληρωμένο με τη Supabase βάση (project `clubs-directory`).

## Δομή

- `app/` — Next.js App Router
  - `page.tsx` — αρχική + αναζήτηση
  - `anazitisi/` — αποτελέσματα αναζήτησης
  - `athlimata/` , `athlimata/[slug]/` — αθλήματα & σύλλογοι ανά άθλημα
  - `perioxes/` , `perioxes/[region]/` — σύλλογοι ανά περιοχή
  - `sullogoi/[slug]/` — landing page συλλόγου (JSON-LD, CTA εγγραφής) — ISR on-demand
  - `api/registration-request/` — υποβολή αιτήματος (insert στο `registration_requests`)
  - `admin/`, `login/`, `auth/signout/` — διαχείριση (Supabase Auth + RLS)
  - `sitemap.ts`, `robots.ts`
- `lib/` — Supabase clients, types, queries
- `components/` — SearchBar, ClubCard, RegistrationForm
- `supabase/functions/forward-request/` — Edge Function για email προώθηση

## SEO

- SSG/ISR: αθλήματα prerendered, σύλλογοι on-demand + cache (revalidate 24h)
- Δυναμικό `sitemap.xml` (όλοι οι σύλλογοι), `robots.txt`
- Ανά σελίδα metadata + canonical + OpenGraph
- JSON-LD `SportsClub` σε κάθε σελίδα συλλόγου
- Greeklish slugs

## Πρώτος admin

1. Στο Supabase → Authentication → δημιούργησε χρήστη (email/password).
2. Πρόσθεσε γραμμή στο `profiles`:

```sql
insert into profiles (id, email, role)
values ('<USER_UUID>', '<email>', 'admin')
on conflict (id) do update set role = 'admin';
```

3. Σύνδεση στο `/login` → `/admin`.

## Email προώθηση αιτημάτων

Deploy το Edge Function και σύνδεσέ το με Database Webhook στο INSERT του
`registration_requests` (ή κάλεσέ το από το API route):

```bash
supabase functions deploy forward-request
supabase secrets set RESEND_API_KEY=... FORWARD_TO_EMAIL=info@yourdomain.gr
```

## Deploy

Vercel ή Netlify. Όρισε env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_MYTEAM_BASE_URL`).
