import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import RegistrationForm from "@/components/RegistrationForm";
import { getClubBySlug, getSportsBySlugs, getClubTeams, getClubAchievements, getClubPhotos } from "@/lib/queries";

export const revalidate = 86400;
export const dynamicParams = true;
export function generateStaticParams() {
  return [] as { slug: string }[];
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const MYTEAM_BASE = process.env.NEXT_PUBLIC_MYTEAM_BASE_URL || "https://app.my-team.co";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const club = await getClubBySlug(params.slug);
  if (!club) return {};
  const sports = await getSportsBySlugs(club.sport_slugs ?? []);
  const place = [club.city, club.region].filter(Boolean).join(", ");
  const title = club.name;
  const description = `${club.name}${place ? ` — ${place}` : ""}. ${
    sports.length ? `Αθλήματα: ${sports.map((s) => s.name).join(", ")}. ` : ""
  }Πληροφορίες, ομάδες και εγγραφή.`;
  return {
    title,
    description,
    alternates: { canonical: `/sullogoi/${club.slug}` },
    openGraph: { title, description, type: "website", url: `${SITE_URL}/sullogoi/${club.slug}` },
  };
}

function feeText(min: number | null, max: number | null): string | null {
  if (min != null && max != null) return min === max ? `${min}€` : `${min}–${max}€`;
  if (min != null) return `από ${min}€`;
  if (max != null) return `έως ${max}€`;
  return null;
}

export default async function ClubPage({ params }: { params: { slug: string } }) {
  const club = await getClubBySlug(params.slug);
  if (!club) notFound();
  const [sports, teams, achievements, photos] = await Promise.all([
    getSportsBySlugs(club.sport_slugs ?? []),
    getClubTeams(club.id),
    getClubAchievements(club.id),
    getClubPhotos(club.id),
  ]);

  const place = [club.address, club.city, club.region].filter(Boolean).join(", ");
  const mapQuery = encodeURIComponent(
    [club.address, club.city, club.region].filter(Boolean).join(", ") ||
      `${club.name} ${club.city ?? ""}`
  );
  const fee = feeText(club.annual_fee_min, club.annual_fee_max);

  const myteamUrl = club.myteam_slug
    ? `${MYTEAM_BASE}/create-profile?club=${encodeURIComponent(club.myteam_slug)}&registration=1`
    : MYTEAM_BASE;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    name: club.name,
    url: `${SITE_URL}/sullogoi/${club.slug}`,
    ...(club.phone ? { telephone: club.phone } : {}),
    ...(club.email ? { email: club.email } : {}),
    ...(club.website ? { sameAs: [club.website, club.socials?.facebook, club.socials?.instagram].filter(Boolean) } : {}),
    ...(club.city || club.region
      ? {
          address: {
            "@type": "PostalAddress",
            ...(club.address ? { streetAddress: club.address } : {}),
            ...(club.city ? { addressLocality: club.city } : {}),
            ...(club.region ? { addressRegion: club.region } : {}),
            ...(club.postal_code ? { postalCode: club.postal_code } : {}),
            addressCountry: "GR",
          },
        }
      : {}),
    ...(sports.length ? { sport: sports.map((s) => s.name) } : {}),
  };

  return (
    <div className="container-x py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-brand">Αρχική</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{club.name}</span>
      </nav>

      {club.cover_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={club.cover_url} alt={club.name} className="mb-6 h-48 w-full rounded-2xl object-cover sm:h-64" />
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {club.logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={club.logo_url} alt={club.name} className="h-14 w-14 rounded-xl border object-cover" />
              )}
              <h1 className="text-3xl font-bold text-slate-900">{club.name}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {club.club_type && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {club.club_type}
                </span>
              )}
              {club.has_myteam && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  Διαθέσιμο στο myTeam
                </span>
              )}
            </div>
          </div>
          {place && <p className="mt-2 text-slate-600">{place}</p>}

          {club.description && <p className="mt-6 leading-relaxed text-slate-700">{club.description}</p>}

          {sports.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Αθλήματα</h2>
              <div className="flex flex-wrap gap-2">
                {sports.map((s) => (
                  <Link key={s.slug} href={`/athlimata/${s.slug}`}
                    className="rounded-full border bg-white px-3 py-1 text-sm text-slate-700 hover:border-brand hover:text-brand">
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {teams.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Ομάδες & τμήματα</h2>
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <tbody>
                    {teams.map((t) => (
                      <tr key={t.id} className="border-b last:border-0">
                        <td className="px-4 py-2.5 font-medium text-slate-800">{t.name}</td>
                        <td className="px-4 py-2.5 text-slate-500">
                          {[t.gender, t.age_group].filter(Boolean).join(" · ")}
                        </td>
                        <td className="px-4 py-2.5 text-right text-xs text-slate-400">
                          {t.registration_opens_at ? `Εγγραφές: ${t.registration_opens_at}` : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {photos.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Φωτογραφίες</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {photos.map((p) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={p.id} src={p.url} alt={club.name} className="h-32 w-full rounded-lg object-cover sm:h-36" />
                ))}
              </div>
            </div>
          )}

          {achievements.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Επιτεύγματα</h2>
              <ul className="space-y-1.5">
                {achievements.map((a) => (
                  <li key={a.id} className="flex items-baseline gap-2 text-slate-700">
                    <span aria-hidden>🏆</span>
                    {a.year && <span className="text-sm font-medium text-slate-400">{a.year}</span>}
                    <span>{a.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {place && (
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Τοποθεσία</h2>
              <div className="overflow-hidden rounded-xl border">
                <iframe
                  title="Χάρτης"
                  width="100%"
                  height="280"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            {/* CTA */}
            {club.has_myteam ? (
              <div className="rounded-xl border bg-white p-5">
                <h2 className="text-lg font-semibold text-slate-900">Εγγραφή online</h2>
                <p className="mt-1 text-sm text-slate-600">Ο σύλλογος χρησιμοποιεί το myTeam.</p>
                <a href={myteamUrl} target="_blank" rel="noopener noreferrer"
                  className="mt-4 block rounded-lg bg-brand px-5 py-2.5 text-center font-medium text-white transition hover:bg-brand-dark">
                  Εγγραφή στο myTeam →
                </a>
              </div>
            ) : club.registration_url ? (
              <div className="rounded-xl border bg-white p-5">
                <h2 className="text-lg font-semibold text-slate-900">Εγγραφή online</h2>
                <a href={club.registration_url} target="_blank" rel="noopener noreferrer"
                  className="mt-4 block rounded-lg bg-brand px-5 py-2.5 text-center font-medium text-white transition hover:bg-brand-dark">
                  Φόρμα εγγραφής →
                </a>
              </div>
            ) : (
              <RegistrationForm clubId={club.id} clubName={club.name} />
            )}

            {/* Info card */}
            {(club.phone || club.email || club.website || club.socials?.instagram || club.socials?.facebook ||
              club.contact_name || fee || club.registration_opens_at) && (
              <div className="rounded-xl border bg-white p-5 text-sm">
                <h2 className="mb-3 font-semibold text-slate-900">Στοιχεία</h2>
                <dl className="space-y-2 text-slate-700">
                  {club.registration_opens_at && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-400">Έναρξη εγγραφών</dt>
                      <dd>{club.registration_opens_at}</dd>
                    </div>
                  )}
                  {fee && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-400">Ετήσιο κόστος</dt>
                      <dd>{fee}</dd>
                    </div>
                  )}
                  {club.contact_name && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-400">{club.contact_role || "Επικοινωνία"}</dt>
                      <dd>{club.contact_name}</dd>
                    </div>
                  )}
                  {club.phone && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-400">Τηλέφωνο</dt>
                      <dd><a href={`tel:${club.phone}`} className="text-brand hover:underline">{club.phone}</a></dd>
                    </div>
                  )}
                  {club.email && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-400">Email</dt>
                      <dd><a href={`mailto:${club.email}`} className="text-brand hover:underline">{club.email}</a></dd>
                    </div>
                  )}
                </dl>
                <div className="mt-3 flex flex-wrap gap-3 border-t pt-3">
                  {club.website && <a href={club.website} target="_blank" rel="nofollow noopener" className="text-brand hover:underline">Ιστότοπος</a>}
                  {club.socials?.facebook && <a href={club.socials.facebook} target="_blank" rel="nofollow noopener" className="text-brand hover:underline">Facebook</a>}
                  {club.socials?.instagram && <a href={club.socials.instagram} target="_blank" rel="nofollow noopener" className="text-brand hover:underline">Instagram</a>}
                </div>
              </div>
            )}

            {club.gga_code && <p className="px-1 text-xs text-slate-400">Κωδικός ΓΓΑ: {club.gga_code}</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
