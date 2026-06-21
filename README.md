# playwright

Playwright test automation suite for [the-internet.herokuapp.com](https://the-internet.herokuapp.com), a public QA practice site. Covers UI, API, and accessibility testing for the login flow, with Allure reporting and CI deployment to GitHub Pages.

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
```

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

## CI

Workflows live in `.github/workflows/`:

- **allure2.yml** — the active pipeline. Runs on push/PR to `main`, builds the Playwright + Allure reports, and deploys both to `gh-pages` (served at https://guneyekiz.github.io/playwright/). Also supports manual `workflow_dispatch` with a `dev`/`qa` environment choice.
- **alluremanual.yml**, **playwright.yml**, **allure.yml** — not part of the normal push/PR flow (manual-dispatch-only or pointed at non-default branches). See `.claude/agents/playwright-builder.md` for the full rationale before changing their triggers.

## Working with Claude Code

This repo has Claude Code subagents under `.claude/agents/`: `playwright-builder` (writes/edits tests and CI), `playwright-reviewer` (reviews changes), `playwright-manual-tester` (exploratory QA, no committed code). The usual flow is build → review: after `playwright-builder` makes a change, `playwright-reviewer` checks it before it's considered done. `playwright-builder.md` is the source of truth for this project's conventions — read it before making structural changes.
