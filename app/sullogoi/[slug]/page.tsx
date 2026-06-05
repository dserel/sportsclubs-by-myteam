import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import RegistrationForm from "@/components/RegistrationForm";
import { getClubBySlug } from "@/lib/queries";

export const revalidate = 86400;
// 6.500+ σελίδες: παράγονται on-demand (ISR) και cache-άρονται.
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
  const res = await getClubBySlug(params.slug);
  if (!res) return {};
  const { club } = res;
  const place = [club.city, club.region].filter(Boolean).join(", ");
  const title = club.name;
  const description = `${club.name}${place ? ` — ${place}` : ""}. ${
    club.sport_slugs?.length ? `Αθλήματα: ${club.sport_slugs.join(", ")}. ` : ""
  }Πληροφορίες και εγγραφή.`;
  return {
    title,
    description,
    alternates: { canonical: `/sullogoi/${club.slug}` },
    openGraph: { title, description, type: "website", url: `${SITE_URL}/sullogoi/${club.slug}` },
  };
}

export default async function ClubPage({ params }: { params: { slug: string } }) {
  const res = await getClubBySlug(params.slug);
  if (!res) notFound();
  const { club, myteam } = res;
  const place = [club.address, club.city, club.region].filter(Boolean).join(", ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    name: club.name,
    url: `${SITE_URL}/sullogoi/${club.slug}`,
    ...(club.phone ? { telephone: club.phone } : {}),
    ...(club.email ? { email: club.email } : {}),
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
    ...(club.sport_slugs?.length ? { sport: club.sport_slugs } : {}),
  };

  const myteamUrl = myteam?.slug ? `${MYTEAM_BASE}/${myteam.slug}` : MYTEAM_BASE;

  return (
    <div className="container-x py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-brand">Αρχική</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{club.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl font-bold text-slate-900">{club.name}</h1>
            {club.has_myteam && (
              <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                Διαθέσιμο στο myTeam
              </span>
            )}
          </div>
          {place && <p className="mt-2 text-slate-600">{place}</p>}
          {club.gga_code && (
            <p className="mt-1 text-xs text-slate-400">Κωδικός ΓΓΑ: {club.gga_code}</p>
          )}

          {club.description && (
            <p className="mt-6 leading-relaxed text-slate-700">{club.description}</p>
          )}

          {club.sport_slugs?.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Αθλήματα
              </h2>
              <div className="flex flex-wrap gap-2">
                {club.sport_slugs.map((s) => (
                  <Link
                    key={s}
                    href={`/athlimata/${s}`}
                    className="rounded-full border bg-white px-3 py-1 text-sm text-slate-700 hover:border-brand hover:text-brand"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(club.phone || club.email || club.website) && (
            <div className="mt-6 space-y-1 text-sm text-slate-700">
              {club.phone && <p>Τηλέφωνο: {club.phone}</p>}
              {club.email && <p>Email: {club.email}</p>}
              {club.website && (
                <p>
                  Ιστότοπος:{" "}
                  <a href={club.website} className="text-brand hover:underline" rel="nofollow">
                    {club.website}
                  </a>
                </p>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <aside className="lg:col-span-1">
          <div className="sticky top-6">
            {club.has_myteam ? (
              <div className="rounded-xl border bg-white p-5">
                <h2 className="text-lg font-semibold text-slate-900">Εγγραφή online</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Ο σύλλογος χρησιμοποιεί το myTeam. Κάνε εγγραφή απευθείας.
                </p>
                <a
                  href={myteamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block rounded-lg bg-brand px-5 py-2.5 text-center font-medium text-white transition hover:bg-brand-dark"
                >
                  Εγγραφή στο myTeam →
                </a>
              </div>
            ) : (
              <RegistrationForm clubId={club.id} clubName={club.name} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
