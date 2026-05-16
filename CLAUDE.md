# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then produce a production build via Vite
- `npm run lint` — run ESLint over the project
- `npm run preview` — serve the built `dist/` locally

There is no test runner configured in this project.

## Architecture

Single-page React 19 + TypeScript app built with Vite. State is managed entirely through Redux Toolkit; there is no routing, no API layer, and no backend.

**Data flow** (one-way, top-down):

1. [src/main.tsx](src/main.tsx) wraps `<App />` in `<Provider store={store}>`.
2. [src/redux/Store.ts](src/redux/Store.ts) composes the root reducer — currently a single `counter` slice.
3. [src/redux/slices/CounterSlice.ts](src/redux/slices/CounterSlice.ts) owns all mutable UI state: `value`, `textColor`, `fontFamily`, `fontSize`. The `increment`/`decrement` reducers wrap at `±20` back to `0` (intentional, not a bug).
4. [src/App.tsx](src/App.tsx) is the only component that talks to the store — it reads via `useSelector` and dispatches via `useDispatch`, then passes plain props + callbacks down to the presentational components in [src/component/](src/component/).
5. Picker option lists (colors, fonts, sizes) are static data in [src/constants/CounterData.ts](src/constants/CounterData.ts) — when adding a new option, edit this file rather than hardcoding in components.

**Conventions worth preserving:**

- Components under `src/component/` are dumb/presentational — they receive data and callbacks as props and never import from `src/redux/`. Keep store access centralized in `App.tsx`.
- Slice state shape is read with `(state: any) => state.counter.X` in `App.tsx`. If you introduce typed selectors, define `RootState`/`AppDispatch` in `src/redux/Store.ts` and use them consistently.
- Styling is Tailwind-only (Tailwind v4 via `@tailwindcss/vite`); no CSS modules, no styled-components. Existing `App.css`/`index.css` are minimal globals.

**Build pipeline notes:**

- React Compiler is enabled via `babel-plugin-react-compiler` (see [vite.config.ts](vite.config.ts) and the README). Avoid manual `useMemo`/`useCallback` micro-optimizations — let the compiler handle them.
- TypeScript uses project references: [tsconfig.json](tsconfig.json) → [tsconfig.app.json](tsconfig.app.json) (app sources) + [tsconfig.node.json](tsconfig.node.json) (Vite config). `npm run build` runs `tsc -b` so type errors fail the build.
