# Backlog — deferred decisions and known issues

Known-but-deliberately-unfixed items, kept here so `.claude/agents/CONVENTIONS.md` can stay current-state-only instead of accumulating "confirmed but not fixed" prose. Each entry names the agent whose territory it falls in. Remove an entry in the same change that resolves it.

## CI/CD (`playwright-devops`)

- **No `concurrency:` group on `allure.yml`.** The four cron schedules are staggered so they never fire on the same instant as each other, but a manual `workflow_dispatch` landing at the same moment as a scheduled run can still race on the `git push -fu` to `gh-pages` — one force-push silently dropping the other's report. Flagged, not addressed; adding a group is a deliberate separate decision, not something to bundle into an unrelated change.
- **No retention/pruning of timestamped report folders on `gh-pages`.** At two scheduled smoke runs per day plus weekly regression runs, timestamped folders accumulate indefinitely. Confirmed and explicitly left out of scope.
- **Legacy report layouts orphaned on `gh-pages`.** Reports from three older layouts (pre-env-split `reports/<Smoke|Regression>/<timestamp>/`, tool-first `reports/<allure|playwright>/<subset>/`, and flat `reports/allure/<timestamp>/`) no longer appear in the regenerated `index.html` but remain on the branch, reachable by direct URL if bookmarked. No migration was done or is planned.

## Test suite (`playwright-builder`)

- **`playwright-bdd` is installed but not wired into `playwright.config.ts`.** Don't assume Gherkin/BDD support works until it's actually configured.
- **Missing/empty `.env.dev` fails confusingly.** `baseURL` resolves to `undefined` and tests die with a navigation error instead of a clear "missing config" message. A config-time guard (fail fast if `BASE_URL` is unset) would fix it; not done yet.
