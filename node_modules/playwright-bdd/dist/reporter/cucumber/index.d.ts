import { FullResult, Reporter as PlaywrightReporter, TestCase, TestResult } from '@playwright/test/reporter';
import MessageReporter from './message';
import HtmlReporter from './html';
import JunitReporter from './junit';
import JsonReporter from './json';
import { CustomReporterOptions } from './custom';
declare const builtinReporters: {
    readonly html: typeof HtmlReporter;
    readonly message: typeof MessageReporter;
    readonly junit: typeof JunitReporter;
    readonly json: typeof JsonReporter;
};
export type BuiltinReporters = typeof builtinReporters;
export type CucumberReporterOptions<T> = T extends keyof BuiltinReporters ? ConstructorParameters<BuiltinReporters[T]>[1] : CustomReporterOptions;
export default class CucumberReporterAdapter<T extends keyof BuiltinReporters | string> implements PlaywrightReporter {
    private messagesBuilderRef;
    private type;
    private userOptions;
    private reporter;
    constructor(fullOptions: {
        $type: T;
    } & CucumberReporterOptions<T>);
    printsToStdio(): boolean;
    onTestEnd(test: TestCase, result: TestResult): void;
    onEnd(result: FullResult): Promise<void>;
    private createCucumberReporter;
}
export {};
//# sourceMappingURL=index.d.ts.map