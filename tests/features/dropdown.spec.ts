import { test, expect } from '@playwright/test';
import { DropdownPage } from '../pages/DropdownPage';

test.describe('Dropdown', { tag: '@regression' }, () => {
  test('starts with the disabled placeholder option selected', async ({ page }) => {
    const dropdownPage = new DropdownPage(page);
    await dropdownPage.goto();

    await expect(dropdownPage.dropdown).toHaveValue('');
  });

  test('selecting Option 1 updates the selected value', async ({ page }) => {
    const dropdownPage = new DropdownPage(page);
    await dropdownPage.goto();

    await dropdownPage.selectOption1();

    await expect(dropdownPage.dropdown).toHaveValue('1');
  });

  test('selecting Option 2 updates the selected value', async ({ page }) => {
    const dropdownPage = new DropdownPage(page);
    await dropdownPage.goto();

    await dropdownPage.selectOption2();

    await expect(dropdownPage.dropdown).toHaveValue('2');
  });
});
