import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SportsClubs by myTeam — Αθλητικά σωματεία Ελλάδας",
    template: "%s | SportsClubs by myTeam",
  },
  description:
    "Βρες αθλητικά σωματεία σε όλη την Ελλάδα ανά άθλημα και περιοχή. Εγγραφή online ή αίτημα εγγραφής στον σύλλογο.",
  openGraph: {
    type: "website",
    locale: "el_GR",
    siteName: "SportsClubs by myTeam",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <body>
        <header className="border-b bg-white">
          <div className="container-x flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="8" fill="#1f6feb" />
                <circle cx="16" cy="16" r="8.5" fill="none" stroke="#fff" strokeWidth="2" />
                <path d="M16 7.5v17M7.5 16h17M9.6 9.6l12.8 12.8M22.4 9.6L9.6 22.4" stroke="#fff" strokeWidth="1.3" opacity="0.9" />
              </svg>
              <span className="text-lg font-bold leading-none text-slate-900">
                SportsClubs <span className="font-medium text-slate-400">by</span>{" "}
                <span className="text-brand">myTeam</span>
              </span>
            </Link>
            <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
              <Link href="/athlimata" className="hover:text-brand">Αθλήματα</Link>
              <Link href="/perioxes" className="hover:text-brand">Περιοχές</Link>
            </nav>
          </div>
        </header>

        <main className="min-h-[70vh]">{children}</main>

        <footer className="mt-16 border-t bg-white">
          <div className="container-x py-8 text-sm text-slate-500">
            <p>
              SportsClubs by myTeam — κατάλογος αθλητικών σωματείων Ελλάδας. Δεδομένα βάσει μητρώου ΓΓΑ.
            </p>
            <p className="mt-1">© {new Date().getFullYear()} myTeam — Όλα τα δικαιώματα διατηρούνται.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
