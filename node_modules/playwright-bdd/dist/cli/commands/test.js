"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertConfigsCount = exports.testCommand = void 0;
const node_worker_threads_1 = require("node:worker_threads");
const node_events_1 = require("node:events");
const node_path_1 = __importDefault(require("node:path"));
const commander_1 = require("commander");
const gen_1 = require("../../gen");
const loadConfig_1 = require("../../playwright/loadConfig");
const env_1 = require("../../config/env");
const config_1 = require("../../config");
const options_1 = require("../options");
const exit_1 = require("../../utils/exit");
const GEN_WORKER_PATH = node_path_1.default.resolve(__dirname, '..', 'worker.js');
exports.testCommand = new commander_1.Command('test')
    .description('Generate Playwright test files from Gherkin documents')
    .addOption(options_1.configOption)
    .option('--tags <expression>', `Tags expression to filter scenarios for generation`)
    .option('--verbose', `Verbose mode (default: ${Boolean(config_1.defaults.verbose)})`)
    .action(async (opts) => {
    await (0, loadConfig_1.loadConfig)(opts.config);
    const configs = readConfigsFromEnv();
    mergeCliOptions(configs, opts);
    await generateFilesForConfigs(configs);
});
function readConfigsFromEnv() {
    const configs = Object.values((0, env_1.getEnvConfigs)());
    assertConfigsCount(configs);
    return configs;
}
function mergeCliOptions(configs, opts) {
    configs.forEach((config) => {
        if ('tags' in opts)
            config.tags = opts.tags;
        if ('verbose' in opts)
            config.verbose = Boolean(opts.verbose);
    });
}
function assertConfigsCount(configs) {
    if (configs.length === 0) {
        (0, exit_1.exit)(`No BDD configs found. Did you use defineBddConfig() in playwright.config.ts?`);
    }
}
exports.assertConfigsCount = assertConfigsCount;
async function generateFilesForConfigs(configs) {
    // run first config in main thread and other in workers (to have fresh require cache)
    // See: https://github.com/vitalets/playwright-bdd/issues/32
    const tasks = configs.map((config, index) => {
        return index === 0 ? new gen_1.TestFilesGenerator(config).generate() : runInWorker(config);
    });
    return Promise.all(tasks);
}
async function runInWorker(config) {
    const worker = new node_worker_threads_1.Worker(GEN_WORKER_PATH, {
        workerData: { config },
    });
    const [exitCode] = await (0, node_events_1.once)(worker, 'exit');
    if (exitCode)
        (0, exit_1.exit)();
}
//# sourceMappingURL=test.js.map