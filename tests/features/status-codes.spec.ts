import { test, expect } from '@playwright/test';

// These sub-pages return their status code directly (no real redirect target behind 301,
// confirmed live: Playwright's response.request().redirectedFrom() is null) — no page
// object needed here per CONVENTIONS.md's guidance: when a test needs the raw navigation
// Response itself, call page.goto() directly rather than adding a return value to a page
// object's goto().
test.describe('Status Codes', () => {
  test('/status_codes/200 returns 200', async ({ page }) => {
    const response = await page.goto('/status_codes/200');
    expect(response?.status()).toBe(200);
  });

  test('/status_codes/301 returns 301', async ({ page }) => {
    const response = await page.goto('/status_codes/301');
    expect(response?.status()).toBe(301);
  });

  test('/status_codes/404 returns 404', async ({ page }) => {
    const response = await page.goto('/status_codes/404');
    expect(response?.status()).toBe(404);
  });

  test('/status_codes/500 returns 500', async ({ page }) => {
    const response = await page.goto('/status_codes/500');
    expect(response?.status()).toBe(500);
  });
});
