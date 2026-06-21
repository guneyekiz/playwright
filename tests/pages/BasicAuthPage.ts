import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class BasicAuthPage extends BasePage {
  // Note: Chromium rejects credentials embedded in the URL
  // (`https://user:pass@host/path`) with net::ERR_INVALID_AUTH_CREDENTIALS.
  // Auth must be supplied via the browser context's `httpCredentials` option
  // instead (see docs/app-exploration.md, Finding 5).
  readonly congratsMessage = this.page.locator('.example p');

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/basic_auth');
  }
}
