import { test, expect } from '@playwright/test';
import { DynamicLoadingPage } from '../pages/DynamicLoadingPage';

// Both examples involve a genuine ~5s async delay (the site's own setTimeout) after
// clicking Start before the "Hello World!" text appears, which is longer than Playwright's
// default 5000ms assertion timeout. Rather than reach for waitForTimeout, the specific
// post-delay assertions below are given a longer explicit timeout so toBeVisible()'s
// auto-wait/retry has enough room to outlast the real delay.
const POST_DELAY_TIMEOUT = 10_000;

test.describe('Dynamic Loading', { tag: '@regression' }, () => {
  test('Example 1: hidden element is shown after the delay', async ({ page }) => {
    const dynamicLoadingPage = new DynamicLoadingPage(page);
    await dynamicLoadingPage.gotoExample1();

    await expect(dynamicLoadingPage.finishText).toBeHidden();

    await dynamicLoadingPage.start();

    await expect(dynamicLoadingPage.finishText).toBeVisible({ timeout: POST_DELAY_TIMEOUT });
    await expect(dynamicLoadingPage.finishText).toHaveText('Hello World!');
  });

  test('Example 2: element is rendered from nothing after the delay', async ({ page }) => {
    const dynamicLoadingPage = new DynamicLoadingPage(page);
    await dynamicLoadingPage.gotoExample2();

    await expect(dynamicLoadingPage.finishText).toHaveCount(0);

    await dynamicLoadingPage.start();

    await expect(dynamicLoadingPage.finishText).toBeVisible({ timeout: POST_DELAY_TIMEOUT });
    await expect(dynamicLoadingPage.finishText).toHaveText('Hello World!');
  });
});
