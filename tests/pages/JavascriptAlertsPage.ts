import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class JavascriptAlertsPage extends BasePage {
  readonly alertButton = this.page.getByRole('button', { name: 'Click for JS Alert' });
  readonly confirmButton = this.page.getByRole('button', { name: 'Click for JS Confirm' });
  readonly promptButton = this.page.getByRole('button', { name: 'Click for JS Prompt' });
  readonly resultText = this.page.locator('#result');

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/javascript_alerts');
  }

  // Each trigger registers a one-time page.on('dialog', ...) handler before clicking,
  // since the click itself is what synchronously opens the native dialog.
  async triggerAlertAndAccept() {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.alertButton.click();
  }

  async triggerConfirmAndAccept() {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.confirmButton.click();
  }

  async triggerConfirmAndDismiss() {
    this.page.once('dialog', (dialog) => dialog.dismiss());
    await this.confirmButton.click();
  }

  async triggerPromptAndAcceptWithText(text: string) {
    this.page.once('dialog', (dialog) => dialog.accept(text));
    await this.promptButton.click();
  }

  async triggerPromptAndDismiss() {
    this.page.once('dialog', (dialog) => dialog.dismiss());
    await this.promptButton.click();
  }
}
