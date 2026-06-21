import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AddRemoveElementsPage extends BasePage {
  readonly addButton = this.page.getByRole('button', { name: 'Add Element' });
  readonly deleteButtons = this.page.getByRole('button', { name: 'Delete' });

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/add_remove_elements/');
  }

  async addElement() {
    await this.addButton.click();
  }

  async deleteFirstElement() {
    await this.deleteButtons.first().click();
  }
}
