"use strict";
/**
 * Returns reference to a messagesBuilder singleton.
 * We pass onTestEnd and onEnd calls only for the first reference (reporter),
 * otherwise all events will be duplicated.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessagesBuilderRef = void 0;
const Builder_1 = require("./Builder");
let instance;
let referenceCount = 0;
function getMessagesBuilderRef() {
    if (!instance)
        instance = new Builder_1.MessagesBuilder();
    const isFirstRef = ++referenceCount === 1;
    return {
        builder: instance,
        onTestEnd(test, result) {
            isFirstRef && this.builder.onTestEnd(test, result);
        },
        onEnd(fullResult) {
            isFirstRef && this.builder.onEnd(fullResult);
        },
    };
}
exports.getMessagesBuilderRef = getMessagesBuilderRef;
//# sourceMappingURL=index.js.map