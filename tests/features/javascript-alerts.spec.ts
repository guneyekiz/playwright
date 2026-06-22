import { test, expect } from '@playwright/test';
import { JavascriptAlertsPage } from '../pages/JavascriptAlertsPage';

test.describe('JavaScript Alerts', () => {
  test('clicking OK on the alert reports a successful click', async ({ page }) => {
    const alertsPage = new JavascriptAlertsPage(page);
    await alertsPage.goto();

    await alertsPage.triggerAlertAndAccept();

    await expect(alertsPage.resultText).toHaveText('You successfully clicked an alert');
  });

  test('clicking OK on the confirm reports Ok', async ({ page }) => {
    const alertsPage = new JavascriptAlertsPage(page);
    await alertsPage.goto();

    await alertsPage.triggerConfirmAndAccept();

    await expect(alertsPage.resultText).toHaveText('You clicked: Ok');
  });

  test('clicking Cancel on the confirm reports Cancel', async ({ page }) => {
    const alertsPage = new JavascriptAlertsPage(page);
    await alertsPage.goto();

    await alertsPage.triggerConfirmAndDismiss();

    await expect(alertsPage.resultText).toHaveText('You clicked: Cancel');
  });

  test('entering text and clicking OK on the prompt echoes the entered text', async ({ page }) => {
    const alertsPage = new JavascriptAlertsPage(page);
    await alertsPage.goto();

    await alertsPage.triggerPromptAndAcceptWithText('Playwright');

    await expect(alertsPage.resultText).toHaveText('You entered: Playwright');
  });

  test('dismissing the prompt reports a null entry', async ({ page }) => {
    const alertsPage = new JavascriptAlertsPage(page);
    await alertsPage.goto();

    await alertsPage.triggerPromptAndDismiss();

    await expect(alertsPage.resultText).toHaveText('You entered: null');
  });
});
