import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

const TEST_USERNAME = process.env.TEST_USERNAME!;
const TEST_PASSWORD = process.env.TEST_PASSWORD!;

test('logs in successfully with valid credentials', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(TEST_USERNAME, TEST_PASSWORD);

  await expect(page).toHaveURL(/\/secure$/);
  await expect(loginPage.flashMessage).toContainText('You logged into a secure area!');
});

test('shows an error with invalid credentials', { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(TEST_USERNAME, 'wrongpassword');

  await expect(page).toHaveURL(/\/login$/);
  await expect(loginPage.flashMessage).toContainText('Your password is invalid!');
});
