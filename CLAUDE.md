## Setup and commands

- Use `pnpm`; the repo is pinned to `pnpm@9.3.0` and `package.json` requires Node `>=22.12.0`.
- Start the dev server in background mode with `astro dev --background`. Manage it with `astro dev status`, `astro dev logs`, and `astro dev stop`.
- Current package scripts: `pnpm dev`, `pnpm build`, `pnpm preview`, and `pnpm astro`.
- There are no repo-defined lint, test, or typecheck scripts yet. Do not claim those checks passed unless you add and run them.
- To add shadcn/ui components: `pnpm shadcn@latest add <component-name>` (e.g. `pnpm shadcn@latest add card`).

## Current project state

- Astro + React + Tailwind 4 + shadcn/ui + Redux Toolkit are configured and working.
- `src/layouts/Layout.astro` imports `src/styles/global.css` (Tailwind CSS) and accepts `title`/`description` props with SEO-friendly defaults in Spanish.
- `src/pages/index.astro` uses Astro shell with a React island (`SignupIsland` component, `client:load`).
- `src/store/` contains the Redux Toolkit store. `index.ts` exports the store, typed hooks (`useAppDispatch`, `useAppSelector`). `signup-slice.ts` manages form submission state. `provider.tsx` wraps children with the Redux Provider.
- `src/components/SignupIsland.tsx` is the Astro-compatible island wrapper that includes `StoreProvider` + `SignupForm`.
- `src/components/ui/` contains shadcn/ui components. Add more via `pnpm shadcn@latest add <name>`.
- `src/lib/utils.ts` exports `cn()` for merging Tailwind classes.
- `components.json` configures shadcn/ui paths using `@/` aliases.
- TypeScript extends `astro/tsconfigs/strict` with `jsx: "react-jsx"` and path aliases.

## Stack

- **Astro 7** — shell framework, handles routing, layouts, SEO metadata.
- **React 19** — hydrated only where interactivity is needed (use `client:load`).
- **Redux Toolkit** — minimal setup in `src/store/`. Use `createSlice` + `createAsyncThunk` for async flows. Avoid adding global architecture beyond what the current feature needs.
- **Tailwind 4** — CSS framework via Vite plugin (`@tailwindcss/vite`). No `tailwind.config.*` needed; theme is in `src/styles/global.css` using `@theme`.
- **shadcn/ui** — component primitives in `src/components/ui/`. Uses `new-york` style, Lucide icons, CSS variables for theming.
- Treat Astro as the shell: keep routes and SEO in `.astro` entrypoints, hydrate React only where interactivity is needed.

## Language conventions

- **Public-facing copy**: Spanish for Argentina (voseo, regional vocabulary).
- **Code, identifiers, comments, filenames, technical artifacts**: English.
- **SEO metadata** (title, description): Spanish.

## Product constraints

- The intended product is SEO-oriented and aimed at football fans in Argentina/Latin America. Preserve that in information architecture, metadata, structured data, locale choices, and content strategy.
- `requerimientos.txt` contains CU-01 through CU-03 with edge cases. Consult it before implementing backend or payment flows.
