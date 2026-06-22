import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DropdownPage extends BasePage {
  readonly dropdown = this.page.getByRole('combobox');

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/dropdown');
  }

  async selectOption1() {
    await this.dropdown.selectOption('1');
  }

  async selectOption2() {
    await this.dropdown.selectOption('2');
  }
}
