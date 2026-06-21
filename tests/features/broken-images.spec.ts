import { test, expect } from '@playwright/test';
import { BrokenImagesPage } from '../pages/BrokenImagesPage';

// This page's whole premise is two intentionally broken <img> sources (see Finding 9 in
// docs/app-exploration.md) — a 404 is the expected/correct behavior here, not a defect.
test.describe('Broken Images', () => {
  test('renders exactly three images in the example section', async ({ page }) => {
    const brokenImagesPage = new BrokenImagesPage(page);
    await brokenImagesPage.goto();

    await expect(brokenImagesPage.images).toHaveCount(3);
  });

  test('the first two images are broken and the third loads successfully', async ({ page }) => {
    const brokenImagesPage = new BrokenImagesPage(page);
    await brokenImagesPage.goto();

    await expect(brokenImagesPage.images.nth(2)).toBeVisible();
    expect(await brokenImagesPage.isBroken(0)).toBe(true);
    expect(await brokenImagesPage.isBroken(1)).toBe(true);
    expect(await brokenImagesPage.isBroken(2)).toBe(false);
  });

  test('the broken images respond with 404', async ({ page }) => {
    const brokenImagesPage = new BrokenImagesPage(page);
    await brokenImagesPage.goto();
    await expect(brokenImagesPage.images.nth(2)).toBeVisible();

    const srcs = await brokenImagesPage.images.evaluateAll((imgs) =>
      imgs.map((img) => (img as HTMLImageElement).src)
    );
    const statuses = await Promise.all(srcs.map(async (src) => (await page.request.get(src)).status()));

    expect(statuses.sort()).toEqual([200, 404, 404]);
  });
});
