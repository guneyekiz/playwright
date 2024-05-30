"use strict";
/**
 * Playwright-bdd's step config.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlaywrightStyle = exports.isDecorator = exports.getStepConfig = void 0;
function getStepConfig(step) {
    return step.code.stepConfig;
}
exports.getStepConfig = getStepConfig;
function isDecorator(stepConfig) {
    return Boolean(stepConfig?.pomNode);
}
exports.isDecorator = isDecorator;
/**
 * Cucumber-style steps don't have stepConfig
 * b/c they created directly via cucumber's Given, When, Then.
 */
function isPlaywrightStyle(stepConfig) {
    return Boolean(stepConfig);
}
exports.isPlaywrightStyle = isPlaywrightStyle;
//# sourceMappingURL=stepConfig.js.map