"use strict";
/**
 * Store playwright config dir in env to provide access to it in workers.
 * Important that in workers there is different process.argv, that's why we save it to env.
 * Config dir is needed to resolve all paths (features, step definitions).
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaywrightConfigDir = void 0;
const node_path_1 = __importDefault(require("node:path"));
const loadConfig_1 = require("../playwright/loadConfig");
const options_1 = require("../cli/options");
/**
 * Returns Playwright config dir considering cli --config option.
 */
function getPlaywrightConfigDir({ resolveAndSave = false } = {}) {
    let configDir = process.env.PLAYWRIGHT_BDD_CONFIG_DIR;
    if (!configDir) {
        if (resolveAndSave) {
            const cliConfigPath = (0, options_1.getCliConfigPath)();
            const playwrightConfigFile = (0, loadConfig_1.resolveConfigFile)(cliConfigPath);
            configDir = playwrightConfigFile ? node_path_1.default.dirname(playwrightConfigFile) : process.cwd();
            process.env.PLAYWRIGHT_BDD_CONFIG_DIR = configDir;
        }
        else {
            throw new Error(`Something went wrong: PLAYWRIGHT_BDD_CONFIG_DIR is not set.`);
        }
    }
    return configDir;
}
exports.getPlaywrightConfigDir = getPlaywrightConfigDir;
//# sourceMappingURL=configDir.js.map