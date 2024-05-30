/// <reference types="node" />
/**
 * Maps attachments to test steps.
 *
 * As there is no built-in method to map attachments with steps,
 * I've considered several approches:
 *
 * 1. Track attachments count in onStepBegin/onStepEnd.
 * + intuitive and simple
 * - does not work in merge-reports, there attachments are populated only in onTestEnd.
 * See: https://github.com/microsoft/playwright/issues/29323
 *
 * 2. Track attachments manually in own code and store attachment indexes
 * for each step in __bddData system attachment.
 * + works in merge-reports
 * - impossible to map attachments in user's custom fixtures, as we don't wrap this code
 *
 * 3. Check Playwright steps with category: 'attach', extract attachment names and
 * map to attachments using names and order.
 * + works in merge-reports
 * + allows to map attachments in custom fixtures
 * - needs Playwright >= 1.34
 *
 * This class implements approach 3.
 *
 * Example:
 *
 * Code:
 * // fixture that creates 3 attachments
 * myFixture: ({}, use, testInfo) => {
 *   await testInfo.attach('my attachment', { body: 'foo' });
 *   await test.step('my step', async () => {
 *     await testInfo.attach('my attachment', { body: 'bar' })
 *   });
 *   await testInfo.attach('my attachment', { body: 'baz' });
 * }
 *
 * Attachments:
 *  my attachment, body = foo
 *  my attachment, body = bar
 *  my attachment, body = baz
 *
 * Steps tree:
 * - fixture: myFixture
 *   - attach "my attachment"
 *   - my step
 *     - attach "my attachment"
 *   - attach "my attachment"
 *
 * Algorithm:
 * 1. find all steps with category: 'attach' using deep-first search traversal
 * 2. iterate these steps in the following manner:
 *   2.1 take step and extract attachment name from step title
 *   2.2 find attachment with the same name, searching from the beginning of array
 *   2.3 map found attachment with step.parent
 *   2.4 remove found attachment from attachments array
 */
import * as pw from '@playwright/test/reporter';
export declare class AttachmentMapper {
    private result;
    private stepAttachments;
    private unusedAttachments;
    constructor(result: pw.TestResult);
    getStepAttachments(pwStep: pw.TestStep): {
        name: string;
        contentType: string;
        path?: string | undefined;
        body?: Buffer | undefined;
    }[];
    private mapAttachments;
    private mapAttachment;
    private mapUnusedAttachments;
    private mapStdoutAttachments;
    private getAfterHooksRoot;
}
//# sourceMappingURL=AttachmentMapper.d.ts.map