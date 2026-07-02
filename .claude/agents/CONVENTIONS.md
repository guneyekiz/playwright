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

**Keep this file current-state-only.** Describe how things work *now*, plus the gotchas that stop an agent from breaking something intentional. Narrative history ("this replaced X", "formerly named Y", "no migration was done when Z changed") belongs in `git log`, not here — every agent reads this file before every task, so each paragraph costs context on every invocation. Known-but-deliberately-unfixed issues and deferred decisions go in [`docs/backlog.md`](../../docs/backlog.md) as a bullet naming the owning agent, not as "confirmed but not fixed" prose here; remove the backlog entry in the same change that resolves it.

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
- `tests/features/` — one spec per homepage example page cataloged in `docs/app-exploration.md`, kebab-case named after the feature. This is the intended home for further pages from that catalog as they get automated — don't dump new ones at the `tests/` root. So far: `ab-test.spec.ts`, `add-remove-elements.spec.ts`, `basic-auth.spec.ts`, `broken-images.spec.ts`, `checkboxes.spec.ts`, `dropdown.spec.ts`, `dynamic-controls.spec.ts`, `dynamic-loading.spec.ts`, `forgot-password.spec.ts`, `horizontal-slider.spec.ts`, `inputs.spec.ts`, `javascript-alerts.spec.ts`, `status-codes.spec.ts`.
  - `dynamic-loading.spec.ts` and `dynamic-controls.spec.ts` both involve a genuine multi-second server-side delay (~5s and ~3s respectively) before the DOM updates — close enough to Playwright's default 5000ms assertion timeout to be flaky. Rather than `waitForTimeout`, the specific post-delay assertions pass an explicit longer `{ timeout }` so the web-first assertion's own auto-wait/retry has room to outlast the real delay.
  - `forgot-password.spec.ts` is a regression spec asserting on a *currently broken* 500 response (see Finding 2 in `docs/app-exploration.md`) — deliberately documenting known-buggy behavior, not a success path. If the server-side bug is ever fixed, this test should start failing, which is the intended signal to update it.
  - `status-codes.spec.ts` has no matching page object — per the Page Object Model rule below, it calls `page.goto()` directly in the test for the raw `Response`.
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
- Tagging: tests are tagged `@smoke` and/or `@regression` using Playwright's built-in `tag` annotation — `test('title', { tag: '@smoke' }, async (...) => {...})` for one test, or `test.describe('name', { tag: '@regression' }, () => {...})` to tag every test in a describe block at once. A test can carry both: `{ tag: ['@smoke', '@regression'] }`. Don't embed tags in title strings — only the annotation form works with `--grep`/`--grep-invert` filtering. `@smoke` is the small, fast, must-pass-every-morning subset (a scheduled CI run greps for it); `@regression` is the fuller suite, including slower or intentionally-known-broken specs that `@smoke` deliberately excludes for cost or noise reasons (e.g. `dynamic-loading.spec.ts`/`dynamic-controls.spec.ts`'s multi-second real delays, `forgot-password.spec.ts`'s known-500 assertion). When a file has no describe wrapper (top-level `test()` calls, e.g. `tests/login.spec.ts`, `tests/features/status-codes.spec.ts`), tag each `test()` individually rather than introducing a describe block just to carry the tag.

## Environment & config (owned by `playwright-builder`; CI secret provisioning owned by `playwright-devops`)

- `playwright.config.ts`: testDir `./tests`, fullyParallel, retries/workers gated on `process.env.CI`, loads env vars via `dotenv.config({ path: \`.env.${process.env.TEST_ENV || 'dev'}\` })` (so `.env.dev` is the default, `.env.qa` when `TEST_ENV=qa` is set). `use.baseURL` comes from `process.env.BASE_URL`. Trace `on-first-retry`. Reporters: `allure-playwright`, `html`, `json`. Only the `chromium` project is configured — ask before adding firefox/webkit/mobile projects.
- `.env.dev`/`.env.qa` are both gitignored and untracked, with no committed example file — ask the user for values if you need to create one. Optional `SLOWMO` (ms) slows down headed runs for debugging.
- Current required vars: `BASE_URL`, `TEST_USERNAME`, `TEST_PASSWORD` (app login), `BASIC_AUTH_USERNAME`, `BASIC_AUTH_PASSWORD` (the `/basic_auth` page's own published demo credential — still routed through env vars rather than hardcoded, per the rule above).
- If `.env.dev` is missing or empty, `baseURL` resolves to `undefined` and tests fail with a confusing navigation error rather than a clear "missing config" message.

## npm scripts (owned by `playwright-builder`; CI's own invocation of them is `playwright-devops`'s concern)

- `npm test` / `npm run test:dev`: `npx playwright test --reporter=html` against `.env.dev`.
- `npm run test:qa`: same, against `.env.qa` (via `cross-env TEST_ENV=qa`) — does **not** trigger `posttest`.
- `npm run test:smoke` / `npm run test:regression`: `npx playwright test --grep @smoke --reporter=html` / `--grep @regression --reporter=html`, both defaulting to `.env.dev` exactly like `test`/`test:dev` (no `TEST_ENV` set). Filters by the `tag` annotation described in Test-writing rules above. Neither is `test`/`test:dev`, so neither triggers `posttest`.
- `posttest`: fires only after `npm test`/`npm run test:dev` (not `test:qa`, not `test:smoke`/`test:regression`, not a direct `npx playwright test <file>` call). Runs `allure generate allure-results --clean && allure open && npx playwright show-report`. `allure open` starts a blocking local web server — the command won't return until it's stopped (Ctrl+C). Not a hang.
- Run a single spec without triggering `posttest`: `npx playwright test tests/<file>`.

## CI/CD (owned by `playwright-devops`)

This section describes current state and gotchas only — history lives in `git log`, and deferred decisions / known-but-unfixed issues live in [`docs/backlog.md`](../../docs/backlog.md).

- A single workflow, `allure.yml`, in `.github/workflows/` — no other workflow file exists. It has accumulated debug/echo steps and commented-out blocks from earlier iterations; don't "clean those up" as a side effect of an unrelated change. If something in it looks like a mistake, flag it rather than assuming it's a deliberate historical quirk, and flag any change that would alter trigger behavior *before* making it.
- **Triggers** — every one resolves to exactly one of `smoke`/`regression`; there is no unfiltered "run everything" path:
  - push/PR to `main` → smoke against dev (intentional, not a bug).
  - `workflow_dispatch` with two inputs: `environment` (`dev`/`qa`, default `dev`) and `test_subset` (`smoke`/`regression`, default `smoke`).
  - Four crons (UTC), deliberately off minute 0 and ≥15 min apart so none fires on the same instant as another (the workflow has no `concurrency:` group — see backlog): daily smoke against dev (`0 6 * * *`) and qa (`30 6 * * *`); weekly Monday regression against dev (`15 8 * * 1`) and qa (`45 8 * * 1`). Regression never runs on push/PR — only via its crons or manual dispatch.
- **Environments/secrets**: the job's `environment:` key picks the GitHub Environment (`dev` or `qa`), which supplies `BASE_URL`, `TEST_USERNAME`, `TEST_PASSWORD`, `BASIC_AUTH_USERNAME`, `BASIC_AUTH_PASSWORD`. Both Environments hold their own copies of all five; a new env var needs its secret added to **both** by a maintainer in the GitHub UI — no agent can create a GitHub secret, only document that one is needed and where.
- **"Resolve test grep tag" step** outputs `grep_arg` (the `--grep` argument), `folder` (`Smoke`/`Regression`), and `env_folder` (`Dev`/`QA`). `schedule` triggers carry no `workflow_dispatch` inputs, so `github.event.schedule` (the literal cron string that fired) is the only way to tell crons apart: the qa-regression, dev-regression, and qa-smoke crons are matched explicitly first; everything else (dev-smoke cron, push, PR, `workflow_dispatch`) falls through to the input-based branching with smoke/dev defaults. The `qa` → `QA` mapping is a literal `if`/`else` string match, **not** generic shell capitalization (`${var^}` would produce `Qa`) — don't "simplify" it.
- **Three-place cron duplication, by design**: the job-level `environment:` key is evaluated before any step runs and cannot reference `steps.grep-tag.outputs.*`, so both qa cron strings (`30 6 * * *` daily qa-smoke, `45 8 * * 1` weekly qa-regression) are hardcoded literally in three places: (1) the `schedule:` trigger list, (2) the job-level `environment:` expression (`${{ github.event.inputs.environment || (github.event.schedule == '45 8 * * 1' && 'qa') || (github.event.schedule == '30 6 * * *' && 'qa') || 'dev' }}` — dispatch input wins, then either qa cron, then `dev`), and (3) the identical expression on the `Environment=` line in the "Add Allure environment and executor info" heredoc, so the Allure report's environment label matches the secrets the run actually used. **If a cron time ever changes, all three spots for that cron must change together** — anything less silently desyncs them (e.g. the job pulls `qa` secrets while the report prints `Environment=dev`).
- **Report layout** on `gh-pages` (served at https://guneyekiz.github.io/playwright/): run-folder-first, env-second, tool-third — `reports/<Smoke|Regression>/<Dev|QA>/<timestamp>/<allure|playwright>/`. Each of the four folder/env combinations keeps its own independent `latest` (e.g. `reports/Smoke/Dev/latest/{allure,playwright}/`); a run only ever updates its own combination's `latest`, never another's. The root `index.html` is regenerated every run by a nested loop: one `<h2>` per subset, one `<h3>` per environment, each with latest + historical timestamped links.
- **Legacy layouts**: `gh-pages` still holds reports from three older layouts (pre-env-split `reports/<Folder>/<timestamp>/`, tool-first `reports/<allure|playwright>/<subset>/`, flat `reports/allure/<timestamp>/`). They're unlinked from the regenerated index but reachable by direct URL; the "Remove all except index.html and reports directory" step preserves the whole `reports/` tree, so they coexist harmlessly. No migration or pruning is planned (see backlog) — don't migrate or delete them as a side effect of anything.
- The "Run Playwright tests" step passes `--workers=4` unconditionally, overriding `playwright.config.ts`'s `workers: process.env.CI ? 1 : undefined` from the CLI (CLI flags win over config). The suite is network-bound on the remote demo site, not CPU-bound, so exceeding the runner's 2 cores is fine. The override lives only in the workflow — `playwright.config.ts` wasn't touched and isn't this agent's file to edit.
- The `gh-pages` push authenticates with a separate PAT, `secrets.ACCESS_TOKEN2`, not the default `GITHUB_TOKEN` — don't assume the job's `permissions:` block (`contents: write`, `deployments: write`) is what authorizes it, and don't trim those permissions without checking what actually depends on them.
- The run also writes the Allure "Environment" widget (`environment.properties`) and `executor.json` from `github.run_number`/`run_id`.
- **Report URLs**: the two "Output ... report URL" echo steps and the Slack step all build the Pages URL in shell as `https://${GITHUB_REPOSITORY_OWNER}.github.io/${GITHUB_REPOSITORY#*/}/reports/...` — `github.repository` already contains `owner/repo`, so interpolating it whole after the owner would double the owner segment and break the URL.
- **Slack notification**: a final "Notify Slack" step posts results via Incoming Webhook, gated `if: always() && (github.event_name == 'schedule' || github.event_name == 'workflow_dispatch')` — push/PR runs stay silent, otherwise every commit to main would page the channel. Fires on every qualifying run, pass or fail, so the channel gets a running history. `continue-on-error: true`, and it no-ops cleanly (`exit 0` with a message) if `secrets.SLACK_WEBHOOK_URL` is empty — a missing secret or failed POST can't flip an otherwise-good run red.
  - "Run Playwright tests" carries `id: run-tests` and `continue-on-error: true` — the job stays green (and still deploys reports) even when tests fail, so `steps.run-tests.outcome` is the **only** reliable pass/fail signal, never the job's own status.
  - Counts come from the "Extract test result counts" step (`id: test-counts`), which reads `allure-report/widgets/summary.json` via `jq` (preinstalled on `ubuntu-latest`) into `passed`/`failed`/`broken`/`skipped`/`total` outputs.
  - The payload is built with `jq -n` object construction (not string concatenation, so values can't break out of the JSON) and contains the pass/fail label, the `folder`/`env_folder` label, the five counts, a link to that combination's `latest` Allure report, and a link to the Actions run.
  - **`SLACK_WEBHOOK_URL`** is a single **repository-level** Actions secret (Settings → Secrets and variables → Actions) — unlike the five per-Environment secrets it is *not* duplicated into `dev`/`qa`, since one Slack channel covers all environments. A maintainer creates it via Slack's "Incoming Webhooks" app; no agent can create a GitHub secret.

## Security specs — `tests/security/` (owned by `playwright-security-tester`)

`tests/security/*.security.spec.ts` holds permanent regression specs, each locking in a *confirmed* live finding (response headers, cookie flags, basic-auth enumeration behavior, reflected-input encoding, transport/error-page leakage, etc.), cross-referenced against `docs/app-exploration.md`. Same conventions apply as everywhere else (env vars, web-first assertions, no hardcoded creds).

All six specs in this directory are tagged `@regression` only, never `@smoke` (via Playwright's `test.describe(name, { tag: '@regression' }, ...)`, not title-string embedding). Smoke's job is "is the app up and is the critical path intact" — these specs test correctness/compliance (header presence, cookie flags, XSS encoding, transport leakage), not uptime. They're individually cheap, but a failing security check shouldn't be confused with an outage signal in a fast morning gate. New security specs should follow the same tagging.

## Accessibility specs — `tests/accessibility/` (owned by `playwright-accessibility-tester`)

`tests/accessibility/*.a11y.spec.ts` holds axe-core and/or Lighthouse-based checks. `login.a11y.spec.ts` is the existing baseline: a Lighthouse accessibility-score threshold on `/login` (manual `chromium.launch()`, see the `baseURL` exception above) and an axe-core violations-count baseline on `/secure`. This is a **public demo site the project doesn't control** — it won't hit a perfect score. New specs should assert against a measured baseline with headroom for regressions (exactly like the existing thresholds: 80 against a measured 87, ≤5 violations against a measured baseline), not a hypothetical "zero violations." Re-measure before picking a new page's baseline rather than guessing a number.
- `login.a11y.spec.ts`'s `describe` block (both tests) is tagged `@regression` only, never `@smoke`. The Lighthouse test launches its own Chromium via CDP and runs a full audit — the most expensive test in the suite by a wide margin, with no place in a fast morning smoke gate. The axe-core test is cheap by comparison (it inspects the already-rendered DOM, no extra navigation) but stays out of `@smoke` anyway: accessibility regressions aren't an uptime signal, so cost alone isn't the deciding factor.
