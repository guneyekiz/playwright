"use strict";
/**
 * Representation of https://github.com/cucumber/cucumber-js/blob/main/src/paths/paths.ts
 * Since Cucumber 10.1 resolvePaths was moved from lib/api/paths to lib/paths/paths.
 * This module makes resolvePaths working with any version of Cucumber.
 * See: https://github.com/cucumber/cucumber-js/pull/2361/files
 *
 * todo: replace with own paths resolution.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resovleFeaturePaths = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const environment_1 = require("@cucumber/cucumber/lib/api/environment");
const console_logger_1 = require("@cucumber/cucumber/lib/api/console_logger");
const utils_1 = require("../utils");
/**
 * Returns list of absolute feature paths.
 */
// eslint-disable-next-line max-statements
async function resovleFeaturePaths(runConfiguration, environment = {}) {
    const { cwd, stderr, debug } = (0, environment_1.mergeEnvironment)(environment);
    const logger = new console_logger_1.ConsoleLogger(stderr, debug);
    const cucumberRoot = (0, utils_1.resolvePackageRoot)('@cucumber/cucumber');
    const pathsModuleBefore10_1 = node_path_1.default.join(cucumberRoot, 'lib/api/paths.js');
    const pathsModuleAfter10_1 = node_path_1.default.join(cucumberRoot, 'lib/paths/paths.js');
    const isNewResolvePaths = node_fs_1.default.existsSync(pathsModuleAfter10_1);
    if (isNewResolvePaths) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { resolvePaths } = require(pathsModuleAfter10_1);
        const { sourcePaths, unexpandedSourcePaths } = await resolvePaths(logger, cwd, runConfiguration.sources);
        return {
            featurePaths: sourcePaths,
            unexpandedFeaturePaths: unexpandedSourcePaths,
        };
    }
    else {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { resolvePaths } = require(pathsModuleBefore10_1);
        const { featurePaths, unexpandedFeaturePaths } = await resolvePaths(logger, cwd, runConfiguration.sources);
        return {
            featurePaths,
            unexpandedFeaturePaths,
        };
    }
}
exports.resovleFeaturePaths = resovleFeaturePaths;
//# sourceMappingURL=resolveFeaturePaths.js.map