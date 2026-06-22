import { test, expect } from '@playwright/test';
import { BasicAuthPage } from '../pages/BasicAuthPage';

// Chromium's page.goto() rejects credentials embedded in the URL itself
// (https://user:pass@host/path) with net::ERR_INVALID_AUTH_CREDENTIALS — see Finding 5 in
// docs/app-exploration.md. browser.newContext({ httpCredentials }) is the reliable approach,
// so every test here creates its own context instead of using the default `page` fixture.
const BASIC_AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME!;
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD!;

test.describe('Basic Auth', { tag: '@regression' }, () => {
  test('authenticates and renders the protected page with correct credentials', async ({ browser }) => {
    const context = await browser.newContext({
      httpCredentials: { username: BASIC_AUTH_USERNAME, password: BASIC_AUTH_PASSWORD },
    });
    const page = await context.newPage();
    const basicAuthPage = new BasicAuthPage(page);

    const response = await page.goto('/basic_auth');

    expect(response?.status()).toBe(200);
    await expect(basicAuthPage.congratsMessage).toContainText('Congratulations');

    await context.close();
  });

  test('is rejected with the wrong password', async ({ browser }) => {
    const context = await browser.newContext({
      httpCredentials: { username: BASIC_AUTH_USERNAME, password: 'wrongpassword' },
    });
    const page = await context.newPage();

    const response = await page.goto('/basic_auth');

    expect(response?.status()).toBe(401);

    await context.close();
  });

  test('is rejected with no credentials', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const response = await page.goto('/basic_auth');

    expect(response?.status()).toBe(401);

    await context.close();
  });
});
