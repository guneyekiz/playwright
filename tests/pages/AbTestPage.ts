import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AbTestPage extends BasePage {
  readonly heading = this.page.locator('.example').getByRole('heading', { level: 3 });
  readonly paragraph = this.page.locator('.example p');

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/abtest');
  }
}
