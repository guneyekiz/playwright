/**
 * Executed hooks of test run.
 */
import * as pw from '@playwright/test/reporter';
import { Hook, HookType } from './Hook';
import { ExecutedStepInfo, TestCaseRun } from './TestCaseRun';
import { TestStepRunEnvelope } from './TestStepRun';
type ExecutedHookInfo = {
    hook: Hook;
    pwStep: pw.TestStep;
};
export declare class TestCaseRunHooks {
    private testCaseRun;
    private hookType;
    private rootPwStep?;
    private candidateSteps;
    private hookSteps;
    executedHooks: Map<string, ExecutedHookInfo>;
    constructor(testCaseRun: TestCaseRun, hookType: HookType);
    fill(mainSteps: ExecutedStepInfo[]): this;
    buildMessages(): TestStepRunEnvelope[];
    private setRootStep;
    private setCandidateSteps;
    private addStepsWithName;
    private addStepsWithAttachment;
    private addStepWithError;
    private addStepWithTimeout;
    private excludeMainSteps;
    private setExecutedHooks;
}
export {};
//# sourceMappingURL=TestCaseRunHooks.d.ts.map