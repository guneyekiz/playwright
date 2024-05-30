/**
 * Builds particular cucumber testCase.
 *
 * About hooks:
 * There are many fixtures that wrap each test, they are actually hooks.
 * How to decide which should be added to the Cucumber report as hooks?
 * There are 3 rules of adding:
 * 1. if hook has a name
 * 2. if hook has attachments
 * 3. if hook has an error
 */
import * as messages from '@cucumber/messages';
import { TestCaseRun } from './TestCaseRun';
import { Hook, HookType } from './Hook';
import { GherkinDocumentWithPickles, PickleWithLocation } from '../../../cucumber/loadFeatures';
import { ProjectInfo } from './Projects';
type HookWithStep = {
    hook: Hook;
    testStep: messages.TestStep;
};
export declare class TestCase {
    #private;
    id: string;
    private gherkinDocuments;
    private beforeHooks;
    private afterHooks;
    private mainSteps;
    constructor(id: string, gherkinDocuments: GherkinDocumentWithPickles[]);
    get projectInfo(): ProjectInfo;
    get pickle(): PickleWithLocation;
    addRun(testCaseRun: TestCaseRun): void;
    getHooks(hookType: HookType): Map<string, HookWithStep>;
    getMainSteps(): messages.TestStep[];
    buildMessage(): {
        testCase: messages.TestCase;
    };
    /**
     * We collect hooks from all runs of this test case, avoiding duplicates.
     */
    private addHooks;
    /**
     * Initially create steps from pickle steps, with empty stepMatchArgumentsLists.
     */
    private addStepsFromPickle;
    /**
     * Fill stepMatchArgumentsLists from all test runs.
     * It allows to fill as many steps as possible.
     * Possibly, we write the same stepMatchArgumentsLists several times,
     * looks like it's not a problem as they should be equal for all runs.
     */
    private addStepsArgumentsLists;
    private findPickle;
}
export {};
//# sourceMappingURL=TestCase.d.ts.map