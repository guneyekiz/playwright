/**
 * Generate and show snippets for undefined steps
 */
import { IRunConfiguration } from '@cucumber/cucumber/api';
import { TestFile } from '../gen/testFile';
import { ISupportCodeLibrary } from '../cucumber/types';
export declare class Snippets {
    private files;
    private runConfiguration;
    private supportCodeLibrary;
    private snippetBuilder;
    private bddBuiltInSyntax;
    constructor(files: TestFile[], runConfiguration: IRunConfiguration, supportCodeLibrary: ISupportCodeLibrary);
    print(): Promise<void>;
    private createSnippetBuilder;
    private getSnippetSyntax;
    private getSnippets;
    private getSnippet;
    private isTypeScript;
    private isPlaywrightStyle;
    private isDecorators;
    private printHeader;
    private printSnippets;
    private printFooter;
    private printWarningOnZeroScannedFiles;
}
//# sourceMappingURL=index.d.ts.map