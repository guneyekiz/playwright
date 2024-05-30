"use strict";
/**
 * Generate and show snippets for undefined steps
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snippets = void 0;
const node_url_1 = require("node:url");
const loadSnippetBuilder_1 = require("../cucumber/loadSnippetBuilder");
const logger_1 = require("../utils/logger");
const stepConfig_1 = require("../steps/stepConfig");
class Snippets {
    constructor(files, runConfiguration, supportCodeLibrary) {
        this.files = files;
        this.runConfiguration = runConfiguration;
        this.supportCodeLibrary = supportCodeLibrary;
        this.bddBuiltInSyntax = false;
    }
    async print() {
        this.snippetBuilder = await this.createSnippetBuilder();
        const snippets = this.getSnippets();
        this.printHeader();
        this.printSnippets(snippets);
        this.printFooter(snippets);
        // exit();
    }
    async createSnippetBuilder() {
        const snippetInterface = this.runConfiguration.formats.options.snippetInterface;
        const snippetSyntax = this.getSnippetSyntax();
        return (0, loadSnippetBuilder_1.loadSnippetBuilder)(this.supportCodeLibrary, snippetInterface, snippetSyntax);
    }
    getSnippetSyntax() {
        const snippetSyntax = this.runConfiguration.formats.options.snippetSyntax;
        if (!snippetSyntax && this.isPlaywrightStyle()) {
            this.bddBuiltInSyntax = true;
            const filePath = this.isDecorators()
                ? require.resolve('./snippetSyntaxDecorators.js')
                : this.isTypeScript()
                    ? require.resolve('./snippetSyntaxTs.js')
                    : require.resolve('./snippetSyntax.js');
            return (0, node_url_1.pathToFileURL)(filePath).toString();
        }
        else {
            return snippetSyntax;
        }
    }
    getSnippets() {
        const snippetsSet = new Set();
        const snippets = [];
        this.files.forEach((file) => {
            file.undefinedSteps.forEach((undefinedStep) => {
                const { snippet, snippetWithLocation } = this.getSnippet(file, snippets.length + 1, undefinedStep);
                if (!snippetsSet.has(snippet)) {
                    snippetsSet.add(snippet);
                    snippets.push(snippetWithLocation);
                }
            });
        });
        return snippets;
    }
    getSnippet(file, index, undefinedStep) {
        const snippet = this.snippetBuilder.build({
            keywordType: undefinedStep.keywordType,
            pickleStep: undefinedStep.pickleStep,
        });
        const { line, column } = undefinedStep.step.location;
        const snippetWithLocation = [
            `// ${index}. Missing step definition for "${file.featureUri}:${line}:${column}"`,
            snippet,
        ].join('\n');
        return { snippet, snippetWithLocation };
    }
    isTypeScript() {
        const { requirePaths, importPaths } = this.supportCodeLibrary.originalCoordinates;
        return (requirePaths.some((p) => p.endsWith('.ts')) || importPaths.some((p) => p.endsWith('.ts')));
    }
    isPlaywrightStyle() {
        const { stepDefinitions } = this.supportCodeLibrary;
        return stepDefinitions.length > 0
            ? stepDefinitions.some((step) => (0, stepConfig_1.isPlaywrightStyle)((0, stepConfig_1.getStepConfig)(step)))
            : true;
    }
    isDecorators() {
        const { stepDefinitions } = this.supportCodeLibrary;
        const decoratorSteps = stepDefinitions.filter((step) => (0, stepConfig_1.isDecorator)((0, stepConfig_1.getStepConfig)(step)));
        return decoratorSteps.length > stepDefinitions.length / 2;
    }
    printHeader() {
        const lines = [`Missing steps found. Use snippets below:`];
        if (this.bddBuiltInSyntax) {
            if (this.isDecorators()) {
                lines.push(`import { Fixture, Given, When, Then } from 'playwright-bdd/decorators';\n`);
            }
            else {
                lines.push(`import { createBdd } from 'playwright-bdd';`, `const { Given, When, Then } = createBdd();\n`);
            }
        }
        else {
            lines.push(`import { Given, When, Then } from '@cucumber/cucumber';\n`);
        }
        logger_1.logger.error(lines.join('\n\n'));
    }
    printSnippets(snippets) {
        logger_1.logger.error(snippets.concat(['']).join('\n\n'));
    }
    printFooter(snippets) {
        logger_1.logger.error(`Missing step definitions (${snippets.length}).`, `Use snippets above to create them.`);
        this.printWarningOnZeroScannedFiles();
    }
    printWarningOnZeroScannedFiles() {
        const { requirePaths, importPaths } = this.supportCodeLibrary.originalCoordinates;
        const scannedFilesCount = requirePaths.length + importPaths.length;
        if (scannedFilesCount === 0 && !this.isDecorators()) {
            logger_1.logger.error(`Note that 0 step definition files found, check the config.`);
        }
    }
}
exports.Snippets = Snippets;
//# sourceMappingURL=index.js.map