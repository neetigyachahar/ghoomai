# Mobile (`apps/mobile`)

Expo app sharing screens with web via `@repo/widgets`. API calls use `EXPO_PUBLIC_API_BASE_URL` or auto-detect a local dev host.

## Development

```bash
bun run start
```

## API configuration

Copy `.env.example` → `.env` and set the API origin (no `/api` suffix — paths are appended by `@repo/hooks`):

```env
# Deployed Functions (Gen 2 Cloud Run URL)
EXPO_PUBLIC_API_BASE_URL=https://ghoomaiapi-4rohetcyjq-uc.a.run.app

# Or local emulator
# EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:5001/ghoomai/us-central1/ghoomaiApi
```

When `EXPO_PUBLIC_API_BASE_URL` is unset, `getApiBase()` in `src/constants/api.ts` auto-detects the dev machine (Expo dev server IP, `10.0.2.2` for Android emulator). Start the Functions emulator or set the env var explicitly for API calls to work.

## Physical devices

Use your machine's LAN IP or the Functions emulator URL — `localhost` won't work from a physical phone.
