# Ghoomai

AI-powered trip planning monorepo. Shared UI and business logic live in `packages/`; platform apps are thin routing shells.

## Repository layout

| Path | Purpose |
|------|---------|
| `apps/web` | Next.js static export → Firebase Hosting |
| `apps/mobile` | Expo (iOS, Android, web) |
| `apps/functions` | Firebase Cloud Function (`ghoomaiApi`) — all `/api/*` routes |
| `packages/api` | Server handlers, AI orchestration, travel APIs (`@repo/api`) |
| `packages/widgets` | Screens, widgets, registry (`@repo/widgets`) |
| `packages/hooks` | Client state and feature hooks (`@repo/hooks`) |
| `packages/ui` | Cross-platform atoms (`@repo/ui`) |
| `packages/types` | Shared types (`@repo/types`) |

Architecture details: [packages/widgets/ARCHITECTURE.md](packages/widgets/ARCHITECTURE.md)

## Prerequisites

- [Bun](https://bun.sh) (package manager)
- [Firebase CLI](https://firebase.google.com/docs/cli) (deploy + emulators)

## Local development

```bash
bun install

# Web (Next.js dev server)
bun run --cwd apps/web dev

# Mobile (Expo)
bun run --cwd apps/mobile start

# API (Firebase Functions emulator)
bun run --cwd apps/functions dev
```

### API during local dev

The web app is a **static export** in production — it has no server-side API routes. Locally, point clients at the Functions emulator:

**Web** — copy emulator URL to `apps/web/.env.development.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5001/ghoomai/us-central1/ghoomaiApi
```

**Mobile** — copy to `apps/mobile/.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:5001/ghoomai/us-central1/ghoomaiApi
```

**Functions** — copy `apps/functions/.env.example` → `apps/functions/.env` and set `ANTHROPIC_API_KEY`.

> Do not put `NEXT_PUBLIC_*` values in `apps/web/.env.local` — that file is loaded during `next build` and overrides `.env.production`.

## Deployment

Firebase project: `ghoomai` (see `.firebaserc`).

```bash
# Build + deploy everything
firebase deploy

# Deploy individually
firebase deploy --only hosting    # static web → ghoomai.web.app
firebase deploy --only functions  # API → Cloud Run
```

### Before first deploy

1. **Web** — copy `apps/web/.env.example` → `apps/web/.env.production` with your Functions URL (`https://….a.run.app`).
2. **Functions** — set the API key:
   ```bash
   firebase functions:secrets:set ANTHROPIC_API_KEY
   ```
3. **Functions** — ensure public invoker is enabled (`invoker: "public"` in `apps/functions/src/index.ts`).

Hosting predeploy runs `next build` (static export to `apps/web/out`). Functions predeploy bundles `@repo/api` via esbuild and strips workspace deps from `package.json` for Cloud Build.

### Mobile demo (EAS)

Share an installable preview APK without app stores. See `apps/mobile/README.md`.

```bash
cd apps/mobile
bun run build:preview          # internal Android APK
bun run update:preview -- "msg"  # OTA update after install
```

Project: [expo.dev/accounts/neetigyachahar/projects/ghoomai](https://expo.dev/accounts/neetigyachahar/projects/ghoomai)

## Scripts

```bash
bun run build          # turbo build all packages
bun run dev            # turbo dev
bun run lint           # turbo lint
bun run check-types    # turbo typecheck
```
