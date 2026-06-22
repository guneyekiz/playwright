import { test, expect } from '@playwright/test';
import { InputsPage } from '../pages/InputsPage';

test.describe('Inputs', () => {
  test('accepts numeric entry', async ({ page }) => {
    const inputsPage = new InputsPage(page);
    await inputsPage.goto();

    await inputsPage.numberInput.fill('42');

    await expect(inputsPage.numberInput).toHaveValue('42');
  });

  test('rejects non-numeric keyboard input natively', async ({ page }) => {
    const inputsPage = new InputsPage(page);
    await inputsPage.goto();

    // type="number" filters non-numeric characters at the browser level, so typing
    // letters interspersed with digits should leave only the digits in the value.
    await inputsPage.typeText('a1b2c3');

    await expect(inputsPage.numberInput).toHaveValue('123');
  });
});
