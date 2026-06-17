---
name: builder
description: Builds Ghoomai frontend features using the monorepo layering in packages/widgets/ARCHITECTURE.md. Use when adding features, widgets, screens, hooks, UI atoms, or integrating web/mobile apps in this repo.
---

# Builder

Strict workflow for Ghoomai frontend work. **Read [packages/widgets/ARCHITECTURE.md](packages/widgets/ARCHITECTURE.md) before building** — this skill is the enforced checklist; the architecture doc is the source of truth.

## Layer map

| Layer | Package | Allowed contents |
|-------|---------|------------------|
| Types | `@repo/types` | Type shapes only. **Zero dependencies.** |
| Server APIs | `@repo/api` | AI orchestration, external APIs, tools, route handler logic. **No React, no UI.** |
| Atoms | `@repo/ui` | `*.types.ts`, `*.web.tsx`, `*.mobile.tsx`. UI-only hooks stay here. |
| Logic | `@repo/hooks` | `context/` (internal), `hooks/<feature>/` (public). **No UI, no Anthropic SDK.** |
| UI | `@repo/widgets` | `widgets/`, `screens/`, `registry.ts`, `renderer.tsx` |
| Apps | `apps/web`, `apps/mobile` | Routing shells only. Mount screens; pass navigation props. |

## Dependency rules (never violate)

```
@repo/types          → (nothing)
@repo/api             → @repo/types
@repo/hooks          → @repo/types
@repo/widgets        → @repo/types, @repo/hooks, @repo/ui
@repo/hooks          ✗ @repo/widgets   (circular)
@repo/hooks          ✗ @repo/api        (server logic stays server-side)
apps                 → @repo/widgets (web/mobile routing shells only)
apps/functions       → @repo/api (Firebase Function — sole API server)
widgets              ✗ @repo/hooks/context/*
widgets              ✗ @repo/api
```

## Feature build order

Execute in this order. Do not skip layers or put logic in the wrong package.

```
- [ ] 1. @repo/types — shared types (if needed)
- [ ] 2. @repo/ui — atoms/molecules (web + mobile, matching visuals; desktop-friendly web)
- [ ] 3. @repo/hooks — context (internal), public hooks + provider re-exports
- [ ] 4. @repo/api — server handlers, prompts, tools, and orchestration (when server calls are needed)
- [ ] 5. @repo/widgets/widgets/ — organism widget(s); compose @repo/ui + @repo/hooks/<feature>
- [ ] 6. registry.ts — register widget keys + AI metadata (description, props, slots)
- [ ] 7. @repo/widgets/screens/ — full-page screen(s) as **single cross-platform .tsx files**
- [ ] 8. Apps — mount screens, pass routing props; add handlers to `@repo/api` router (`apps/functions`)
```

## Package patterns

### `@repo/types`

```
packages/types/src/<domain>.ts
packages/types/src/index.ts
```

Types only. No imports from other packages.

### `@repo/api`

```
packages/api/src/
├── index.ts
├── router.ts              # handleApiRequest
├── handlers/ai-routes.ts
├── handlers/travel-routes.ts
├── adapters/node-http.ts
└── run-widget-ai.ts
```

- Server-only. Bundled into `apps/functions` via esbuild.
- Client hooks call `apiBase/api/*` via fetch — they do **not** import `@repo/api`.

### `@repo/ui`

```
packages/ui/src/<name>/
├── <name>.types.ts
├── <name>.web.tsx      # Tailwind, light mode only (no dark: variants)
└── <name>.mobile.tsx   # StyleSheet, match web visually
```

Add export conditions to `packages/ui/package.json` (`react-native`, `types`, `default`).

Web atoms: support desktop layout (`max-w-*`, responsive where relevant).

### `@repo/hooks/<feature>`

```
packages/hooks/src/
├── context/<feature>/<feature>-context.tsx   # internal
└── hooks/<feature>/
    ├── use-<feature>.ts
    └── index.ts                             # public: Provider + hooks only
```

- Public API: **Provider + hooks only**. Never export context, stores, or internal helpers from `index.ts`.
- Client hooks call app API routes via fetch — they do **not** import `@repo/api`.
- Add `"./<feature>": "./src/hooks/<feature>/index.ts"` to `packages/hooks/package.json`.

### `@repo/widgets`

**Widget** (organism, one file all platforms):

```
packages/widgets/src/widgets/<name>.tsx
```

- Compose `@repo/ui/*` — never DOM or RN primitives directly.
- Call `@repo/hooks/<feature>` for state — never import `context/`.
- Receive pre-rendered slot children as props; never walk the content tree.

**Screen** (static page, one file all platforms):

```
packages/widgets/src/screens/<name>-screen.tsx
```

- Compose atoms + hooks. May wrap providers (e.g. read registry, mount `AIProvider`).
- Export via `packages/widgets/package.json` → `"./screens/<name>"`.

**Registry** — every widget gets a stable string key + AI metadata in `registry.ts`.

### Apps

**Web** — static export to Firebase Hosting; thin route files only:

```tsx
// app/providers.tsx — pass apiBase from NEXT_PUBLIC_API_BASE_URL
import { AiFlowShell } from "@repo/widgets/screens/ai-flow";

// app/page.tsx — mount screen, pass navigation callbacks
import { AiPromptScreen } from "@repo/widgets/screens/<name>";
```

**Mobile** — same screen imports; routing differs, **never duplicate screen files**.

API base: `getApiBase()` in `apps/mobile/src/constants/api.ts`. Web uses `NEXT_PUBLIC_API_BASE_URL`. Both point at the Firebase Function (`apiBase/api/*`).

## Content tree rules

- Pages/widgets are driven by `ContentItem` trees from `@repo/types`.
- `ContentRenderer` owns tree walking; widgets render one node + named slots.
- AI-generated layouts must use registered widget keys only.

## Hard prohibitions

| Do NOT | Do instead |
|--------|------------|
| Compose `@repo/ui` or hooks for UI in apps | Mount `@repo/widgets/screens/*` |
| Import `@repo/hooks/context/*` from widgets | Import `@repo/hooks/<feature>` hooks |
| Put business logic in widgets package | Put in `@repo/hooks` |
| Put Anthropic SDK, external API clients, or tool handlers in `@repo/hooks` | Put in `@repo/api` |
| Import `@repo/api` from hooks, widgets, or mobile | `apps/functions` only (bundled server) |
| Put types in hooks/widgets when shared | Put in `@repo/types` |
| Create separate web/mobile screen files | One screen `.tsx` for both platforms |
| Add `dark:` Tailwind variants on web | Light mode only; set `color-scheme: light` |
| Expose API keys to client | `ANTHROPIC_API_KEY` on Functions via Firebase secrets |
| Put `NEXT_PUBLIC_*` in `apps/web/.env.local` | Use `.env.production` (build) or `.env.development.local` (dev) |
| Import registry in `@repo/hooks` or `@repo/api` | Pass registry from widgets/screens or apps |

## Verification before finishing

- [ ] Types have zero package dependencies
- [ ] New hook feature exports only Provider + hooks publicly
- [ ] Server-side handler code lives in `@repo/api`, not `@repo/hooks`
- [ ] Widget registered in `registry.ts` with AI metadata if AI-facing
- [ ] Screen exported in `packages/widgets/package.json`
- [ ] Apps contain routing only — no inline forms, inputs, or widget trees
- [ ] Web + mobile import the **same** screen component
- [ ] `check-types` passes in touched packages
- [ ] ARCHITECTURE.md updated if a new pattern was introduced

## Reference

Full diagrams, examples, and public API table: [packages/widgets/ARCHITECTURE.md](packages/widgets/ARCHITECTURE.md)
