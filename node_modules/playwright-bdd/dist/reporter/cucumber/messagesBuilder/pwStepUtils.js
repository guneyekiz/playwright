"use strict";
/**
 * Utility functions for filtering Playwright steps.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUnknownDuration = exports.collectStepsDfs = exports.findDeepestStepWithUnknownDuration = exports.findDeepestStepWithError = exports.getHooksRootPwStep = exports.collectStepsWithCategory = void 0;
// Playwright step categoires, that can be mapped to testStep / hook in Cucumber messages
const MEANINGFUL_STEP_CATEGORIES = ['hook', 'fixture', 'test.step'];
function collectStepsWithCategory(parent, category) {
    const categories = Array.isArray(category) ? category : [category];
    const steps = collectStepsDfs(parent);
    return steps.filter((step) => categories.includes(step.category));
}
exports.collectStepsWithCategory = collectStepsWithCategory;
function getHooksRootPwStep(result, type) {
    const rootStepTitle = type === 'before' ? 'Before Hooks' : 'After Hooks';
    return result.steps.find((step) => step.category === 'hook' && step.title === rootStepTitle);
}
exports.getHooksRootPwStep = getHooksRootPwStep;
function findDeepestStepWithError(root) {
    if (!root)
        return;
    return findDeepestStepWith(root, (pwStep) => {
        return Boolean(pwStep.error) && MEANINGFUL_STEP_CATEGORIES.includes(pwStep.category);
    });
}
exports.findDeepestStepWithError = findDeepestStepWithError;
function findDeepestStepWithUnknownDuration(root) {
    if (!root)
        return;
    return findDeepestStepWith(root, (pwStep) => {
        return isUnknownDuration(pwStep) && MEANINGFUL_STEP_CATEGORIES.includes(pwStep.category);
    });
}
exports.findDeepestStepWithUnknownDuration = findDeepestStepWithUnknownDuration;
/**
 * Finds the deepest step that satisfies predicate function.
 */
function findDeepestStepWith(root, predicate) {
    let currentStep = predicate(root) ? root : undefined;
    while (currentStep) {
        const nextStep = currentStep.steps.find((pwStep) => predicate(pwStep));
        if (!nextStep)
            break;
        currentStep = nextStep;
    }
    return currentStep;
}
/**
 * Returns all steps in DFS order.
 * See: https://en.wikipedia.org/wiki/Depth-first_search
 */
function collectStepsDfs(parent) {
    return (parent?.steps?.reduce((res, step) => {
        res.push(step);
        res.push(...collectStepsDfs(step));
        return res;
    }, []) || []);
}
exports.collectStepsDfs = collectStepsDfs;
function isUnknownDuration(pwStep) {
    return pwStep.duration === -1;
}
exports.isUnknownDuration = isUnknownDuration;
//# sourceMappingURL=pwStepUtils.js.map