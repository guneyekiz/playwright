"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCaseRunHooks = void 0;
const Hook_1 = require("./Hook");
const pwStepUtils_1 = require("./pwStepUtils");
const TestStepRun_1 = require("./TestStepRun");
class TestCaseRunHooks {
    constructor(testCaseRun, hookType) {
        this.testCaseRun = testCaseRun;
        this.hookType = hookType;
        this.candidateSteps = [];
        this.hookSteps = new Set();
        this.executedHooks = new Map();
    }
    fill(mainSteps) {
        this.setRootStep();
        this.setCandidateSteps();
        this.addStepsWithName();
        this.addStepWithError();
        this.addStepWithTimeout();
        this.addStepsWithAttachment();
        this.excludeMainSteps(mainSteps);
        this.setExecutedHooks();
        return this;
    }
    buildMessages() {
        const messages = [];
        this.testCaseRun
            .getTestCase()
            .getHooks(this.hookType)
            .forEach((hookInfo) => {
            const executedHook = this.executedHooks.get(hookInfo.hook.internalId);
            // todo: if pwStep is not found in this.executedBeforeHooks,
            // it means that this hook comes from another attempt of this test case.
            // We can stil try to find it in test result, as otherwise it will be marked as skipped,
            // but actually it was executed.
            const testStepRun = new TestStepRun_1.TestStepRun(this.testCaseRun, hookInfo.testStep, executedHook?.pwStep);
            messages.push(...testStepRun.buildMessages());
        });
        return messages;
    }
    setRootStep() {
        this.rootPwStep = (0, pwStepUtils_1.getHooksRootPwStep)(this.testCaseRun.result, this.hookType);
    }
    setCandidateSteps() {
        if (this.rootPwStep)
            this.candidateSteps.push(this.rootPwStep);
        this.candidateSteps.push(...(0, pwStepUtils_1.collectStepsDfs)(this.rootPwStep));
    }
    addStepsWithName() {
        this.candidateSteps.forEach((pwStep) => {
            if (pwStep.category === 'test.step' && pwStep.title) {
                this.hookSteps.add(pwStep);
            }
        });
    }
    addStepsWithAttachment() {
        const { attachmentMapper } = this.testCaseRun;
        this.candidateSteps.forEach((pwStep) => {
            if (attachmentMapper.getStepAttachments(pwStep).length > 0) {
                this.hookSteps.add(pwStep);
            }
        });
    }
    addStepWithError() {
        const stepWithError = (0, pwStepUtils_1.findDeepestStepWithError)(this.rootPwStep);
        if (stepWithError) {
            this.hookSteps.add(stepWithError);
            // in Playwright error is inherited by all parent steps,
            // but we want to show it once (in the deepest step)
            this.testCaseRun.registerErrorStep(stepWithError);
            this.testCaseRun.registerTimeoutedStep(stepWithError);
        }
    }
    addStepWithTimeout() {
        if (!this.testCaseRun.isTimeouted())
            return;
        if (this.testCaseRun.timeoutedStep)
            return;
        const timeoutedStep = this.hookType === 'before'
            ? // Timeouted steps have duration = -1 in PW <= 1.39 and no error field.
                // In PW > 1.39 timeouted steps have '.error' populated
                (0, pwStepUtils_1.findDeepestStepWithUnknownDuration)(this.rootPwStep)
            : // Timeouted after hooks don't have duration = -1,
                // so there is no way to find which exactly fixture timed out.
                // We mark root 'After Hooks' step as timeouted.
                this.rootPwStep;
        if (timeoutedStep) {
            this.hookSteps.add(timeoutedStep);
            this.testCaseRun.timeoutedStep = timeoutedStep;
        }
    }
    excludeMainSteps(mainSteps) {
        // - exclude background steps, b/c they are in pickle and should not in hooks.
        // - exclude other test.step items that are bdd steps and should not be in hooks.
        // Important to run this fn after this.fillExecutedSteps()
        // as we assume steps are already populated
        mainSteps.forEach((stepInfo) => {
            if (stepInfo.pwStep) {
                this.hookSteps.delete(stepInfo.pwStep);
            }
        });
    }
    setExecutedHooks() {
        this.hookSteps.forEach((pwStep) => {
            const internalId = Hook_1.Hook.getInternalId(pwStep);
            const hook = this.testCaseRun.hooks.getOrCreate(internalId, () => new Hook_1.Hook(internalId, pwStep));
            this.executedHooks.set(internalId, { hook, pwStep });
        });
    }
}
exports.TestCaseRunHooks = TestCaseRunHooks;
//# sourceMappingURL=TestCaseRunHooks.js.map