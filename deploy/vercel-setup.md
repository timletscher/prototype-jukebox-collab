# Vercel Preview Setup

This document explains how to enable preview deployments for PRs using Vercel and the included GitHub Action.

Steps to enable preview deployments

1. Create a Vercel account and import this GitHub repository (https://vercel.com).

2. Obtain a Vercel Token:
   - In Vercel, go to Settings → Tokens and create a new Personal Token. Copy it.

3. (Optional) Obtain `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`:
   - Run `vercel projects ls --token <TOKEN>` or get them from the Vercel project dashboard (Project Settings → General → Project ID / Team ID).
   - These are optional — the Action can deploy without them in many cases, but providing them makes the deployment deterministic.

4. Add repository secrets on GitHub:
   - Go to the repository → Settings → Secrets → Actions and add the following secrets:
     - `VERCEL_TOKEN` → the token from step 2
     - `VERCEL_ORG_ID` → (optional) organization/team id
     - `VERCEL_PROJECT_ID` → (optional) project id

5. Workflow behavior
   - The workflow `.github/workflows/vercel-preview.yml` runs for pull requests and will:
     - Checkout the code
     - Run `npm ci` and `npm run build`
     - Trigger a preview deploy via the Vercel Action

6. After the workflow runs
   - The Vercel Action will create a preview deployment; check the Actions run logs or the Vercel dashboard for the generated preview URL.

Notes & security

- Do not commit `.env` or sensitive files — they are ignored by `.vercelignore` and the workflow.
- If you prefer to allow Vercel to manage deployments directly (and avoid adding `VERCEL_TOKEN`), you can connect the GitHub repo from the Vercel web UI and enable GitHub App deployments instead.

Troubleshooting

- If the Action fails with authentication errors, confirm `VERCEL_TOKEN` is valid and has appropriate scope.
- If Vercel cannot detect the framework, ensure `package.json` has the `build` script (`npm run build`) and the app uses Next.js conventions (it does for this project).
