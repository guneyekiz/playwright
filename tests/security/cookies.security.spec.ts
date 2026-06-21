import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const TEST_USERNAME = process.env.TEST_USERNAME!;
const TEST_PASSWORD = process.env.TEST_PASSWORD!;

// Confirmed live (2026-06-21): after a successful login the app sets a `rack.session`
// cookie with HttpOnly but no SameSite attribute and no Secure flag, even though the
// site is served exclusively over HTTPS. The `sameSite: 'Lax'` asserted below is
// Chromium's own default for cookies that omit the attribute, not something the
// server explicitly sends (confirmed via the raw Set-Cookie header: `path=/; HttpOnly`
// only). Missing Secure on a session cookie is a real (if low-severity, given this is
// a public demo app) finding worth a permanent regression check.
test.describe('session cookie flags after login', () => {
  test('session cookie is HttpOnly and defaults to SameSite=Lax, but missing Secure', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USERNAME, TEST_PASSWORD);
    await expect(page).toHaveURL(/\/secure$/);

    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find((c) => c.name === 'rack.session');

    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.httpOnly).toBe(true);
    expect(sessionCookie?.sameSite).toBe('Lax');
    // Documents current (insecure) behavior rather than the ideal state - flip this
    // assertion to `toBe(true)` if/when the app starts marking the cookie Secure.
    expect(sessionCookie?.secure).toBe(false);
  });
});
