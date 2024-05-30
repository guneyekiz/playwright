"use strict";
/**
 * Loads snippet builder
 * See: https://github.com/cucumber/cucumber-js/blob/main/src/formatter/builder.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSnippetBuilder = void 0;
const cucumber_1 = require("@cucumber/cucumber");
async function loadSnippetBuilder(supportCodeLibrary, snippetInterface, snippetSyntax) {
    return cucumber_1.FormatterBuilder.getStepDefinitionSnippetBuilder({
        cwd: process.cwd(),
        snippetInterface,
        snippetSyntax,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore it's safe to use our ISupportCodeLibrary because only .parameterTypeRegistry is used
        supportCodeLibrary,
    });
}
exports.loadSnippetBuilder = loadSnippetBuilder;
//# sourceMappingURL=loadSnippetBuilder.js.map