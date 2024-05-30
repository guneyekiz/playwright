"use strict";
/**
 * Worker-level hooks: BeforeAll / AfterAll.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkerHooksFixtures = exports.runWorkerHooks = exports.workerHookFactory = void 0;
const fixtureParameterNames_1 = require("../playwright/fixtureParameterNames");
const utils_1 = require("../utils");
const workerHooks = [];
let workerHooksFixtures;
/**
 * Returns BeforeAll() / AfterAll() functions.
 */
function workerHookFactory(type) {
    return (...args) => {
        addHook({
            type,
            options: getOptionsFromArgs(args),
            fn: getFnFromArgs(args),
        });
    };
}
exports.workerHookFactory = workerHookFactory;
// eslint-disable-next-line complexity
async function runWorkerHooks(type, fixtures) {
    let error;
    for (const hook of workerHooks) {
        if (hook.type !== type)
            continue;
        const { timeout } = hook.options;
        try {
            await (0, utils_1.callWithTimeout)(() => hook.fn(fixtures), timeout, getTimeoutMessage(hook));
        }
        catch (e) {
            if (type === 'beforeAll')
                throw e;
            if (!error)
                error = e;
        }
    }
    if (error)
        throw error;
}
exports.runWorkerHooks = runWorkerHooks;
function getWorkerHooksFixtures() {
    if (!workerHooksFixtures) {
        const fixturesFakeObj = {
            $workerInfo: null,
        };
        const set = new Set();
        workerHooks.forEach((hook) => {
            (0, fixtureParameterNames_1.fixtureParameterNames)(hook.fn)
                .filter((fixtureName) => !Object.prototype.hasOwnProperty.call(fixturesFakeObj, fixtureName))
                .forEach((fixtureName) => set.add(fixtureName));
        });
        workerHooksFixtures = [...set];
    }
    return workerHooksFixtures;
}
exports.getWorkerHooksFixtures = getWorkerHooksFixtures;
function getOptionsFromArgs(args) {
    if (typeof args[0] === 'object')
        return args[0];
    return {};
}
function getFnFromArgs(args) {
    return args.length === 1 ? args[0] : args[1];
}
function addHook(hook) {
    if (hook.type === 'beforeAll') {
        workerHooks.push(hook);
    }
    else {
        // 'afterAll' hooks run in reverse order
        workerHooks.unshift(hook);
    }
}
function getTimeoutMessage(hook) {
    const { timeout } = hook.options;
    return `${hook.type} hook timeout (${timeout} ms)`;
}
//# sourceMappingURL=worker.js.map