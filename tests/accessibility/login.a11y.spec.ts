import { test, expect, chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LoginPage } from '../pages/LoginPage';

// playwright-lighthouse is published as an ESM-only package, but this project's
// TS files are transpiled to CommonJS, so it must be brought in via a dynamic
// import() inside the test rather than a static `import` (which would emit a
// `require()` call and fail at module load time).
async function getPlayAudit() {
  const { playAudit } = await import('playwright-lighthouse');
  return playAudit;
}

const TEST_USERNAME = process.env.TEST_USERNAME!;
const TEST_PASSWORD = process.env.TEST_PASSWORD!;

test.describe('login flow accessibility', { tag: '@regression' }, () => {
  test('login page meets accessibility threshold (Lighthouse)', async ({}, testInfo) => {
    // playAudit() attaches over the Chrome DevTools Protocol, so this launches its own
    // chromium instance with a debugging port instead of using the default `page` fixture.
    // The port is derived from testInfo.parallelIndex (unique per running worker) so it
    // stays collision-free if another Lighthouse-based spec ever runs concurrently.
    const cdpPort = 9222 + testInfo.parallelIndex;
    const browser = await chromium.launch({
      args: [`--remote-debugging-port=${cdpPort}`],
    });

    try {
      const playAudit = await getPlayAudit();
      const context = await browser.newContext({ baseURL: process.env.BASE_URL });
      const page = await context.newPage();
      await page.goto('/login');

      await playAudit({
        page,
        port: cdpPort,
        thresholds: {
          // Measured accessibility score for this page is 87 (the-internet.herokuapp.com
          // is a public demo site we don't control). Threshold set with headroom below
          // the real measured score so the test still catches regressions.
          accessibility: 80,
        },
      });
    } finally {
      await browser.close();
    }
  });

  // Lighthouse's navigation-based audit runs in its own isolated browser context and
  // doesn't carry over the Playwright session cookie, so it can't reach an authenticated
  // page like /secure (it silently redirects back to /login instead). axe-core audits the
  // DOM that's already rendered in the live `page` with no re-navigation, so it works here.
  test('secure page has no new accessibility violations (axe-core)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USERNAME, TEST_PASSWORD);
    await page.waitForURL(/\/secure$/);

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations.filter((v) => v.impact === 'critical')).toEqual([]);
    // Measured baseline for this page is 5 violations (1 serious color-contrast, 4 moderate
    // heading/landmark issues) on a public demo site we don't control. Asserting against
    // that baseline catches regressions without requiring the site to be pixel-perfect.
    expect(
      results.violations.length,
      JSON.stringify(results.violations.map((v) => ({ id: v.id, impact: v.impact })))
    ).toBeLessThanOrEqual(5);
  });
});
