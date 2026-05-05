# HEXED

A 1v1 grid duel game inspired by Minesweeper and Buckshot Roulette.
Web prototype now (Vite + React), to be ported to Unity later.

## Stack

- Vite + React 18 + TypeScript (strict mode)
- Tailwind CSS for styling
- Zustand for state management
- Framer Motion for animations
- Vitest for tests

## Commands

- `npm run dev` — start dev server (port 5173)
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm test` — run vitest in watch mode
- `npm run test:run` — run vitest once (CI mode)
- `npm run lint` — eslint check

## Architecture

- `src/core/` — pure game logic. **No React imports allowed here.**
  Designed to be portable to Unity/C# later.
- `src/store/` — Zustand stores wrapping core logic.
- `src/components/` — React UI, presentation-focused.
- `src/styles/` — global styles only.

## Conventions

For coding conventions, naming rules, commit format, and project-wide
guidelines, see [docs/CONVENTIONS.md](./docs/CONVENTIONS.md).

For design decisions and their rationale, see [docs/DECISIONS.md](./docs/DECISIONS.md).

## Gotchas

- `src/core/` must stay React-free; check imports before committing there.
- Tailwind config requires updating `content` paths when adding new dirs.
- localStorage / sessionStorage are not used; state is per-session only.
- Strict TypeScript: no `any`, no implicit returns.
