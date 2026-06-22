import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

// /dynamic_loading is a landing page linking to two sub-examples, not the widget itself
// (see Finding 7 in docs/app-exploration.md). Both sub-examples share the same Start
// button / Hello World heading structure, so one page object covers both.
export class DynamicLoadingPage extends BasePage {
  readonly startButton = this.page.getByRole('button', { name: 'Start' });
  readonly finishText = this.page.locator('#finish');

  constructor(page: Page) {
    super(page);
  }

  async gotoExample1() {
    await super.goto('/dynamic_loading/1');
  }

  async gotoExample2() {
    await super.goto('/dynamic_loading/2');
  }

  async start() {
    await this.startButton.click();
  }
}
