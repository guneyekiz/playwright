import { test, expect } from '@playwright/test';

// Confirmed live (2026-06-21): /redirector's link has a relative href ("redirect") -
// the target is fixed server-side, not driven by a query/form parameter an attacker
// could repoint at an arbitrary external host. Clicking it lands on /status_codes on
// the same origin. This spec locks in that same-origin behavior; it is not a
// parameterized open-redirect (there's no user-controlled redirect target on this
// app to probe with a crafted value).
test.describe('Redirect Link (/redirector)', { tag: '@regression' }, () => {
  test('redirect link points to a relative, same-origin target', async ({ page }) => {
    await page.goto('/redirector');

    const link = page.getByRole('link', { name: /here/i });
    const href = await link.getAttribute('href');

    expect(href).toBe('redirect');
    expect(href).not.toMatch(/^https?:\/\//);
  });

  test('following the redirect link stays on the same origin', async ({ page, baseURL }) => {
    await page.goto('/redirector');

    await page.getByRole('link', { name: /here/i }).click();

    await expect(page).toHaveURL(`${baseURL}/status_codes`);
  });
});
