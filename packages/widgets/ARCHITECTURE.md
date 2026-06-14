# Frontend Architecture

This document describes how shared UI, business widgets, and hooks are structured across the Ghoomai monorepo.

## Overview

The frontend is split into three packages following [atomic design](https://bradfrost.com/blog/post/atomic-web-design/) and separation-of-concerns principles:

| Layer | Package | Atomic level | Responsibility |
|-------|---------|--------------|----------------|
| Atoms & molecules | `@repo/ui` | Atoms, molecules | Platform-agnostic API with platform-specific implementations |
| Organisms & pages | `@repo/widgets` | Organisms, pages | Business UI composition, widget registry, and tree rendering |
| Business logic & state | `@repo/hooks` | — | Context, state, and feature hooks (logic only, no UI) |

Apps (`web`, `mobile`) compose **providers** from `@repo/hooks` and render trees via `@repo/widgets`. They do not import `@repo/ui` directly.

```mermaid
flowchart TB
  subgraph apps [Apps]
    Web["apps/web (Next.js)"]
    Mobile["apps/mobile (Expo)"]
  end

  subgraph hooksPkg ["@repo/hooks"]
    Providers[Feature providers]
    FeatureHooks[Feature hooks]
    Context["context/ (internal)"]
  end

  subgraph widgetsPkg ["@repo/widgets"]
    Renderer[ContentRenderer]
    Registry[widgetRegistry]
    Widgets[Widget components]
  end

  subgraph uiPkg ["@repo/ui"]
    Atoms["Atoms: Button, Box, Text"]
    WebImpl["*.web.tsx"]
    MobileImpl["*.mobile.tsx"]
  end

  Web --> Providers
  Mobile --> Providers
  Providers --> Renderer
  Renderer --> Registry
  Registry --> Widgets
  Widgets --> FeatureHooks
  Widgets --> Atoms
  FeatureHooks --> Context
  Atoms --> WebImpl
  Atoms --> MobileImpl
```

---

## Package responsibilities

### `@repo/ui` — atoms & molecules

- Smallest reusable building blocks (buttons, layout primitives, typography, etc.)
- Each component has a **shared types file** and **two implementations**:
  - `*.web.tsx` — DOM / Tailwind (Next.js)
  - `*.mobile.tsx` — React Native (Expo)
- Platform selection happens at **bundle time** via `package.json` export conditions — no runtime switching in app code
- May include **component-scoped hooks** (e.g. `useButtonPress`) that only support that UI primitive — these stay inside `@repo/ui`, not `@repo/hooks`

```
packages/ui/src/
├── button/
│   ├── button.types.ts
│   ├── button.web.tsx
│   └── button.mobile.tsx
├── box/
│   ├── box.types.ts
│   ├── box.web.tsx
│   └── box.mobile.tsx
└── text/
    ├── text.types.ts
    ├── text.web.tsx
    └── text.mobile.tsx
```

**Export pattern** (`packages/ui/package.json`):

```json
"./button": {
  "react-native": "./src/button/button.mobile.tsx",
  "types": "./src/button/button.web.tsx",
  "default": "./src/button/button.web.tsx"
}
```

- **Next.js** resolves `default` → web implementation
- **Expo / Metro** resolves `react-native` → mobile implementation (via `customConditions: ["react-native"]` in tsconfig)

```mermaid
flowchart LR
  subgraph consumer [Import in widget file]
    Import["import { Button } from '@repo/ui/button'"]
  end

  subgraph resolver [Bundler resolves at build time]
    Next["Next.js → button.web.tsx"]
    Metro["Metro → button.mobile.tsx"]
  end

  Import --> Next
  Import --> Metro
```

### `@repo/hooks` — business logic & state

- Owns all **business state** and **feature logic**
- Organised by feature under two internal folders:
  - `context/` — React context providers and context objects (**internal, not part of public API**)
  - `hooks/` — public hooks and provider re-exports per feature
- Widgets and apps consume **hooks only** — never import from `context/` directly
- No UI components in this package

```
packages/hooks/src/
├── index.ts
├── context/                    # internal — not exported via package.json
│   └── demo/
│       └── demo-booking-context.tsx
└── hooks/                      # public API per feature
    └── demo/
        ├── index.ts              # exports provider + hooks
        └── use-demo-booking.ts   # wraps context internally
```

**Public exports** (`packages/hooks/package.json`):

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./demo": "./src/hooks/demo/index.ts"
  }
}
```

The `context/` folder is deliberately **absent from exports**. Consumers import:

```ts
import { DemoBookingProvider, useDemoBooking } from "@repo/hooks/demo";
```

**Context isolation rule:**

| Consumer | May import from `hooks/` | May import from `context/` |
|----------|--------------------------|----------------------------|
| Apps | Yes | No |
| Widgets | Yes | **No** (enforced by ESLint) |
| Other hooks (same package) | Yes | Yes (internal only) |

```mermaid
flowchart TB
  subgraph publicAPI [Public API]
    Provider[DemoBookingProvider]
    Hook[useDemoBooking]
  end

  subgraph internal [Internal — context/]
    Ctx[DemoBookingContext]
    State[useState / useCallback]
  end

  subgraph consumers [Consumers]
    App[apps/web, apps/mobile]
    Widget[demo-action widget]
  end

  App --> Provider
  Provider --> Ctx
  Ctx --> State
  Widget --> Hook
  Hook --> Ctx
```

### `@repo/widgets` — organisms & pages

- Business-specific UI built by composing `@repo/ui` atoms
- May call **feature hooks** from `@repo/hooks/<feature>` for interactive behaviour
- Must **never** import from `@repo/hooks/context/*` (ESLint enforced)
- **Single `.tsx` file per widget** for all platforms
- Widgets are registered in a **map keyed by string ID**
- A **renderer** walks a declarative `ContentItem` tree and composes the final UI

```
packages/widgets/src/
├── types.ts
├── registry.ts
├── renderer.tsx
├── index.ts
└── widgets/
    ├── demo-section.tsx
    └── demo-action.tsx      # uses useDemoBooking hook
```

---

## Widget registry

Every widget is registered by a unique string key in `widgetRegistry`:

```ts
export const widgetRegistry: Record<string, WidgetComponent> = {
  "demo-section": DemoSectionWidget,
  "demo-action": DemoActionWidget,
};
```

| Key | Widget | Role |
|-----|--------|------|
| `demo-section` | `DemoSectionWidget` | Organism — card layout with title and named slots |
| `demo-action` | `DemoActionWidget` | Organism — action button driven by `useDemoBooking` |

To add a new widget:

1. Create `packages/widgets/src/widgets/<name>.tsx`
2. Compose atoms from `@repo/ui/*`
3. Use feature hooks from `@repo/hooks/<feature>` when state/logic is needed
4. Register the component in `registry.ts` under a stable string key

---

## Content tree & renderer

Apps (or a CMS/API) pass a **declarative content object** describing the widget tree. The renderer resolves each node, recursively renders slot children, and passes them as pre-rendered `ReactNode` props.

### `ContentItem` shape

```ts
interface ContentItem {
  key: string;                        // widget ID, e.g. "demo-section"
  props: Record<string, unknown>;     // data props for the widget
  children: ContentChildren | null;   // named slots, or null
}

type ContentChildren = {
  [slot: string]: ContentItem[] | null | undefined;
};
```

### Example tree (with hook-driven props)

```ts
const content: ContentItem = {
  key: "demo-section",
  props: { title: "Ghoomai Widgets" },
  children: {
    children: [
      {
        key: "demo-action",
        props: { label: "Book a hotel", action: "book" },
        children: null,
      },
    ],
    footer: [
      {
        key: "demo-action",
        props: { label: "Learn more", action: "info" },
        children: null,
      },
    ],
  },
};
```

The `action: "book"` prop tells `DemoActionWidget` to call `bookHotel()` from `useDemoBooking` and display the live booking count.

```mermaid
flowchart TB
  Root["demo-section<br/>title: Ghoomai Widgets"]

  subgraph childrenSlot [slot: children]
    Action1["demo-action<br/>action: book"]
  end

  subgraph footerSlot [slot: footer]
    Action2["demo-action<br/>action: info"]
  end

  Root --> childrenSlot
  Root --> footerSlot
```

### Rendering flow

```mermaid
sequenceDiagram
  participant App
  participant Provider as DemoBookingProvider
  participant Renderer as ContentRenderer
  participant Widget as DemoActionWidget
  participant Hook as useDemoBooking

  App->>Provider: wrap content tree
  App->>Renderer: content (ContentItem tree)
  Renderer->>Widget: props + rendered slot ReactNodes
  Widget->>Hook: read bookingCount, bookHotel
  Hook-->>Widget: state + actions
  Widget-->>App: interactive UI
```

**Key rules:**
- Widgets never recurse the tree — the renderer owns all tree walking
- Widgets receive **already-rendered** slot children via props
- Widgets access state via **hooks**, not context objects

---

## Cross-platform widget authoring

Widget files are written **once**. They import from `@repo/ui/*` for presentation and `@repo/hooks/<feature>` for logic.

```tsx
// packages/widgets/src/widgets/demo-action.tsx
import { useDemoBooking } from "@repo/hooks/demo";
import { Button } from "@repo/ui/button";

export function DemoActionWidget({ label, action = "info" }) {
  const { bookingCount, bookHotel } = useDemoBooking();
  // ...
}
```

| Concern | Where it lives |
|---------|----------------|
| DOM vs RN primitives | `@repo/ui` atom implementations |
| Tailwind / class names | `@repo/ui` web atoms + `styles.css` |
| Business state & actions | `@repo/hooks` (context internal, hooks public) |
| Business layout & slots | `@repo/widgets` |
| UI-only helper hooks | `@repo/ui` (component-scoped, optional) |
| Platform conditions in widgets | Inline in widget file, only when needed |

---

## App integration

### Web (`apps/web`)

```tsx
// apps/web/app/demo-widget.tsx
import { DemoBookingProvider } from "@repo/hooks/demo";
import { ContentRenderer, type ContentItem } from "@repo/widgets";

export function DemoWidget() {
  return (
    <DemoBookingProvider>
      <ContentRenderer content={content} />
    </DemoBookingProvider>
  );
}
```

- Dependencies: `@repo/hooks`, `@repo/widgets` (not `@repo/ui` in app code)
- `next.config.ts`: `transpilePackages: ["@repo/ui", "@repo/widgets", "@repo/hooks"]`
- `globals.css` still imports `@repo/ui/styles.css` for Tailwind class scanning

### Mobile (`apps/mobile`)

```tsx
import { DemoBookingProvider } from "@repo/hooks/demo";
import { ContentRenderer, type ContentItem } from "@repo/widgets";

<DemoBookingProvider>
  <ContentRenderer content={widgetContent} />
</DemoBookingProvider>
```

- Dependencies: `@repo/hooks`, `@repo/widgets`
- Metro `watchFolders` covers the monorepo root
- tsconfig `customConditions: ["react-native"]` resolves mobile UI implementations

```mermaid
flowchart LR
  subgraph webApp [apps/web]
    WebDemo[demo-widget.tsx]
  end

  subgraph mobileApp [apps/mobile]
    MobileHome[index.tsx]
  end

  subgraph hooks ["@repo/hooks"]
    DBP[DemoBookingProvider]
  end

  subgraph widgets ["@repo/widgets"]
    CR[ContentRenderer]
  end

  WebDemo --> DBP
  MobileHome --> DBP
  DBP --> CR
```

---

## Adding a new feature (checklist)

1. **`@repo/hooks`** — create `context/<feature>/` (provider + context) and `hooks/<feature>/` (public hook + re-exports)
2. **`@repo/hooks/package.json`** — add `"./<feature>": "./src/hooks/<feature>/index.ts"` export
3. **`@repo/widgets`** — build organism widget(s) using `@repo/ui` atoms + `@repo/hooks/<feature>` hooks
4. **`registry.ts`** — register widget key(s)
5. **Apps** — wrap screen with feature provider(s), pass `ContentItem` tree to `ContentRenderer`

---

## Public APIs

### `@repo/hooks`

| Export path | Contents |
|-------------|----------|
| `@repo/hooks` | All public providers and hooks (re-exported) |
| `@repo/hooks/demo` | `DemoBookingProvider`, `useDemoBooking` |

### `@repo/widgets`

| Export path | Contents |
|-------------|----------|
| `@repo/widgets` | `ContentRenderer`, `renderContentItem`, `widgetRegistry`, types |
| `@repo/widgets/renderer` | `ContentRenderer`, `renderContentItem` |
| `@repo/widgets/registry` | `widgetRegistry` |
| `@repo/widgets/types` | `ContentItem`, `ContentChildren`, `WidgetComponent` |

---

## Design rules (summary)

1. **Apps import `@repo/hooks` + `@repo/widgets`** — not `@repo/ui` directly
2. **Atoms live in `@repo/ui`** with separate web/mobile implementations
3. **Business state lives in `@repo/hooks`** — context is internal; hooks are the public API
4. **Widgets never import context directly** — only feature hooks from `@repo/hooks/<feature>`
5. **Widgets are single-file** — platform branching is explicit in code when needed
6. **Widgets compose atoms** — they do not use `react-native` or DOM primitives directly
7. **Slots are pre-rendered** — the renderer passes `ReactNode` children; widgets just place them
8. **Content is data** — pages/screens are driven by a `ContentItem` tree from code, config, or an API
9. **UI-only hooks stay in `@repo/ui`** — business hooks stay in `@repo/hooks`
