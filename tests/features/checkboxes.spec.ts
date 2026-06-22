import { test, expect } from '@playwright/test';
import { CheckboxesPage } from '../pages/CheckboxesPage';

test.describe('Checkboxes', { tag: '@regression' }, () => {
  test('checkbox 1 starts unchecked and checkbox 2 starts checked', async ({ page }) => {
    const checkboxesPage = new CheckboxesPage(page);
    await checkboxesPage.goto();

    await expect(checkboxesPage.checkbox(0)).not.toBeChecked();
    await expect(checkboxesPage.checkbox(1)).toBeChecked();
  });

  test('toggling checkbox 1 checks it', async ({ page }) => {
    const checkboxesPage = new CheckboxesPage(page);
    await checkboxesPage.goto();

    await checkboxesPage.checkbox(0).check();

    await expect(checkboxesPage.checkbox(0)).toBeChecked();
  });

  test('toggling checkbox 2 unchecks it', async ({ page }) => {
    const checkboxesPage = new CheckboxesPage(page);
    await checkboxesPage.goto();

    await checkboxesPage.checkbox(1).uncheck();

    await expect(checkboxesPage.checkbox(1)).not.toBeChecked();
  });
});
