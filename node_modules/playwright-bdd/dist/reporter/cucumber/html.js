"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Cucumber html reporter.
 * Based on: https://github.com/cucumber/cucumber-js/blob/main/src/formatter/html_formatter.ts
 * See: https://github.com/cucumber/html-formatter
 * See: https://github.com/cucumber/react-components
 */
const promises_1 = require("node:stream/promises");
const html_formatter_1 = __importDefault(require("@cucumber/html-formatter"));
const utils_1 = require("../../utils");
const node_path_1 = __importDefault(require("node:path"));
const base_1 = __importDefault(require("./base"));
class HtmlReporter extends base_1.default {
    constructor(internalOptions, userOptions = {}) {
        super(internalOptions);
        this.userOptions = userOptions;
        this.setOutputStream(this.userOptions.outputFile);
        const packageRoot = (0, utils_1.resolvePackageRoot)('@cucumber/html-formatter');
        this.htmlStream = new html_formatter_1.default(node_path_1.default.join(packageRoot, 'dist/main.css'), node_path_1.default.join(packageRoot, 'dist/main.js'));
        this.eventBroadcaster.on('envelope', (envelope) => {
            this.htmlStream.write(envelope);
        });
        this.htmlStream.pipe(this.outputStream);
    }
    async finished() {
        this.htmlStream.end();
        await (0, promises_1.finished)(this.htmlStream);
        await super.finished();
    }
}
exports.default = HtmlReporter;
//# sourceMappingURL=html.js.map