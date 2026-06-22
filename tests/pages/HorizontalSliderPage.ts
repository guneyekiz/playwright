import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HorizontalSliderPage extends BasePage {
  readonly slider = this.page.getByRole('slider');
  readonly rangeValue = this.page.locator('#range');

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/horizontal_slider');
  }

  // <input type="range"> doesn't support fill(); the page's own instructions say to focus
  // the slider and use arrow keys (or drag), so that's what this drives. Each press moves
  // by the slider's step (0.5).
  async increase(times = 1) {
    await this.slider.focus();
    for (let i = 0; i < times; i++) {
      await this.slider.press('ArrowRight');
    }
  }

  async decrease(times = 1) {
    await this.slider.focus();
    for (let i = 0; i < times; i++) {
      await this.slider.press('ArrowLeft');
    }
  }
}
