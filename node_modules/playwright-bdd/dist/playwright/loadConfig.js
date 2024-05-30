"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveConfigFile = exports.loadConfig = void 0;
/**
 * Loading Playwright config.
 * See: https://github.com/microsoft/playwright/blob/main/packages/playwright-test/src/common/configLoader.ts
 */
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const utils_1 = require("./utils");
const transform_1 = require("./transform");
const exit_1 = require("../utils/exit");
async function loadConfig(cliConfigPath) {
    const resolvedConfigFile = resolveConfigFile(cliConfigPath);
    assertConfigFileExists(resolvedConfigFile, cliConfigPath);
    await (0, transform_1.requireTransform)().requireOrImport(resolvedConfigFile);
    return { resolvedConfigFile };
}
exports.loadConfig = loadConfig;
function resolveConfigFile(cliConfigPath) {
    const { resolveConfigFile } = (0, utils_1.requirePlaywrightModule)('lib/common/configLoader.js');
    const configFileOrDirectory = getConfigFilePath(cliConfigPath);
    return resolveConfigFile(configFileOrDirectory) || '';
}
exports.resolveConfigFile = resolveConfigFile;
function getConfigFilePath(cliConfigPath) {
    return cliConfigPath ? node_path_1.default.resolve(process.cwd(), cliConfigPath) : process.cwd();
}
function assertConfigFileExists(resolvedConfigFile, cliConfigPath) {
    if (!resolvedConfigFile || !node_fs_1.default.existsSync(resolvedConfigFile)) {
        const configFilePath = getConfigFilePath(cliConfigPath);
        (0, exit_1.exit)(`Can't find Playwright config file in: ${configFilePath}`);
    }
}
//# sourceMappingURL=loadConfig.js.map