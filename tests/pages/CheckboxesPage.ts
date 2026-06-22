import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckboxesPage extends BasePage {
  readonly checkboxes = this.page.getByRole('checkbox');

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/checkboxes');
  }

  checkbox(index: number) {
    return this.checkboxes.nth(index);
  }
}
