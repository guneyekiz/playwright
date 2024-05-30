"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStepDefinition = void 0;
/**
 * Extracted from cucumber SupportCodeLibraryBuilder.
 * See: https://github.com/cucumber/cucumber-js/blob/main/src/support_code_library_builder/index.ts
 */
const messages_1 = require("@cucumber/messages");
const cucumber_expressions_1 = require("@cucumber/cucumber-expressions");
const step_definition_1 = __importDefault(require("@cucumber/cucumber/lib/models/step_definition"));
const newId = messages_1.IdGenerator.uuid();
function buildStepDefinition({ keyword, pattern, code, line, options, uri }, supportCodeLibrary) {
    // todo: handle error.undefinedParameterTypeName as it's done in cucumber?
    const expression = typeof pattern === 'string'
        ? new cucumber_expressions_1.CucumberExpression(pattern, supportCodeLibrary.parameterTypeRegistry)
        : new cucumber_expressions_1.RegularExpression(pattern, supportCodeLibrary.parameterTypeRegistry);
    // skip wrapping code as it is not needed for decorator steps
    // const wrappedCode = this.wrapCode({
    //   code,
    //   wrapperOptions: options.wrapperOptions,
    // })
    return new step_definition_1.default({
        code,
        expression,
        id: newId(),
        line,
        options,
        keyword,
        pattern,
        unwrappedCode: code,
        uri,
    });
}
exports.buildStepDefinition = buildStepDefinition;
//# sourceMappingURL=buildStepDefinition.js.map