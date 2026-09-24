# Repository Guidelines

## Project Structure & Module Organization
TypeScript sources live in `src`: shared game logic under `src/main/core`, client React views and workers in `src/main/client`, and Express/Mongo services in `src/main/server`. API response definitions stay in `src/main/dts`, UI styles in `src/css`, and static assets under `src/statics`. Tests are in `src/test`, emitting JavaScript into `out/` while bundled distributables land in `docs/`.

## Build, Test, and Development Commands
`npm run build` compiles TypeScript, copies HTML, and produces production bundles in `docs/`. Use `npm run build:debug` or `npm run build:debug:client` for faster local bundles with source maps, and `npm run start:debug` to boot the Node server from `out/main/server/index.js`. `npm test` lint-builds common code then executes Mocha specs under `out/test`, while `npm run cover` wraps the same run with NYC for coverage. Run `npm run lint`, `npm run format`, and `npm run clean` before publishing to enforce style and clear stale artifacts.

## Coding Style & Naming Conventions
Follow the TSLint stack (`tslint:recommended`, Airbnb, Prettier) with 2-space indentation, single quotes, and a 120-character limit per `.prettierrc`. Favor descriptive file-level names that mirror contained types (`Arena.ts`, `UserModel.ts`) and export one main class or utility per file. Keep React components PascalCase, hooks or helpers camelCase, and queue all formatting via `npm run format` instead of editors-only rules to avoid drift.

## Testing Guidelines
Specs live beside helpers in `src/test`, following the `*.spec.ts` convention and using Mocha + Chai-style assertions. When adding a module, stub deterministic helpers in `TestUtils.ts`, and prefer short, scenario-based `describe` strings (“UserModel saves hashed password”). Run `npm test` locally before every push; if the change touches arena logic or matchmaking, require `npm run cover` and ensure NYC’s `all: true` threshold keeps newly generated files covered.

## Commit & Pull Request Guidelines
Recent history favors concise, sentence-style subjects such as “fix audit error and sign-up error,” optionally prefixed with the affected area. Write commits in present or past tense, under 72 characters, and group logically (build scripts, gameplay logic, UI). Pull requests should include: a short narrative of the change, reproduction or verification steps (commands run, env vars like `MONGODB_URI`), linked issues if applicable, and screenshots/GIFs when UI changes alter the player experience or admin tools.

## Security & Configuration Tips
Never commit `.env` files; rely on runtime variables documented in `README.md` such as `APP_KEY`, `TEAM_GAME`, `ADMIN_PASSWORD`, and `SESSION_SECRET`. Use `MONGODB_URI` values that point to isolated databases when developing and scrub user data from shared fixtures. When contributing client builds, double-check that `docs/standalone.html` contains no secrets—the bundled API endpoints should reference server configs, not hardcoded URIs.
