"use strict";
/**
 * Base reporter for Cucumber reporters.
 * Reference: https://github.com/cucumber/cucumber-js/blob/main/src/formatter/index.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const promises_1 = require("node:stream/promises");
class BaseReporter {
    constructor(internalOptions) {
        this.internalOptions = internalOptions;
        this.outputStream = process.stdout;
    }
    get eventBroadcaster() {
        return this.internalOptions.eventBroadcaster;
    }
    get eventDataCollector() {
        return this.internalOptions.eventDataCollector;
    }
    printsToStdio() {
        return isStdout(this.outputStream);
    }
    async init() { }
    async finished() {
        if (!isStdout(this.outputStream)) {
            this.outputStream.end();
            await (0, promises_1.finished)(this.outputStream);
        }
    }
    setOutputStream(outputFile) {
        if (!outputFile)
            return;
        const absolutePath = node_path_1.default.resolve(this.internalOptions.cwd, outputFile);
        node_fs_1.default.mkdirSync(node_path_1.default.dirname(absolutePath), { recursive: true });
        this.outputStream = node_fs_1.default.createWriteStream(absolutePath);
    }
}
exports.default = BaseReporter;
function isStdout(stream) {
    return stream === process.stdout;
}
//# sourceMappingURL=base.js.map