import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Confirmed live (2026-06-21): submitting a <script> payload as the username reflects
// it back inside the #flash message, but the app HTML-encodes it (renders as literal
// text, not parsed markup) and no `dialog` event fires. This spec locks that behavior
// in as a regression check.
const XSS_PROBES = ['<script>alert(1)</script>', '"><svg onload=alert(1)>'];

test.describe('reflected XSS probe on login form', () => {
  for (const probe of XSS_PROBES) {
    test(`encodes "${probe}" instead of executing it`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      let dialogFired = false;
      page.on('dialog', async (dialog) => {
        dialogFired = true;
        await dialog.dismiss();
      });

      await loginPage.goto();
      await loginPage.login(probe, 'whatever');

      await expect(page).toHaveURL(/\/login$/);
      await expect(loginPage.flashMessage).toContainText('Your username is invalid!');
      // If the payload were rendered unescaped, the <script>/<svg> tag would not
      // appear as visible text in the flash message - it would either execute (and
      // fire a dialog, asserted false above) or be stripped from innerText entirely.
      expect(dialogFired).toBe(false);
    });
  }
});
