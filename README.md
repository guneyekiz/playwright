# playwright

Playwright test automation suite for [the-internet.herokuapp.com](https://the-internet.herokuapp.com), a public QA practice site. Covers UI, API, and accessibility testing for the login flow, plus a growing catalog of the site's other example feature pages (tracked in [docs/app-exploration.md](docs/app-exploration.md)), with Allure reporting and CI deployment to GitHub Pages.

## Tech stack

- [Playwright Test](https://playwright.dev/) (TypeScript)
- [Allure](https://allurereport.org/) for test reporting — the `allure-commandline` devDependency ships the CLI, no separate install needed
- [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) + [playwright-lighthouse](https://github.com/abhinaba-ghosh/playwright-lighthouse) for accessibility audits
- `playwright-bdd` is installed as a devDependency but not yet wired into the config

## Project structure

```
tests/
  login.spec.ts              UI login flow (valid/invalid credentials)
  pages/
    BasePage.ts               base class: holds Page, exposes goto(path)
    LoginPage.ts               login page locators + actions
    AbTestPage.ts              /abtest locators
    AddRemoveElementsPage.ts   /add_remove_elements/ locators + actions
    BasicAuthPage.ts           /basic_auth locators
    BrokenImagesPage.ts        /broken_images locators + helpers
    CheckboxesPage.ts          /checkboxes locators
    DropdownPage.ts            /dropdown locators + actions
    DynamicControlsPage.ts     /dynamic_controls locators + actions
    DynamicLoadingPage.ts      /dynamic_loading/1 and /2 locators + actions
    ForgotPasswordPage.ts      /forgot_password locators + actions
    HorizontalSliderPage.ts    /horizontal_slider locators + keyboard actions
    InputsPage.ts              /inputs locators + actions
    JavascriptAlertsPage.ts    /javascript_alerts locators + dialog-handling actions
  features/                  one spec per example page from docs/app-exploration.md
    ab-test.spec.ts             A/B Testing (asserts on either heading variant — random by design)
    add-remove-elements.spec.ts Add/Remove Elements
    basic-auth.spec.ts          Basic Auth (valid/invalid creds via browser.newContext({ httpCredentials }))
    broken-images.spec.ts       Broken Images
    checkboxes.spec.ts          Checkboxes
    dropdown.spec.ts            Dropdown
    dynamic-controls.spec.ts    Dynamic Controls (checkbox/input enable-disable with a real delay)
    dynamic-loading.spec.ts     Dynamic Loading (both sub-examples, with a real delay)
    forgot-password.spec.ts     Forgot Password (regression spec locking in a known 500 bug)
    horizontal-slider.spec.ts   Horizontal Slider
    inputs.spec.ts              Inputs
    javascript-alerts.spec.ts   JavaScript Alerts (alert/confirm/prompt dialogs)
    status-codes.spec.ts        Status Codes (asserts on raw goto() response status, no page object)
  security/                  permanent regression specs for confirmed security findings (docs/app-exploration.md)
    basic-auth.security.spec.ts          Basic Auth enumeration/failure behavior
    cookies.security.spec.ts             session cookie flags (HttpOnly/SameSite/Secure)
    headers.security.spec.ts             response security headers on /login
    redirector.security.spec.ts          /redirector stays relative/same-origin
    transport-and-error-pages.security.spec.ts  HTTPS enforcement + error-page leakage
    xss-reflection.security.spec.ts      reflected-input encoding on the login form
  api/
    login.api.spec.ts          API-level tests against /authenticate
  accessibility/
    login.a11y.spec.ts         axe-core + Lighthouse accessibility checks
.github/workflows/             CI pipelines (see below)
playwright.config.ts           Playwright config (testDir, reporters, baseURL)
```

## Setup

Requires Node 20+ (matches CI). Other versions may work but can print `EBADENGINE` warnings from transitive deps.

```
npm install
npx playwright install   # downloads browser binaries — required before the first run
```

Create `.env.dev` (and optionally `.env.qa`) in the repo root — both are gitignored, so ask a maintainer for values:

```
BASE_URL=https://the-internet.herokuapp.com
TEST_USERNAME=...
TEST_PASSWORD=...
BASIC_AUTH_USERNAME=...
BASIC_AUTH_PASSWORD=...
```

`BASIC_AUTH_USERNAME`/`BASIC_AUTH_PASSWORD` are for `tests/features/basic-auth.spec.ts` and `tests/security/basic-auth.security.spec.ts` (the `/basic_auth` page's own documented demo credential, `admin`/`admin` — routed through env vars rather than hardcoded, per this repo's convention). For CI, these also need adding as secrets to both the `dev` and `qa` GitHub Environments alongside the existing `BASE_URL`/`TEST_USERNAME`/`TEST_PASSWORD`, or both basic-auth specs will fail in CI.

`playwright.config.ts` also reads an optional `SLOWMO` (ms) to slow down headed runs for debugging.

If `.env.dev` is missing or empty, `baseURL` resolves to `undefined` and tests fail with a confusing navigation error rather than a clear "missing config" message — check this first if a fresh clone fails immediately.

## Running tests

```
npm test          # runs against .env.dev, then opens reports (see below)
npm run test:dev  # same as above, explicit
npm run test:qa   # runs against .env.qa (TEST_ENV=qa) — does NOT open reports afterward
```

`npm test`/`npm run test:dev` trigger the `posttest` npm lifecycle hook, which runs `allure generate allure-results --clean && allure open && npx playwright show-report`. **`allure open` starts a local web server and blocks the terminal** — the command will not return, and `npx playwright show-report` will not run, until you stop the Allure server (Ctrl+C in that terminal). This is expected, not a hang.

The two reports show different things: the **Playwright HTML report** (`npx playwright show-report`) is per-run detail — pass/fail, steps, screenshots, traces. **Allure** (`allure open`) is the aggregated/historical view — trends across runs, environment info. Check the Playwright report first when debugging a single failure.

To run a single spec without triggering `posttest`: `npx playwright test tests/login.spec.ts`

Tests are tagged `@smoke` (fast critical-path checks) or `@regression` (everything else). Run a subset with `npm run test:smoke` / `npm run test:regression`, or directly via `npx playwright test --grep @smoke`.

## CI

A single workflow, **allure.yml**, in `.github/workflows/`. Runs on push/PR to `main` (both greps for `@smoke`), builds the Playwright + Allure reports, and deploys both to `gh-pages` (served at https://guneyekiz.github.io/playwright/). Also supports manual `workflow_dispatch` with a `dev`/`qa` environment choice and a `smoke`/`regression` test-subset choice (default `smoke`; `regression` only ever runs via this manual trigger), plus an hourly scheduled run (cron, UTC) that always greps for `@smoke` against `dev`. Reports are organized run-folder-first, then by environment — `reports/<Smoke|Regression>/<Dev|QA>/<timestamp|latest>/<allure|playwright>/` — so each subset/environment combination keeps its own independent "latest" report. Reports from before this environment split (no `Dev`/`QA` segment) remain on `gh-pages` but are no longer linked from the generated index.

## Working with Claude Code

This repo has Claude Code subagents under `.claude/agents/`, each with a narrow, non-overlapping scope:

- `playwright-builder` — writes/edits specs and page objects, fixes flaky tests.
- `playwright-devops` — owns `.github/workflows/*.yml`, report generation, and `gh-pages` deployment.
- `playwright-security-tester` — audits the repo/pipeline for security issues and writes permanent regression specs under `tests/security/`.
- `playwright-accessibility-tester` — audits UI changes for accessibility impact and writes permanent regression specs under `tests/accessibility/`.
- `playwright-reviewer` — reviews changes from any of the above for correctness and convention adherence. Read-only.
- `playwright-manual-tester` — exploratory QA against the live app, no committed code.
- `playwright-manager` — maintains the agent system itself: checks for overlap/staleness between the agents above and keeps their docs consistent. Invoked on demand, not automatically.

The usual flow is build → review: after a builder-type agent makes a change, `playwright-reviewer` checks it before it's considered done. `.claude/agents/CONVENTIONS.md` is the shared source of truth for this project's conventions — every agent reads it first; read it yourself before making structural changes.
