# Web (`apps/web`)

Next.js app deployed as a **static export** to Firebase Hosting. All API calls go to the Firebase Function configured via `NEXT_PUBLIC_API_BASE_URL`.

## Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

For API calls during dev, create `.env.development.local` (see `.env.example`) pointing at the Functions emulator or deployed API.

## Build

```bash
bun run build   # outputs static files to out/
```

`next.config.ts` sets `output: "export"`. There are no API routes — the web app is a client-only shell around `@repo/widgets` screens.

## Environment files

| File | Used by | Purpose |
|------|---------|---------|
| `.env.production` | `next build`, Firebase deploy | Production API URL (baked into JS bundle) |
| `.env.development.local` | `next dev` only | Emulator or local API URL |
| `.env.example` | — | Template and documentation |

**Important:** never put environment-specific `NEXT_PUBLIC_*` values in `.env.local` — Next.js loads that file during production builds and it overrides `.env.production`.

## Deploy

Deployed via root Firebase config:

```bash
firebase deploy --only hosting
```

Predeploy runs `bun run build` automatically. Ensure `.env.production` exists with the correct `NEXT_PUBLIC_API_BASE_URL` before deploying.
