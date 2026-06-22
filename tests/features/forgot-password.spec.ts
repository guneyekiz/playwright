import { test, expect } from '@playwright/test';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';

// This spec intentionally asserts on a 500 response, not a success path. Submitting this
// form currently returns a genuine HTTP 500 from the server (confirmed live and documented
// as Finding 2 in docs/app-exploration.md) — the page still renders a generic response and
// stays on /forgot_password, it isn't a hard crash, but the server-side handler errors out.
// This is a regression spec locking in that *current* (buggy) behavior: if the server-side
// bug is ever fixed, this test will start failing and needs to be updated to assert success
// instead — that failure is the point, it's how a behavior change here gets noticed.
test.describe('Forgot Password', () => {
  test('submitting the form currently returns a 500 (known server-side bug)', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();

    await forgotPasswordPage.fillEmail('test@example.com');

    const [response] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/forgot_password') && r.request().method() === 'POST'
      ),
      forgotPasswordPage.submitButton.click(),
    ]);

    expect(response.status()).toBe(500);
    // The app doesn't hard-crash on the error — it stays on the same page.
    await expect(page).toHaveURL(/\/forgot_password$/);
  });
});
