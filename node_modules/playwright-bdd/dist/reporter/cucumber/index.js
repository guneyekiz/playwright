"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Playwright reporter that generates different Cucumber reports.
 */
const node_events_1 = __importDefault(require("node:events"));
const messagesBuilder_1 = require("./messagesBuilder");
const configDir_1 = require("../../config/configDir");
const enrichReporterData_1 = require("../../config/enrichReporterData");
const message_1 = __importDefault(require("./message"));
const html_1 = __importDefault(require("./html"));
const junit_1 = __importDefault(require("./junit"));
const json_1 = __importDefault(require("./json"));
const custom_1 = __importDefault(require("./custom"));
const builtinReporters = {
    html: html_1.default,
    message: message_1.default,
    junit: junit_1.default,
    json: json_1.default,
};
class CucumberReporterAdapter {
    constructor(fullOptions) {
        const { $type, ...userOptions } = fullOptions;
        this.type = $type;
        this.userOptions = userOptions;
        (0, enrichReporterData_1.enableEnrichReporterData)();
        this.messagesBuilderRef = (0, messagesBuilder_1.getMessagesBuilderRef)();
        this.reporter = this.createCucumberReporter();
    }
    printsToStdio() {
        return this.reporter.printsToStdio();
    }
    onTestEnd(test, result) {
        this.messagesBuilderRef.onTestEnd(test, result);
    }
    async onEnd(result) {
        this.messagesBuilderRef.onEnd(result);
        await this.reporter.init();
        await this.messagesBuilderRef.builder.buildMessages();
        this.messagesBuilderRef.builder.emitMessages(this.reporter.eventBroadcaster);
        await this.reporter.finished();
    }
    createCucumberReporter() {
        const internalOptions = {
            cwd: (0, configDir_1.getPlaywrightConfigDir)(),
            eventBroadcaster: new node_events_1.default(),
            eventDataCollector: this.messagesBuilderRef.builder.eventDataCollector,
        };
        if (isBuiltInReporter(this.type)) {
            const BuiltInReporter = builtinReporters[this.type];
            return new BuiltInReporter(internalOptions, this.userOptions);
        }
        else {
            const reporterPath = this.type;
            return new custom_1.default(internalOptions, reporterPath, this.userOptions);
        }
    }
}
exports.default = CucumberReporterAdapter;
function isBuiltInReporter(type) {
    return type in builtinReporters;
}
//# sourceMappingURL=index.js.map