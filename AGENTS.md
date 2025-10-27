# Repository Guidelines

## Project Structure & Module Organization
Next.js 16 with the App Router anchors the app under `app/`, one folder per route segment (e.g., `app/(marketing)/pricing/page.tsx`). Shared primitives live in `components/`, feature-level bundles in `features/`, reusable hooks in `hooks/`, and domain utilities in `lib/`. Static assets, icons, and favicons reside in `public/`. Supabase schema changes must land in `supabase/migrations/`, and handoff docs belong in `docs/`. Co-locate segment-specific styles, loaders, or mock data with their route folder for quick discovery.

## Build, Test, and Development Commands
- `npm install` – install dependencies.
- `npm run dev` – start the dev server at `http://localhost:3000` with hot reload.
- `npm run build` – run the production compilation to surface routing, lint, or type issues.
- `npm run start` – serve the built output for staging verification.
- `npm run lint` – run ESLint with the Next.js config; do this before every PR.

## Coding Style & Naming Conventions
Write TypeScript React 19 components with 2-space indentation and ASCII characters. Name components and feature files in PascalCase (e.g., `HeroBanner.tsx`), hooks in camelCase prefixed with `use` (e.g., `useSupabaseUser.ts`), and keep Tailwind utility groups ordered semantically (layout → spacing → color). Prefer functional components, avoid implicit `any`, and leverage shadcn-inspired primitives from `components/` before rolling custom UI. Update ESLint, Tailwind, or TS configs in sync with framework upgrades.

## Testing Guidelines
No automated harness ships yet; rely on linting plus manual QA. Always run `npm run lint`, smoke-test core journeys in `npm run dev`, and capture console/network logs for regressions. If you introduce automated tests, colocate them in `__tests__/` near the feature, adopt Playwright for e2e flows, and choose titles that describe user intent rather than implementation.

## Commit & Pull Request Guidelines
Package changes into focused commits with imperative subjects (e.g., `Add pricing carousel data`). PRs must explain scope, link Jira/Linear tickets, list the validation checklist (lint, manual scenario), and attach screenshots or recordings for UI updates. Tag reviewers who own the touched area and wait for at least one approval before merge.

## Supabase & Environment Tips
Never commit secrets; keep them in `.env.local`. Apply schema changes via Supabase CLI migrations stored in `supabase/migrations/`, and document new tables or policies in `docs/` so others can sync before running migrations.
