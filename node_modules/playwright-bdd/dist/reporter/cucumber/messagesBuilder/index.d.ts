/**
 * Returns reference to a messagesBuilder singleton.
 * We pass onTestEnd and onEnd calls only for the first reference (reporter),
 * otherwise all events will be duplicated.
 */
import * as pw from '@playwright/test/reporter';
import { MessagesBuilder } from './Builder';
export type MessagesBuilderRef = ReturnType<typeof getMessagesBuilderRef>;
export declare function getMessagesBuilderRef(): {
    builder: MessagesBuilder;
    onTestEnd(test: pw.TestCase, result: pw.TestResult): void;
    onEnd(fullResult: pw.FullResult): void;
};
//# sourceMappingURL=index.d.ts.map