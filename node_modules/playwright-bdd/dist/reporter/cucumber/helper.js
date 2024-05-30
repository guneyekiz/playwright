"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cucumberReporter = void 0;
function cucumberReporter(type, userOptions) {
    return ['playwright-bdd/reporter/cucumber', { $type: type, ...(userOptions || {}) }];
}
exports.cucumberReporter = cucumberReporter;
//# sourceMappingURL=helper.js.map