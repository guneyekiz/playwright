"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcMinMaxByArray = exports.toCucumberTimestamp = void 0;
/**
 * Timing utils.
 */
const messages_1 = require("@cucumber/messages");
function toCucumberTimestamp(time) {
    return messages_1.TimeConversion.millisecondsSinceEpochToTimestamp(time);
}
exports.toCucumberTimestamp = toCucumberTimestamp;
function calcMinMaxByArray(items) {
    let startTime = items.length > 0 ? items[0].startTime : new Date();
    let endTime = items.length > 0 ? getEndTime(items[0]) : new Date();
    items.forEach((item) => {
        const resultEndTime = getEndTime(item);
        if (item.startTime < startTime)
            startTime = item.startTime;
        if (resultEndTime > endTime)
            endTime = resultEndTime;
    });
    return {
        startTime,
        duration: endTime.getTime() - startTime.getTime(),
    };
}
exports.calcMinMaxByArray = calcMinMaxByArray;
function getEndTime(entity) {
    return new Date(entity.startTime.getTime() + entity.duration);
}
//# sourceMappingURL=timing.js.map