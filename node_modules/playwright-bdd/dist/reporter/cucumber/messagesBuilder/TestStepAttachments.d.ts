import * as pw from '@playwright/test/reporter';
import * as messages from '@cucumber/messages';
import { TestCaseRun } from './TestCaseRun';
export declare class TestStepAttachments {
    private testCaseRun;
    private testStep;
    private pwStep?;
    constructor(testCaseRun: TestCaseRun, testStep: messages.TestStep, pwStep?: pw.TestStep | undefined);
    buildMessages(): {
        attachment: messages.Attachment;
    }[];
    private buildAttachmentMessage;
    private getAttachmentBodyBase64;
}
//# sourceMappingURL=TestStepAttachments.d.ts.map