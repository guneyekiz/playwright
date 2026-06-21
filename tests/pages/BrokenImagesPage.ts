import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class BrokenImagesPage extends BasePage {
  readonly images = this.page.locator('.example img');

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/broken_images');
  }

  async isBroken(index: number) {
    return (await this.images.nth(index).evaluate((img: HTMLImageElement) => img.naturalWidth)) === 0;
  }
}
