import { test, expect } from '@playwright/test';
import { AbTestPage } from '../pages/AbTestPage';

// The server renders a "No A/B Test" placeholder heading; Optimizely's client-side snippet
// then rewrites it to one of two weighted variants before the page settles (see Findings 1
// and 6 in docs/app-exploration.md). A real browser never shows the placeholder long enough
// to assert on it, so these specs assert on the post-rewrite heading only, via a regex that
// covers both variants instead of pinning to one.
test.describe('A/B Testing', { tag: '@regression' }, () => {
  test('serves one of the two known heading variants', async ({ page }) => {
    const abTestPage = new AbTestPage(page);
    await abTestPage.goto();

    await expect(abTestPage.heading).toHaveText(/^A\/B Test (Control|Variation 1)$/);
  });

  test('renders the explanatory paragraph regardless of variant', async ({ page }) => {
    const abTestPage = new AbTestPage(page);
    await abTestPage.goto();

    await expect(abTestPage.paragraph).toContainText('split testing');
  });
});
