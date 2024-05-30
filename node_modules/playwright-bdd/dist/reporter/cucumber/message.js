"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("./base"));
class MessageReporter extends base_1.default {
    constructor(internalOptions, userOptions = {}) {
        super(internalOptions);
        this.userOptions = userOptions;
        this.setOutputStream(this.userOptions.outputFile);
        this.eventBroadcaster.on('envelope', (envelope) => {
            this.outputStream.write(JSON.stringify(envelope) + '\n');
        });
    }
}
exports.default = MessageReporter;
//# sourceMappingURL=message.js.map