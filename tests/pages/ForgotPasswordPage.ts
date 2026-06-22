import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ForgotPasswordPage extends BasePage {
  readonly emailInput = this.page.getByLabel('E-mail');
  readonly submitButton = this.page.getByRole('button', { name: 'Retrieve password' });

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/forgot_password');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }
}
