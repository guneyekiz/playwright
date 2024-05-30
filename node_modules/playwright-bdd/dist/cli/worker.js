"use strict";
/**
 * Worker to generate test files with fresh require/import cache
 * See: https://github.com/nodejs/modules/issues/307#issuecomment-858729422
 */
Object.defineProperty(exports, "__esModule", { value: true });
const node_worker_threads_1 = require("node:worker_threads");
const gen_1 = require("../gen");
main();
async function main() {
    await new gen_1.TestFilesGenerator(node_worker_threads_1.workerData.config).generate();
}
//# sourceMappingURL=worker.js.map