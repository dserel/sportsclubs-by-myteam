#!/usr/bin/env bash
# Ανεβάζει το project στο GitHub (για αυτόματο deploy μέσω Netlify).
# Τρέξε από τον φάκελο του project:  bash setup-github.sh
set -e

REPO_NAME="sportsclubs-by-myteam"

# 1) Καθάρισε τυχόν κλειδώματα git και κάνε commit τα πάντα
rm -f .git/index.lock .git/HEAD.lock .git/objects/maintenance.lock 2>/dev/null || true
git add -A
git commit -m "SportsClubs by myTeam — rebrand + admin CRUD" || echo "(τίποτα νέο για commit)"
git branch -M main

# 2) Δημιούργησε το repo στο GitHub και κάνε push
if command -v gh >/dev/null 2>&1; then
  echo "→ Δημιουργία ιδιωτικού repo μέσω GitHub CLI…"
  gh repo create "$REPO_NAME" --private --source=. --remote=origin --push
  echo "✓ Ανέβηκε στο GitHub: $(gh repo view --json url -q .url 2>/dev/null)"
else
  echo "⚠ Δεν βρέθηκε το GitHub CLI (gh)."
  echo "  Φτιάξε ένα κενό repo στο https://github.com/new (όνομα: $REPO_NAME) και τρέξε:"
  echo "    git remote add origin https://github.com/<USERNAME>/$REPO_NAME.git"
  echo "    git push -u origin main"
fi
