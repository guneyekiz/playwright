import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DynamicControlsPage extends BasePage {
  // The checkbox's wrapper div (id="checkbox") only exists for the original element —
  // after Remove/Add it's re-created as a plain unwrapped <div>, so the checkbox is
  // scoped by role within the form instead of via that wrapper id.
  readonly checkboxExample = this.page.locator('#checkbox-example');
  readonly checkbox = this.checkboxExample.getByRole('checkbox');
  readonly removeAddButton = this.checkboxExample.getByRole('button');
  readonly inputExample = this.page.locator('#input-example');
  readonly textInput = this.inputExample.getByRole('textbox');
  readonly enableDisableButton = this.inputExample.getByRole('button');
  readonly message = this.page.locator('#message');

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/dynamic_controls');
  }

  // removeCheckbox/addCheckbox (and enableInput/disableInput below) are intentional aliases of the
  // same toggle button, named per call site so specs read as the action being asserted, not a click.
  async removeCheckbox() {
    await this.removeAddButton.click();
  }

  async addCheckbox() {
    await this.removeAddButton.click();
  }

  async enableInput() {
    await this.enableDisableButton.click();
  }

  async disableInput() {
    await this.enableDisableButton.click();
  }
}
