"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTestContainsSubtest = exports.runStepWithCustomLocation = void 0;
/**
 * Helpers to deal with Playwright test internal stuff.
 * See: https://github.com/microsoft/playwright/blob/main/packages/playwright-test/src/common/testType.ts
 */
const test_1 = require("@playwright/test");
const utils_1 = require("../utils");
const utils_2 = require("./utils");
const testTypeSymbol = (0, utils_1.getSymbolByName)(test_1.test, 'testType');
/**
 * Returns test fixtures using Symbol.
 */
function getTestFixtures(test) {
    return getTestImpl(test).fixtures;
}
function getTestImpl(test) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return test[testTypeSymbol];
}
/**
 * Run step with location pointing to Given, When, Then call.
 */
// eslint-disable-next-line max-params
async function runStepWithCustomLocation(test, stepText, location, body) {
    // Since PW 1.43 testInfo._runAsStep was replaced with a more complex logic.
    // To run step with a custom location, we hijack testInfo._addStep()
    // so that it appends location for the bdd step calls.
    // Finally we call test.step(), that internally invokes testInfo._addStep().
    // See: https://github.com/microsoft/playwright/issues/30160
    // See: https://github.com/microsoft/playwright/blob/release-1.43/packages/playwright/src/common/testType.ts#L262
    // See: https://github.com/microsoft/playwright/blob/release-1.43/packages/playwright/src/worker/testInfo.ts#L247
    if (utils_2.playwrightVersion >= '1.39.0') {
        const testInfo = test.info();
        // here we rely on that testInfo._addStep is called synchronously in test.step()
        const origAddStep = testInfo._addStep;
        testInfo._addStep = function (data) {
            data.location = location;
            testInfo._addStep = origAddStep;
            return origAddStep.call(this, data);
        };
        return test.step(stepText, body);
    }
    else {
        const testInfo = test.info();
        return testInfo._runAsStep({ category: 'test.step', title: stepText, location }, async () => {
            return await body();
        });
    }
}
exports.runStepWithCustomLocation = runStepWithCustomLocation;
/**
 * Returns true if test contains all fixtures of subtest.
 * - test was extended from subtest
 * - test is a result of mergeTests(subtest, ...)
 */
function isTestContainsSubtest(test, subtest) {
    if (test === subtest)
        return true;
    const testFixtures = new Set(getTestFixtures(test).map((f) => locationToString(f.location)));
    return getTestFixtures(subtest).every((f) => {
        return testFixtures.has(locationToString(f.location));
    });
}
exports.isTestContainsSubtest = isTestContainsSubtest;
function locationToString({ file, line, column }) {
    return `${file}:${line}:${column}`;
}
//# sourceMappingURL=testTypeImpl.js.map