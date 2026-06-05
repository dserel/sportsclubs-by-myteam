import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Αθλητικά Σωματεία Ελλάδας — Κατάλογος Συλλόγων",
    template: "%s | Αθλητικά Σωματεία Ελλάδας",
  },
  description:
    "Βρες αθλητικά σωματεία σε όλη την Ελλάδα ανά άθλημα και περιοχή. Εγγραφή online ή αίτημα εγγραφής στον σύλλογο.",
  openGraph: {
    type: "website",
    locale: "el_GR",
    siteName: "Αθλητικά Σωματεία Ελλάδας",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <body>
        <header className="border-b bg-white">
          <div className="container-x flex h-16 items-center justify-between">
            <Link href="/" className="text-lg font-bold text-brand">
              Αθλητικά Σωματεία<span className="text-slate-400">.gr</span>
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
              Κατάλογος αθλητικών σωματείων Ελλάδας. Δεδομένα βάσει μητρώου ΓΓΑ.
            </p>
            <p className="mt-1">© {new Date().getFullYear()} — Όλα τα δικαιώματα διατηρούνται.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
