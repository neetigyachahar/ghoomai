# Mobile (`apps/mobile`)

Expo app sharing screens with web via `@repo/widgets`. API calls use `EXPO_PUBLIC_API_BASE_URL`.

## Local development

```bash
bun run start
```

Copy `.env.development.local` from `.env.example` for the Functions emulator URL.

## Share a demo build (EAS — no app store)

Installable preview APK + OTA updates via EAS. All commands run from **`apps/mobile`**.

### One-time setup

```bash
cd apps/mobile
eas login
bun run eas:init          # links project on expo.dev, sets projectId in app.config.ts
```

### Build & share

```bash
# Cloud build — shareable install URL on expo.dev (~30 day artifact retention)
bun run build:preview

# Local build — APK written to dist/ghoomai-preview.apk
# Requires Android SDK (Android Studio). Script sets ANDROID_HOME automatically on Mac.
bun run build:preview:local
```

If local builds are painful, use the cloud build instead (no Android SDK needed):

```bash
bun run build:preview
```

**Monorepo note:** EAS uploads from the git repo root. Commit `packages/` and `bun.lock` before building. The `eas-build-pre-install` script runs `bun install` at the monorepo root so `@repo/*` workspace packages resolve.

When the cloud build finishes, open the link in the EAS dashboard and share the **QR code / install URL**.

### Push JS updates (no rebuild)

```bash
bun run update:preview -- "Fix demo layout"
```

Users with the preview build receive the update on next launch.

### Build profiles

| Profile | Purpose |
|---------|---------|
| `preview` | Internal APK — standalone demo, `channel: preview` |
| `development` | Dev client — `channel: development`, EAS Update QR |
| `production` | Store builds (future) |

API URL for all EAS builds is set in `eas.json` → `EXPO_PUBLIC_API_BASE_URL` (production Firebase Functions).

## API configuration

| File | Used by |
|------|---------|
| `.env.development.local` | `expo start` (emulator URL) |
| `.env.production` | local reference; EAS builds use `eas.json` env |
| `eas.json` `env` | EAS Build / EAS Update |

Origin only — no `/api` suffix:

```env
EXPO_PUBLIC_API_BASE_URL=https://ghoomaiapi-4rohetcyjq-uc.a.run.app
```

## Physical devices (local dev)

Use LAN IP or emulator URL — `localhost` won't work from a physical phone. Android emulator uses `10.0.2.2` instead of `127.0.0.1`.
