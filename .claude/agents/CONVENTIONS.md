# Project Conventions

Shared source of truth for every Claude Code agent working in this repo. Read this before doing anything — don't re-derive conventions from scratch, and don't guess at something this file already answers.

This file is not itself an agent (no frontmatter, not invokable) — it's a plain doc every agent below is instructed to read.

## Maintenance

Each section is owned by one agent: the one that updates it the same change that makes it stale, so staleness has a single accountable owner instead of "someone should update this eventually."

| Section | Owned by |
|---|---|
| Test layout, Page Object Model, test-writing rules, env/config, npm scripts | `playwright-builder` |
| Security specs (`tests/security/`) | `playwright-security-tester` |
| Accessibility specs (`tests/accessibility/`) | `playwright-accessibility-tester` |
| CI/CD | `playwright-devops` |
| This file's overall structure, the ownership table itself, cross-agent boundaries | `playwright-manager` |

If you're not sure whose section something belongs in, say so in your report rather than guessing or silently editing someone else's section.

**Keep the root `README.md` current, but only for big changes** a new contributor would need to know about: a new test category/directory, a new required `.env` var, a renamed/added npm script, a new or renamed agent, or a workflow change that alters what `npm test`/CI actually does. A one-line edit to the relevant section is enough — don't turn it into a rewrite. Skip it for small/internal-only changes (a tweaked locator, a refactored page-object internal, a single new test in an existing category).

## Tech stack

- [Playwright Test](https://playwright.dev/) (TypeScript). Tests live in `tests/*.spec.ts`.
- [Allure](https://allurereport.org/) for reporting (`allure-playwright` + `allure-commandline`), alongside Playwright's own `html`/`json` reporters.
- `@axe-core/playwright` + `playwright-lighthouse` for accessibility audits.
- `playwright-bdd` is a devDependency but **not** wired into `playwright.config.ts` — don't assume Gherkin/BDD support works until it's actually configured.
- Target app: https://the-internet.herokuapp.com (a public QA practice site), configured as `BASE_URL`. Navigate with relative paths (`page.goto('/login')`) — never hardcode the domain.

## Test layout (owned by `playwright-builder`)

- `tests/login.spec.ts` — the login golden path, sitting directly at the `tests/` root. This predates the category subfolders below and is left in place for stability; it's not the pattern to follow for new specs.
- `tests/pages/` — Page Object Model (see below). Shared across every category, including `tests/security/` and `tests/accessibility/`.
- `tests/api/` — API-level specs (e.g. `login.api.spec.ts` against `/authenticate`).
- `tests/features/` — one spec per homepage example page cataloged in `docs/app-exploration.md` (`ab-test.spec.ts`, `add-remove-elements.spec.ts`, `basic-auth.spec.ts`, `broken-images.spec.ts` so far), kebab-case named after the feature. This is the intended home for further pages from that catalog as they get automated — don't dump new ones at the `tests/` root.
- `tests/security/` — owned by `playwright-security-tester`. See its own section below.
- `tests/accessibility/` — owned by `playwright-accessibility-tester`. See its own section below.
- The original Playwright scaffold specs (`tests/example.spec.ts`, `tests/example2.spec.ts`, `tests-examples/demo-todo-app.spec.ts`) were deleted as unused — don't recreate them.

### Page Object Model

- Every page object extends `tests/pages/BasePage.ts` (constructor takes `page: Page`, stores it, exposes `goto(path: string)` which navigates relative to `baseURL` and returns nothing).
- If a test needs the navigation `Response` itself (e.g. an HTTP status assertion), call `page.goto()` directly in the test instead of changing the page object's `goto()` to return a value. `tests/features/basic-auth.spec.ts` and `tests/security/basic-auth.security.spec.ts` both do exactly this, sharing the same `BasicAuthPage.ts` without either one needing it to return anything.
- Keep page objects minimal — only add methods/locators a test actually calls. Once more than one or two specs share setup, introduce a page object rather than duplicating locators; don't pre-build POM scaffolding for a single trivial spec.
- Prefer `getByRole`/`getByLabel`/`getByText` over CSS/XPath/id selectors. A locator that had to fall back to a raw CSS selector because nothing accessible existed on the element is itself worth flagging (see `playwright-accessibility-tester`).

## Test-writing rules (everyone)

- No arbitrary `waitForTimeout` — rely on auto-waiting and web-first assertions (`expect(locator).toBeVisible()`, `toHaveText()`, etc.).
- Never hardcode credentials (usernames, passwords, tokens, API keys) as string literals in specs/page objects/scripts — pull them from `process.env`, even for "throwaway" public demo-site accounts. Add new vars to both `.env.dev` and `.env.qa`, mirroring `BASE_URL`. An intentionally-wrong value used only to exercise a negative path (e.g. a deliberately bad password) is fine as a literal — it isn't a real credential.
- A test's `browser` fixture (`async ({ browser }) => {...}`) inherits the project's `use` config (including `baseURL`) when you call `browser.newContext()` — don't pass `baseURL: process.env.BASE_URL` explicitly there, it's redundant. The one exception is a fully manual `chromium.launch()` outside the test's fixtures entirely (see the Lighthouse test in `tests/accessibility/login.a11y.spec.ts`) — that browser instance has no project config at all, so `baseURL` must be passed explicitly.
- After writing or changing a spec, run it with `npx playwright test <file>` and report the real pass/fail result — don't claim a test works without running it.

## Environment & config (owned by `playwright-builder`; CI secret provisioning owned by `playwright-devops`)

- `playwright.config.ts`: testDir `./tests`, fullyParallel, retries/workers gated on `process.env.CI`, loads env vars via `dotenv.config({ path: \`.env.${process.env.TEST_ENV || 'dev'}\` })` (so `.env.dev` is the default, `.env.qa` when `TEST_ENV=qa` is set). `use.baseURL` comes from `process.env.BASE_URL`. Trace `on-first-retry`. Reporters: `allure-playwright`, `html`, `json`. Only the `chromium` project is configured — ask before adding firefox/webkit/mobile projects.
- `.env.dev`/`.env.qa` are both gitignored and untracked, with no committed example file — ask the user for values if you need to create one. Optional `SLOWMO` (ms) slows down headed runs for debugging.
- Current required vars: `BASE_URL`, `TEST_USERNAME`, `TEST_PASSWORD` (app login), `BASIC_AUTH_USERNAME`, `BASIC_AUTH_PASSWORD` (the `/basic_auth` page's own published demo credential — still routed through env vars rather than hardcoded, per the rule above).
- If `.env.dev` is missing or empty, `baseURL` resolves to `undefined` and tests fail with a confusing navigation error rather than a clear "missing config" message.

## npm scripts (owned by `playwright-builder`; CI's own invocation of them is `playwright-devops`'s concern)

- `npm test` / `npm run test:dev`: `npx playwright test --reporter=html` against `.env.dev`.
- `npm run test:qa`: same, against `.env.qa` (via `cross-env TEST_ENV=qa`) — does **not** trigger `posttest`.
- `posttest`: fires only after `npm test`/`npm run test:dev` (not `test:qa`, not a direct `npx playwright test <file>` call). Runs `allure generate allure-results --clean && allure open && npx playwright show-report`. `allure open` starts a blocking local web server — the command won't return until it's stopped (Ctrl+C). Not a hang.
- Run a single spec without triggering `posttest`: `npx playwright test tests/<file>`.

## CI/CD (owned by `playwright-devops`)

- A single workflow, `allure.yml`, in `.github/workflows/` (formerly `allure2.yml` — renamed once the old dormant `allure.yml` and two duplicate workflows, `alluremanual.yml` and `playwright.yml`, were deleted). There is currently no other workflow file and no remaining intentional typo to preserve — if you spot something that looks like a mistake in `allure.yml` itself, it's worth flagging rather than assuming it's a deliberate historical quirk.
- Runs on push+PR to `main`. Builds the Playwright HTML report and an Allure report, deploys both to the `gh-pages` branch (served at https://guneyekiz.github.io/playwright/).
- Also supports manual `workflow_dispatch` with a `dev`/`qa` `environment` choice input (default `dev`). The job sets `environment: ${{ github.event.inputs.environment || 'dev' }}`, which resolves `BASE_URL`/`TEST_USERNAME`/`TEST_PASSWORD`/`BASIC_AUTH_USERNAME`/`BASIC_AUTH_PASSWORD` from that GitHub Environment's secrets. Both `dev` and `qa` Environments exist with their own copies of all five. A new env var needs its secret added to **both** Environments by a maintainer in the GitHub UI — no agent can create a GitHub secret, only document that one is needed and where.
- The `gh-pages` push itself authenticates with a separate PAT, `secrets.ACCESS_TOKEN2`, not the default `GITHUB_TOKEN` — don't assume the job's `permissions:` block (`contents: write`, `deployments: write`) is what authorizes that push, and don't trim those permissions without checking what actually depends on them first.
- The same run tags the Allure "Environment" widget and writes `executor.json` from `github.run_number`/`run_id`.
- The workflow file has accumulated debug/echo steps and commented-out blocks from earlier iterations — don't "clean those up" as a side effect of an unrelated change. Flag any change that would alter trigger behavior (enabling on a currently-dormant workflow, changing `workflow_dispatch` inputs, etc.) *before* making it.

## Security specs — `tests/security/` (owned by `playwright-security-tester`)

`tests/security/*.security.spec.ts` holds permanent regression specs, each locking in a *confirmed* live finding (response headers, cookie flags, basic-auth enumeration behavior, reflected-input encoding, transport/error-page leakage, etc.), cross-referenced against `docs/app-exploration.md`. Same conventions apply as everywhere else (env vars, web-first assertions, no hardcoded creds).

## Accessibility specs — `tests/accessibility/` (owned by `playwright-accessibility-tester`)

`tests/accessibility/*.a11y.spec.ts` holds axe-core and/or Lighthouse-based checks. `login.a11y.spec.ts` is the existing baseline: a Lighthouse accessibility-score threshold on `/login` (manual `chromium.launch()`, see the `baseURL` exception above) and an axe-core violations-count baseline on `/secure`. This is a **public demo site the project doesn't control** — it won't hit a perfect score. New specs should assert against a measured baseline with headroom for regressions (exactly like the existing thresholds: 80 against a measured 87, ≤5 violations against a measured baseline), not a hypothetical "zero violations." Re-measure before picking a new page's baseline rather than guessing a number.
