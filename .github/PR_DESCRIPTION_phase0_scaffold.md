## Phase 0: Team Jukebox — Scaffold + TypeScript pin

Summary
- Scaffolds a minimal Next.js (App Router) + TypeScript Phase 0 app.
- Pins `typescript` to `5.9.3` (exact) and commits the regenerated `package-lock.json` to ensure reproducible installs across CI and Vercel.

Why
- Vercel previews were failing due to inconsistent TypeScript resolution (remote ETARGET / EOVERRIDE errors).
- Pinning to an exact `typescript@5.9.3` and committing the lockfile makes installs deterministic and resolves the preview install errors.

What changed
- `package.json` — devDependency: `typescript` pinned to `5.9.3` (exact); removed `overrides`.
- `package-lock.json` — regenerated and committed.
- Added Phase 0 Next.js scaffold files (App Router + TypeScript).
- Added PR preview workflow, `.vercelignore`, and `deploy/vercel-setup.md`.

Verification
- Local: `npm install`, `npm run typecheck`, and `npm run build` all completed successfully.
- Local dev: `npm run dev` runs and served the app; smoke test HTML captured.
- Remote: Vercel preview now installs and deploys successfully. Preview URL: <INSERT_PREVIEW_URL_HERE>

Follow-ups / TODOs
- Run `npm audit` and address any critical vulnerabilities.
- Add Vercel secrets to repository (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID) for reproducible manual redeploys if needed.
- If any future EOVERRIDE issues reappear, fetch the Vercel npm debug log (path printed in Vercel log) and identify the transitive package requiring a different TypeScript range.
- Update the PR description with the actual preview URL and any CI run links.

Notes for reviewers
- The lockfile is intentionally committed to preserve exact resolution used to reproduce the successful Vercel preview.
- If you prefer a different approach (e.g., allowlist a narrower set of transitive packages), mention it in review so we can address it in a follow-up.

Commands used for verification (run locally):
```bash
npm install
npm run typecheck
npm run build
npm run dev          # dev server smoke test
```

If you want, I can update this file with the live preview URL and link to the successful CI run once you paste them here.
