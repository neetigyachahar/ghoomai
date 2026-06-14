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
| Atoms | `@repo/ui` | `*.types.ts`, `*.web.tsx`, `*.mobile.tsx`. UI-only hooks stay here. |
| Logic | `@repo/hooks` | `context/` (internal), `hooks/<feature>/` (public). **No UI.** |
| UI | `@repo/widgets` | `widgets/`, `screens/`, `registry.ts`, `renderer.tsx` |
| Apps | `apps/web`, `apps/mobile` | Routing shells only. Mount screens; pass navigation props. |

## Dependency rules (never violate)

```
@repo/types          → (nothing)
@repo/hooks          → @repo/types
@repo/widgets        → @repo/types, @repo/hooks, @repo/ui
@repo/hooks          ✗ @repo/widgets   (circular)
apps                 → @repo/widgets    (not @repo/ui for UI composition)
widgets              ✗ @repo/hooks/context/*
```

## Feature build order

Execute in this order. Do not skip layers or put logic in the wrong package.

```
- [ ] 1. @repo/types — shared types (if needed)
- [ ] 2. @repo/ui — atoms/molecules (web + mobile, matching visuals; desktop-friendly web)
- [ ] 3. @repo/hooks — context (internal), server helpers (internal), public hooks + provider re-exports
- [ ] 4. @repo/widgets/widgets/ — organism widget(s); compose @repo/ui + @repo/hooks/<feature>
- [ ] 5. registry.ts — register widget keys + AI metadata (description, props, slots)
- [ ] 6. @repo/widgets/screens/ — full-page screen(s) as **single cross-platform .tsx files**
- [ ] 7. Apps — mount screens, pass routing props; web API routes for server logic only
```

## Package patterns

### `@repo/types`

```
packages/types/src/<domain>.ts
packages/types/src/index.ts
```

Types only. No imports from other packages.

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
    ├── index.ts                             # public: Provider + hooks only
    └── server.ts                            # optional; app API routes only
```

- Public API: **Provider + hooks only**. Never export context, stores, or internal helpers from `index.ts`.
- Server-only code (Anthropic SDK, etc.): export via `@repo/hooks/<feature>/server`.
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

**Web** — thin route files only:

```tsx
// layout.tsx — shared provider shell if needed
// page.tsx
import { SomeScreen } from "@repo/widgets/screens/<name>";
// pass useRouter navigation callbacks only
```

**Mobile** — same screen imports; routing differs, **never duplicate screen files**.

Mobile dev API: use `getAiApiEndpoint()` pattern (`10.0.2.2` for Android emulator). See `apps/mobile/src/constants/api.ts`.

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
| Put types in hooks/widgets when shared | Put in `@repo/types` |
| Create separate web/mobile screen files | One screen `.tsx` for both platforms |
| Add `dark:` Tailwind variants on web | Light mode only; set `color-scheme: light` |
| Expose API keys to client | Server route in `apps/web/app/api/*` + env |
| Import registry in `@repo/hooks` | Pass registry from widgets/screens or apps |

## Verification before finishing

- [ ] Types have zero package dependencies
- [ ] New hook feature exports only Provider + hooks publicly
- [ ] Widget registered in `registry.ts` with AI metadata if AI-facing
- [ ] Screen exported in `packages/widgets/package.json`
- [ ] Apps contain routing only — no inline forms, inputs, or widget trees
- [ ] Web + mobile import the **same** screen component
- [ ] `check-types` passes in touched packages
- [ ] ARCHITECTURE.md updated if a new pattern was introduced

## Reference

Full diagrams, examples, and public API table: [packages/widgets/ARCHITECTURE.md](packages/widgets/ARCHITECTURE.md)
