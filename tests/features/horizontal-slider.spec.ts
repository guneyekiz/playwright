import { test, expect } from '@playwright/test';
import { HorizontalSliderPage } from '../pages/HorizontalSliderPage';

// <input type="range"> doesn't support locator.fill(); moving it requires keyboard arrow
// presses (or a mouse drag) while focused, per the page's own on-screen instructions.
test.describe('Horizontal Slider', { tag: '@regression' }, () => {
  test('starts at 0', async ({ page }) => {
    const sliderPage = new HorizontalSliderPage(page);
    await sliderPage.goto();

    await expect(sliderPage.rangeValue).toHaveText('0');
    await expect(sliderPage.slider).toHaveValue('0');
  });

  test('pressing the right arrow increases the displayed value by one step', async ({ page }) => {
    const sliderPage = new HorizontalSliderPage(page);
    await sliderPage.goto();

    await sliderPage.increase(1);

    await expect(sliderPage.rangeValue).toHaveText('0.5');
    await expect(sliderPage.slider).toHaveValue('0.5');
  });

  test('pressing the right arrow repeatedly moves toward the max value', async ({ page }) => {
    const sliderPage = new HorizontalSliderPage(page);
    await sliderPage.goto();

    await sliderPage.increase(10);

    await expect(sliderPage.rangeValue).toHaveText('5');
    await expect(sliderPage.slider).toHaveValue('5');
  });

  test('pressing the left arrow after increasing decreases the value again', async ({ page }) => {
    const sliderPage = new HorizontalSliderPage(page);
    await sliderPage.goto();

    await sliderPage.increase(3);
    await sliderPage.decrease(1);

    await expect(sliderPage.rangeValue).toHaveText('1');
    await expect(sliderPage.slider).toHaveValue('1');
  });
});
