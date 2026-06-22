import { test, expect } from '@playwright/test';
import { BasicAuthPage } from '../pages/BasicAuthPage';

// /basic_auth's documented demo credentials (admin/admin) are not this repo's
// app-login TEST_USERNAME/TEST_PASSWORD, so they get their own env vars per
// repo convention. Wrong values below are intentionally-bad literals used only
// to exercise negative paths, which is fine per that same convention.
const VALID_USERNAME = process.env.BASIC_AUTH_USERNAME!;
const VALID_PASSWORD = process.env.BASIC_AUTH_PASSWORD!;

test.describe('Basic Auth (/basic_auth)', { tag: '@regression' }, () => {
  test('grants access with correct credentials', async ({ browser }) => {
    const context = await browser.newContext({
      httpCredentials: { username: VALID_USERNAME, password: VALID_PASSWORD },
    });
    const page = await context.newPage();
    const basicAuthPage = new BasicAuthPage(page);

    await basicAuthPage.goto();

    await expect(basicAuthPage.congratsMessage).toContainText('Congratulations');
    await context.close();
  });

  test('rejects a wrong password with a generic 401', async ({ browser }) => {
    const context = await browser.newContext({
      httpCredentials: { username: VALID_USERNAME, password: 'wrong-password' },
    });
    const page = await context.newPage();

    const response = await page.goto('/basic_auth');

    expect(response?.status()).toBe(401);
    await context.close();
  });

  test('rejects an unknown username with the same generic 401 (no enumeration)', async ({ browser }) => {
    const context = await browser.newContext({
      httpCredentials: { username: 'no-such-user', password: 'wrong-password' },
    });
    const page = await context.newPage();

    const response = await page.goto('/basic_auth');

    // Confirmed live: a bad username and a bad password both return a plain 401 with
    // no distinguishing body content, so the endpoint does not leak which credential
    // was wrong (no username-enumeration channel).
    expect(response?.status()).toBe(401);
    await context.close();
  });
});
