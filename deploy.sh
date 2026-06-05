#!/usr/bin/env bash
# Deploy στο Netlify site "athlitika-somateia" (χτίζει τοπικά, κάνει deploy στο cloud).
# Τρέξε από τον φάκελο του project:  bash deploy.sh
set -e

SITE_ID="2b531ac1-60d1-493a-990f-987cbee6e8b2"
SITE_URL="https://athlitika-somateia.netlify.app"

# Διάβασε τα env vars από το .env.local
set -a
. ./.env.local
set +a

echo "→ Σύνδεση με το Netlify site…"
npx --yes netlify link --id "$SITE_ID"

echo "→ Ορισμός env vars στο Netlify…"
npx netlify env:set NEXT_PUBLIC_SUPABASE_URL "$NEXT_PUBLIC_SUPABASE_URL" >/dev/null
npx netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "$NEXT_PUBLIC_SUPABASE_ANON_KEY" >/dev/null
npx netlify env:set NEXT_PUBLIC_SITE_URL "$SITE_URL" >/dev/null
npx netlify env:set NEXT_PUBLIC_MYTEAM_BASE_URL "$NEXT_PUBLIC_MYTEAM_BASE_URL" >/dev/null

echo "→ Build + deploy (production)…"
npx netlify deploy --build --prod

echo "✓ Έτοιμο: $SITE_URL"
