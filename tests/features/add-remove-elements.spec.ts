import { test, expect } from '@playwright/test';
import { AddRemoveElementsPage } from '../pages/AddRemoveElementsPage';

test.describe('Add/Remove Elements', { tag: '@regression' }, () => {
  test('starts with no Delete buttons', async ({ page }) => {
    const addRemovePage = new AddRemoveElementsPage(page);
    await addRemovePage.goto();

    await expect(addRemovePage.deleteButtons).toHaveCount(0);
  });

  test('adds one Delete button per click of Add Element', async ({ page }) => {
    const addRemovePage = new AddRemoveElementsPage(page);
    await addRemovePage.goto();

    await addRemovePage.addElement();
    await expect(addRemovePage.deleteButtons).toHaveCount(1);

    await addRemovePage.addElement();
    await addRemovePage.addElement();
    await expect(addRemovePage.deleteButtons).toHaveCount(3);
  });

  test('removes one Delete button per click, leaving the rest', async ({ page }) => {
    const addRemovePage = new AddRemoveElementsPage(page);
    await addRemovePage.goto();

    await addRemovePage.addElement();
    await addRemovePage.addElement();
    await addRemovePage.addElement();

    await addRemovePage.deleteFirstElement();
    await expect(addRemovePage.deleteButtons).toHaveCount(2);
  });

  test('removing the last Delete button returns to the empty state', async ({ page }) => {
    const addRemovePage = new AddRemoveElementsPage(page);
    await addRemovePage.goto();

    await addRemovePage.addElement();
    await addRemovePage.deleteFirstElement();

    await expect(addRemovePage.deleteButtons).toHaveCount(0);
  });
});
