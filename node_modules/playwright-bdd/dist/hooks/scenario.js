"use strict";
/**
 * Scenario level hooks: Before / After.
 *
 * before(async ({ page }) => {})
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScenarioHooksFixtures = exports.runScenarioHooks = exports.hasScenarioHooks = exports.scenarioHookFactory = void 0;
const tag_expressions_1 = __importDefault(require("@cucumber/tag-expressions"));
const fixtureParameterNames_1 = require("../playwright/fixtureParameterNames");
const utils_1 = require("../utils");
const getLocationInFile_1 = require("../playwright/getLocationInFile");
const testTypeImpl_1 = require("../playwright/testTypeImpl");
const scenarioHooks = [];
let scenarioHooksFixtures;
/**
 * Returns Before() / After() functions.
 */
function scenarioHookFactory(type) {
    return (...args) => {
        addHook({
            type,
            options: getOptionsFromArgs(args),
            fn: getFnFromArgs(args),
            // offset = 3 b/c this call is 3 steps below the user's code
            location: (0, getLocationInFile_1.getLocationByOffset)(3),
        });
    };
}
exports.scenarioHookFactory = scenarioHookFactory;
function hasScenarioHooks() {
    return scenarioHooks.length > 0;
}
exports.hasScenarioHooks = hasScenarioHooks;
// eslint-disable-next-line complexity, max-statements
async function runScenarioHooks(type, fixtures) {
    let error;
    for (const hook of scenarioHooks) {
        if (hook.type !== type)
            continue;
        if (hook.tagsExpression && !hook.tagsExpression.evaluate(fixtures.$tags))
            continue;
        try {
            const hookFn = wrapHookFn(hook, fixtures);
            await (0, testTypeImpl_1.runStepWithCustomLocation)(fixtures.$bddWorld.test, hook.options.name || '', hook.location, hookFn);
        }
        catch (e) {
            if (type === 'before')
                throw e;
            if (!error)
                error = e;
        }
    }
    if (error)
        throw error;
}
exports.runScenarioHooks = runScenarioHooks;
function getScenarioHooksFixtures() {
    if (!scenarioHooksFixtures) {
        const fixturesFakeObj = {
            $bddWorld: null,
            $tags: null,
            $testInfo: null,
        };
        const set = new Set();
        scenarioHooks.forEach((hook) => {
            (0, fixtureParameterNames_1.fixtureParameterNames)(hook.fn)
                .filter((fixtureName) => !Object.prototype.hasOwnProperty.call(fixturesFakeObj, fixtureName))
                .forEach((fixtureName) => set.add(fixtureName));
        });
        scenarioHooksFixtures = [...set];
    }
    return scenarioHooksFixtures;
}
exports.getScenarioHooksFixtures = getScenarioHooksFixtures;
/**
 * Wraps hook fn with timeout and waiting Cucumber attachments to fulfill.
 */
function wrapHookFn(hook, fixtures) {
    const { timeout } = hook.options;
    const { $bddWorld } = fixtures;
    return async () => {
        await (0, utils_1.callWithTimeout)(() => hook.fn.call($bddWorld, fixtures), timeout, getTimeoutMessage(hook));
    };
}
function getOptionsFromArgs(args) {
    if (typeof args[0] === 'string')
        return { tags: args[0] };
    if (typeof args[0] === 'object')
        return args[0];
    return {};
}
function getFnFromArgs(args) {
    return args.length === 1 ? args[0] : args[1];
}
function setTagsExpression(hook) {
    if (hook.options.tags) {
        hook.tagsExpression = (0, tag_expressions_1.default)(hook.options.tags);
    }
}
function addHook(hook) {
    setTagsExpression(hook);
    if (hook.type === 'before') {
        scenarioHooks.push(hook);
    }
    else {
        // 'after' hooks run in reverse order
        scenarioHooks.unshift(hook);
    }
}
function getTimeoutMessage(hook) {
    const { timeout, name: hookName } = hook.options;
    return `${hook.type} hook ${hookName ? `"${hookName}" ` : ''}timeout (${timeout} ms)`;
}
//# sourceMappingURL=scenario.js.map