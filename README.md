# Prode Mundial

Fan prediction pool for the FIFA World Cup 2026. Make your match predictions, compete with other fans across Argentina and Latin America, and prove you know your football.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Shell / SSR | Astro 7 |
| Interactivity | React 19 (hydrated islands only) |
| State | Redux Toolkit |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Language | TypeScript |

## Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Start local dev server |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview build locally |
| `pnpm astro` | Run Astro CLI commands (`astro check`, `astro add`, etc.) |

## Project Structure

```text
/
├── public/              # Static assets (favicon, icons)
├── src/
│   ├── components/      # React components + shadcn/ui primitives
│   ├── layouts/         # Astro layouts (SEO, meta tags)
│   ├── pages/           # Astro routes (shell pages)
│   ├── store/           # Redux Toolkit store + slices
│   ├── styles/          # Tailwind CSS (global.css)
│   └── lib/             # Shared utilities (cn helper)
└── package.json
```

Astro serves as the shell: routes and SEO live in `.astro` entrypoints. React islands hydrate only where interactivity is needed (`client:load`).
