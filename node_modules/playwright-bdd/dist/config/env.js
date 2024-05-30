"use strict";
/**
 * Storing configs in env var PLAYWRIGHT_BDD_CONFIGS as JSON-stringified values.
 * For passing configs to playwright workers and bddgen.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvConfigs = exports.getConfigFromEnv = exports.saveConfigToEnv = void 0;
const node_path_1 = __importDefault(require("node:path"));
const exit_1 = require("../utils/exit");
function saveConfigToEnv(config) {
    const envConfigs = getEnvConfigs();
    const existingConfig = envConfigs[config.outputDir];
    if (existingConfig) {
        // Playwright config can be evaluated several times.
        // Throw error only if different calls of defineBddConfig() use the same outputDir.
        // See: https://github.com/vitalets/playwright-bdd/issues/39#issuecomment-1653805368
        if (!isSameConfigs(config, existingConfig)) {
            (0, exit_1.exit)(`When using several calls of defineBddConfig()`, `please manually provide different "outputDir" option.`);
        }
        return;
    }
    envConfigs[config.outputDir] = config;
    saveEnvConfigs(envConfigs);
}
exports.saveConfigToEnv = saveConfigToEnv;
function getConfigFromEnv(outputDir) {
    const envConfigs = getEnvConfigs();
    outputDir = node_path_1.default.resolve(outputDir);
    const config = envConfigs[outputDir];
    if (!config) {
        (0, exit_1.exit)(`Config not found for outputDir: "${outputDir}".`, `Available dirs: ${Object.keys(envConfigs).join('\n')}`);
    }
    return config;
}
exports.getConfigFromEnv = getConfigFromEnv;
function getEnvConfigs() {
    return JSON.parse(process.env.PLAYWRIGHT_BDD_CONFIGS || '{}');
}
exports.getEnvConfigs = getEnvConfigs;
function saveEnvConfigs(envConfigs) {
    process.env.PLAYWRIGHT_BDD_CONFIGS = JSON.stringify(envConfigs);
}
function isSameConfigs(config1, config2) {
    return JSON.stringify(config1) === JSON.stringify(config2);
}
//# sourceMappingURL=env.js.map