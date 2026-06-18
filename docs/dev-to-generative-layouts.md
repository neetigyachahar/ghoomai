---
title: "Generative Layouts with AI: Building Dynamic Trip UIs from a Shared React Codebase"
published: false
description: "How GhoomAI combines React Universal architecture, CMS-driven JSON screens, and an AI orchestrator to generate trip-planning UIs on web and mobile."
tags: react, reactnative, ai, architecture, monorepo
---

# Generative Layouts with AI: Building Dynamic Trip UIs from a Shared React Codebase

## The moment it clicked

Lately, AI chat products have started doing more than returning paragraphs of text.

Ask Claude a question about data or a simple workflow, and you may get a small interactive web element — a form, a chart, a picker — rendered inline in the conversation. It feels less like reading an answer and more like using a lightweight app.

At Google I/O 2026, Gemini's **Generative UI** pushed the same idea further: the model doesn't just describe an interface — it assembles one from a known component vocabulary, tailored to what you asked for.

That observation stuck with me. If models can generate UI on the fly inside a chat surface, what would it look like to build that capability into a real product — one with a proper design system, real data sources, and both web and mobile clients?

That question became **GhoomAI**.

---

## What is GhoomAI?

GhoomAI is an AI-powered trip planner. You describe where you want to go — "Plan a weekend in Manali" or "Show buses from Delhi to Manali this weekend" — and the app responds with a structured trip screen: headers, timelines, transport offers, hotel choices, and activity options.

It is not a chat transcript with markdown links. It is a **native-feeling screen** built from reusable widgets, populated with search results, and rendered the same way whether you open it in a browser or on your phone.

A few things worth noting from a product perspective:

- **Conversational planning** — the AI asks clarifying questions one at a time (origin, dates, travelers, budget) before building a layout.
- **Focused answers** — you can ask narrow questions too ("top places in Manali") and get a shorter, purpose-built screen instead of a full itinerary.
- **AI knowledge from real travel data** — flights, buses, trains, cabs, and hotels are fetched through server-side tools. For now these are **mock APIs** with realistic Indian travel scenarios (Delhi ↔ Manali, Chandigarh connections, etc.), which keeps the demo self-contained without external API keys.
- **Cross-platform** — one shared screen codebase powers both the Next.js web app and the Expo mobile app.

The technical bet underneath all of this: treat UI as **data**, keep platforms thin, and let an orchestrator compose screens from a registry the frontend already knows how to render.

---

## Layer 1: React Universal app architecture

GhoomAI is a monorepo where React (web) and React Native (mobile) share almost everything except the lowest UI primitives and the app shells themselves. The layout follows atomic design — each path below is both a package and a layer, with a single clear job:

| Path | Layer | Responsibility |
|------|-------|----------------|
| `apps/web` | App shell | Next.js — routing only; mounts shared screens, passes navigation callbacks |
| `apps/mobile` | App shell | Expo — same screens as web; only routing and native chrome differ |
| `apps/functions` | API server | Firebase Cloud Function — all `/api/*` routes |
| `packages/types` | Types | Shared type shapes — `ContentItem`, travel models; zero package dependencies |
| `packages/ui` | Atoms & molecules | Button, Text, Box, TripHeader — `*.web.tsx` + `*.mobile.tsx` |
| `packages/hooks` | Business logic | `AIProvider`, `useAi`, `useTravelResource` — no UI components |
| `packages/widgets` | Organisms & pages | Trip header, travel steps, plan choices — registry + renderer |
| `packages/api` | Server-side | AI orchestration, travel search tools, route handlers |

Platform selection for atoms happens at **bundle time**, not runtime. Each `@repo/ui` component exports through `package.json` conditions — Next.js resolves `*.web.tsx`, Metro resolves `*.mobile.tsx`:

```json
"./button": {
  "react-native": "./src/button/button.mobile.tsx",
  "types": "./src/button/button.web.tsx",
  "default": "./src/button/button.web.tsx"
}
```

Widgets compose atoms; screens compose widgets. Both are written once — no `Platform.OS` branching in business UI. A minimal widget might look like this:

```tsx
// packages/widgets/src/widgets/content-block.tsx
import { ContentBlock } from "@repo/ui/content-block";

export function ContentBlockWidget({ heading, content }: { heading?: string; content: string }) {
  return <ContentBlock heading={heading} content={content} />;
}
```

The atom layer absorbs DOM vs React Native differences. Widgets, screens, and hooks stay platform-agnostic.

**Why this matters for a business:** one team maintains one feature codebase. A new trip widget ships on web and mobile together. Design changes to atoms propagate everywhere. The only duplicated surface area is routing and app configuration — which is exactly where platforms legitimately diverge.

![React Universal App Architecture](../assets/ghoomai.drawio.png)
*Figure 1 — Shared hooks, widgets, and screens feed both the Next.js web app and the Expo native app. Only atoms split by platform at the UI package layer.*

---

## Layer 2: CMS-driven screens from JSON

GhoomAI's screens are built on a **server-driven UI** model — a pattern I've used in CMS-configured apps before, and the natural foundation for AI-generated layouts.

Every screen is described by a declarative `ContentItem` tree — a JSON structure the frontend walks and renders:

```ts
interface ContentItem {
  key: string;                        // widget ID, e.g. "trip-header"
  props: Record<string, unknown>;     // data for the widget
  children: ContentChildren | null;   // named slots
}
```

An example tree:

```json
[
  {
    "key": "trip-header",
    "props": {
      "title": "Delhi to Manali",
      "stats": [
        { "label": "Dates", "value": "Jun 20–22" },
        { "label": "Travelers", "value": "2" }
      ]
    },
    "children": null
  },
  {
    "key": "travel-recommendation",
    "props": {
      "dayLabel": "Day 1",
      "resourceType": "bus",
      "resourceId": "bus-del-man-1",
      "sectionTitle": "Getting there",
      "stepTime": "Fri 9:00 PM – Sat 7:30 AM"
    },
    "children": null
  }
]
```

On the frontend, a **component registry** maps string keys to React components:

```ts
export const widgetRegistry = {
  "trip-header": TripHeaderWidget,
  "travel-recommendation": TravelRecommendationWidget,
  "plan-choice": PlanChoiceWidget,
  "content-block": ContentBlockWidget,
};
```

A `ContentRenderer` owns tree walking. Widgets never recurse — they receive pre-rendered slot children as props. Slots enable nested layouts: a `plan-choice` widget exposes named slots per option, and the renderer fills each slot with the subtree for that choice.

This pattern is familiar if you have worked on CMS-configured apps: marketing pages, admin dashboards, or mobile home screens driven by backend JSON. The backend (or CMS) sends structure + data; the client maps IDs to components and composes the final UI. Adding a new widget means registering it once — no new route file per layout variant. It scales well because **content is data**, and the renderer stays stable even as the component library grows.

![Dynamic Screens Architecture](../assets/ghoomai-json.png)
*Figure 2 — A JSON content tree flows from backend/CMS into a component map and compositor, producing the final screen.*

---

## Layer 3: The AI orchestrator

The Claude and Gemini examples from earlier are essentially doing what the CMS does — picking components and filling props — except the "author" is an AI model instead of a content editor.

GhoomAI connects the two worlds:

1. The **widget registry** doubles as AI metadata. Each widget exports a description, prop schema, and slot definitions via `getWidgetRegistryForAI()`. The model knows exactly which building blocks exist and what each one expects.
2. A **server-side orchestrator** (`runWidgetAI` in `@repo/api`) receives the conversation and registry snapshot, then drives the model through Anthropic's SDK `toolRunner` — travel search tools are registered upfront, and the model invokes them in a loop as needed before returning a structured layout or clarifying question.
3. **Travel tools** wrap mock search services — `search_flights`, `search_buses`, `search_trains`, `search_cabs`, `search_hotels`, plus `get_user_personalization` for hotel preferences.
4. Progress flows back to the client over **SSE** (`text/event-stream`). As tools run, the frontend shows live status ("Searching flights…", "Building your layout…") instead of a blank spinner.
5. The final output is structured JSON — either a clarifying question with tap-to-send options, or a `ContentItem[]` layout the existing renderer already understands.

The flow in practice:

```plaintext
User prompt
    → AI asks clarifying questions (JSON, with option chips)
    → AI calls travel search tools with real parameters
    → AI calls notify_building_layout (progress event via SSE)
    → AI returns { type: "layout", layout: ContentItem[] }
    → ContentRenderer paints the trip screen
    → User navigates to the result view (web route / mobile stack)
```

The system prompt defines how GhoomAI behaves as a product. It classifies intent first: a full end-to-end itinerary versus a focused travel question, each with a different clarifying workflow and layout shape. For trips, the model gathers context one question at a time (origin → dates → travelers → budget), offering tap-to-send chip answers rather than open-ended forms. Once it has enough context, it must call real search tools before composing UI.

Because the AI output uses the same `ContentItem` shape as a CMS payload, **no separate rendering path exists for generated UI**. The AI is just another author of JSON the app already knows how to paint.

![Generative Layouts](../assets/ghoomai-ai.png)
*Figure 3 — The AI orchestrator reads the widget registry, calls data tools, and outputs a generative screen.*

---

## What comes next

The current implementation works end-to-end, but there is clear room to improve how layouts are produced and delivered.

**Token efficiency.** Today the model emits a single JSON document describing the entire widget tree. JSON is verbose — repeated keys, nested braces, string-escaped values. For larger itineraries, that cost adds up in both latency and price. A natural evolution is a more compact interchange format (a terse DSL, protobuf-style field codes, or a line-oriented schema) that carries the same semantic information with fewer tokens.

**Progressive layout streaming.** Instead of one big JSON blob at the end, the model could call a `append_layout_chunk` tool repeatedly. Each tool invocation appends a slice of the tree — a header first, then day-one steps, then choices — and the handler immediately pushes that chunk to the client over SSE. The `ContentRenderer` would mount widgets as chunks arrive, giving users a progressively building itinerary rather than waiting for the full response.

Neither change requires rethinking the registry or the cross-platform widget layer. They are optimizations on the authoring and transport path — the same components, delivered faster and cheaper.

---

## Try it / links

- **Live demo:** [PLACEHOLDER — ghoomai.web.app or your deployed URL]
- **GitHub:** [PLACEHOLDER — github.com/your-org/ghoomai]
- **Connect:** [PLACEHOLDER — linkedin.com/in/your-profile]

---

## Closing thought

Generative UI in chat products showed that models can be interface authors, not just text generators. GhoomAI takes that seriously as an architecture: a shared React codebase, a registry-driven renderer, and an AI layer that speaks the same JSON the CMS would have sent.

The interesting part is not that AI can return JSON. It is that when your frontend is already built as a composable, data-driven system, generative layouts become a natural extension — not a parallel UI stack you have to maintain forever.

If you are exploring similar ideas — universal React apps, server-driven UI, or AI-composed screens — I would love to hear what you are building.
