---
name: nuxt
description: "Use when working on a Nuxt 4 app: pages, layouts, components, composables, plugins, middleware, Nitro routes, SSR and hydration bugs, useState, useAsyncData, useFetch, callOnce, runtimeConfig, auto-imports, auto-registered components, and Nuxt UI integration. Especially useful for repo-aware Nuxt changes in this workspace."
argument-hint: "Describe the Nuxt feature, file, route, component, composable, or bug you want help with."
user-invocable: true
---

# Nuxt Development

Use this skill for Nuxt 4 implementation, refactoring, and debugging work where correct placement, SSR safety, Nuxt primitives, and framework conventions matter.

This skill is aware of the workspace structure in this repository:

- `app/` holds app code: pages, layouts, components, views, composables, middleware, plugins, and utilities.
- `server/` holds Nitro server code: API routes, middleware, tasks, queues, database integration, and server utilities.
- `shared/` holds cross-layer types and utilities.
- `configs/` selects environment-specific behavior.
- `src-tauri/` is native packaging and should stay separated from standard web concerns.

## When to Use

- Build or change Nuxt pages, layouts, route middleware, plugins, components, views, or composables.
- Fix SSR, hydration, client-only, or server-only issues.
- Choose between `useState`, `useAsyncData`, `useFetch`, custom fetch wrappers, plugins, middleware, or server routes.
- Place code in the correct Nuxt folder and rely on auto-imports or component auto-registration correctly.
- Work with runtime config, environment-specific behavior, or Nitro server boundaries.
- Build or debug Nuxt UI usage.

## Repo-Aware Defaults

- Treat this as a Nuxt 4 application.
- Preserve client and server boundaries. Browser or Tauri APIs belong in client-only code paths such as `.client.vue`, or guarded `import.meta.client` logic.
- Keep secrets, backend URLs, D1 details, and environment-specific bindings in the config layer, not in feature code.
- Components are auto-registered from `app/components` and `app/views`; keep component names in PascalCase.
- Composables belong in `app/composables` and should usually follow `useX` naming.
- Shared app state usually uses `useState` with namespaced keys from `app/utils/constants.ts`; do not introduce ad hoc global state when an existing keyed pattern fits.
- Prefer the existing fetch and data access patterns already used in the repo before inventing new wrappers.
- This repo uses `@nuxt/ui`. Prefer checking real Nuxt UI docs, examples, and metadata instead of guessing component props or slots.

## Core Nuxt Knowledge To Apply

### 1. Pick the right runtime boundary first

Before writing code, decide where it must run:

- Server only: Nitro route, server middleware, database access, secrets, private runtime config.
- Client only: browser APIs, window/document access, Tauri APIs, SDKs that require the browser runtime.
- Universal: SSR-safe page, component, composable, or data logic that can run on both server and client.

Use these rules:

- If the code touches browser globals, it must be guarded with `import.meta.client`, moved into a `.client.*` file, or wrapped in a client-only render boundary when appropriate.
- If the code touches secrets, databases, or trusted server credentials, it belongs in `server/`.
- If the code must run during SSR and hydrate cleanly, avoid client-only assumptions during setup.

### 2. Put code in the right Nuxt location

- Page route: `app/pages/**`
- Layout shell: `app/layouts/**`
- Reusable UI: `app/components/**`
- Larger page-specific UI blocks: `app/views/**`
- Reusable reactive logic: `app/composables/use*.ts`
- App bootstrap or injections: `app/plugins/**`
- Route protection or redirects: `app/middleware/**`
- Server endpoints: `server/api/**`
- Server middleware or backend utilities: `server/**`
- Cross-layer types or utilities: `shared/**`

Default to the narrowest correct scope. Do not place server logic in app code or app-specific UI logic in shared utilities unless it truly belongs there.

### 3. Choose the right Nuxt primitive

Use this decision guide:

- Use `useState` for shared reactive app state that should survive navigation and align with Nuxt state hydration.
- Use a namespaced `useState` key from `app/utils/constants.ts` when the repo already defines one or when similar state follows that pattern.
- Use `useAsyncData` when data should participate in Nuxt SSR, caching, keys, and revalidation semantics.
- Use `useFetch` or the repo's existing fetch wrapper when you are fetching HTTP data inside app code.
- Use `callOnce` for one-time startup or one-time execution flows that should not rerun unnecessarily across hydration or navigation.
- Use route middleware for navigation-time checks and redirects, not as a substitute for data fetching.
- Use a plugin when the concern is app-wide setup, injection, or third-party initialization.
- Use Nitro server routes when the browser should not call external services directly or when server-side validation is required.

### 4. Prefer SSR-safe data flow

When fetching or deriving initial page data:

- Favor SSR-aware primitives before manual `onMounted` fetching.
- Give async data stable keys when the data must be cached or refreshed predictably.
- Keep server-derived initial state compatible with client hydration.
- Avoid double-fetch patterns unless there is a deliberate client refresh requirement.
- If the repo already uses a wrapper such as `useAppFetch`, prefer that existing path for consistency.

### 5. Respect auto-imports and auto-registration

Nuxt provides many composables and Vue helpers by auto-import. This repo also relies on Nuxt auto-registration patterns.

- Do not add unnecessary manual imports for standard Nuxt auto-imported composables unless the project style already does so.
- Assume components under `app/components` and `app/views` can be referenced by PascalCase name.
- Keep composables small, explicit, and named by responsibility.

### 6. Handle hydration and client-only behavior deliberately

When debugging hydration bugs or mismatches:

- Check whether setup code reads browser-only values during SSR.
- Check whether rendered output differs between server and client before hydration completes.
- Check whether state initialization depends on unstable client-only data.
- Move browser-dependent initialization to client-only code paths when needed.
- Use `callOnce`, lazy client initialization, or guarded watchers when the issue is duplicate startup work.

### 7. Use runtime config and environment layers correctly

- Public runtime config is for values that may be exposed to client code.
- Private runtime config and secrets stay server-side.
- In this repo, environment selection flows through `configs/index.ts` and related config files. Follow that path rather than hard-coding environment-specific values.
- Respect `APP_ENV`, `NUXT_TARGET_MODE`, and `TARGET_MODE` semantics already present in the workspace.

## Nuxt UI Guidance

This repo includes `@nuxt/ui`.

When working with Nuxt UI:

- Prefer existing Nuxt UI components and composables before building custom primitives.
- Match the project's existing patterns around `UApp`, `UIcon`, toasts, and other shared UI behavior.
- Do not guess props, slots, emits, theming tokens, or supported composition patterns if docs can be checked.

If Nuxt UI MCP is available in the environment, use it aggressively:

- Use `list_components` to discover available components.
- Use `get_component` with targeted `sections` such as `usage`, `examples`, `api`, or `theme` to keep context focused.
- Use `get_component_metadata` when you need props, slots, or events without loading full docs.
- Use `list_composables` and `get_example` when searching for established usage patterns.
- Use `find_component_for_usecase` or similar guided prompts when selecting the right component for a feature.
- Use `get_migration_guide` when touching code that may depend on older Nuxt UI behavior.

Nuxt UI MCP endpoint reference: `https://ui.nuxt.com/mcp`

## Working Procedure

1. Classify the task.
   Decide whether the work is page/UI, shared app logic, app bootstrapping, routing, or server/Nitro behavior.

2. Mark the runtime boundary.
   Decide whether the code is server-only, client-only, or universal before changing files.

3. Choose the placement.
   Put the code in the appropriate Nuxt directory and naming convention.

4. Choose the framework primitive.
   Select `useState`, `useAsyncData`, `useFetch`, `callOnce`, middleware, plugin, or Nitro route based on behavior rather than habit.

5. Reuse repo conventions.
   Follow existing state keys, config handling, fetch wrappers, and feature boundaries instead of introducing a parallel pattern.

6. Validate SSR and hydration behavior.
   Confirm server and client execution paths are safe and that initial render behavior is deterministic.

7. Use Nuxt UI sources when relevant.
   Check Nuxt UI MCP or official docs before implementing or changing Nuxt UI components.

8. Verify with project checks.
   Run `pnpm lint`, `pnpm typecheck`, and the narrowest relevant test command for the change.

## Completion Checklist

- The code lives in the correct Nuxt folder.
- Client-only and server-only behavior are clearly separated.
- Data fetching uses the correct Nuxt primitive for SSR and caching needs.
- Shared state uses the established `useState` pattern where applicable.
- Environment-specific configuration is not hard-coded.
- Nuxt UI usage is validated against real docs or MCP data instead of memory.
- Lint, typecheck, and relevant tests are considered before finishing.

## Example Prompts

- `/nuxt-development Fix a hydration mismatch in this page and explain whether the offending logic should move to a client-only plugin or stay in the component.`
- `/nuxt-development Add a new SSR-friendly page that loads data with useAsyncData and follows this repo's fetch conventions.`
- `/nuxt-development Refactor this feature to use namespaced useState keys instead of ad hoc shared refs.`
- `/nuxt-development Decide whether this logic belongs in app/composables, app/plugins, or server/api and then implement it.`
- `/nuxt-development Build this form with Nuxt UI and check the Nuxt UI MCP for the right components, props, and examples before coding.`
