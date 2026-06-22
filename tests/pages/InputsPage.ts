import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InputsPage extends BasePage {
  readonly numberInput = this.page.getByRole('spinbutton');

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/inputs');
  }

  async typeText(text: string) {
    await this.numberInput.pressSequentially(text);
  }
}
