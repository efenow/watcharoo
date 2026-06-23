# Watcharoo

Watcharoo is a streaming service finder — search any movie or TV show and instantly see where it's streaming in your country, powered by the TMDB API.

## Run & Operate

- `pnpm --filter @workspace/watcharoo run dev` — run the frontend (port assigned by workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required env: `VITE_TMDB_TOKEN` — TMDB Read Access Token (secret)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, framer-motion
- Routing: wouter
- Data fetching: TanStack React Query
- Icons: lucide-react, react-icons/si
- API: TMDB v3 (direct from browser, no backend)
- Static hosting compatible (Vercel, Netlify, etc.)

## Where things live

- `artifacts/watcharoo/` — the main web app
- `artifacts/watcharoo/src/lib/tmdb.ts` — TMDB API client + all types
- `artifacts/watcharoo/src/pages/` — Home, MovieDetail, TVDetail, Search
- `artifacts/watcharoo/src/components/` — Navbar, Footer, MediaCard, WatchProviders, CountrySelector, SkeletonCard
- `artifacts/watcharoo/src/hooks/useCountry.ts` — country detection + localStorage persistence
- `attached_assets/` — logo PNGs and TMDB SVG (imported via @assets alias)

## Architecture decisions

- Pure static frontend — all TMDB API calls happen in the browser using Bearer token from `VITE_TMDB_TOKEN`
- No backend, no database — fully deployable to Vercel/Netlify for free
- Country is auto-detected via ipapi.co on first visit, then stored in localStorage
- TMDB watch providers are keyed by ISO country code (e.g. "US", "GB")
- TMDB images use `https://image.tmdb.org/t/p/{size}{path}` (w500 for posters, original for backdrops)

## Product

- Home page: hero search, trending this week, popular movies, popular TV
- Search page: multi-search with Movie/TV filters
- Movie detail: backdrop, poster, metadata, WHERE TO WATCH (by country), cast, trailers, similar titles
- TV detail: same as movie, adapted for series (seasons, status, network)
- Country selector: 35+ countries, auto-detected from IP, persisted to localStorage

## User preferences

- Dark-only design — very dark grey background (#141414), primary color #C43E0D
- Inter SemiBold 600 for titles, Inter Regular 400 for body
- TMDB SVG logo in footer must be greyed out, linking to https://themoviedb.org
- TMDB API key kept in VITE_TMDB_TOKEN secret — never hardcode in source

## Gotchas

- `VITE_TMDB_TOKEN` must be prefixed with `VITE_` to be available in the browser via `import.meta.env`
- Google Fonts `@import url(...)` must be the very first line of index.css (before `@import "tailwindcss"`)
- The `@assets` Vite alias points to `attached_assets/` at the repo root
- For static Vercel deployment, add `vercel.json` with rewrites to handle client-side routing

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- TMDB API docs: https://developer.themoviedb.org/docs
