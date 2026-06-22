import { test, expect } from '@playwright/test';
import { DynamicControlsPage } from '../pages/DynamicControlsPage';

// Both actions involve a genuine ~3s simulated server delay (a "Wait for it..." loader)
// before the DOM updates, which is close enough to Playwright's default 5000ms assertion
// timeout to be flaky under load. Rather than reach for waitForTimeout, the specific
// post-delay assertions below are given a longer explicit timeout so the auto-wait/retry
// has enough room to outlast the real delay.
const POST_DELAY_TIMEOUT = 10_000;

test.describe('Dynamic Controls', () => {
  test('Remove button removes the checkbox, Add brings it back', async ({ page }) => {
    const dynamicControlsPage = new DynamicControlsPage(page);
    await dynamicControlsPage.goto();

    await expect(dynamicControlsPage.checkbox).toBeVisible();

    await dynamicControlsPage.removeCheckbox();

    await expect(dynamicControlsPage.checkbox).toHaveCount(0, { timeout: POST_DELAY_TIMEOUT });
    await expect(dynamicControlsPage.message).toHaveText("It's gone!");

    await dynamicControlsPage.addCheckbox();

    await expect(dynamicControlsPage.checkbox).toBeVisible({ timeout: POST_DELAY_TIMEOUT });
    await expect(dynamicControlsPage.message).toHaveText("It's back!");
  });

  test('Enable button enables the input, Disable disables it again', async ({ page }) => {
    const dynamicControlsPage = new DynamicControlsPage(page);
    await dynamicControlsPage.goto();

    await expect(dynamicControlsPage.textInput).toBeDisabled();

    await dynamicControlsPage.enableInput();

    await expect(dynamicControlsPage.textInput).toBeEnabled({ timeout: POST_DELAY_TIMEOUT });
    await expect(dynamicControlsPage.message).toHaveText("It's enabled!");

    await dynamicControlsPage.disableInput();

    await expect(dynamicControlsPage.textInput).toBeDisabled({ timeout: POST_DELAY_TIMEOUT });
    await expect(dynamicControlsPage.message).toHaveText("It's disabled!");
  });
});
