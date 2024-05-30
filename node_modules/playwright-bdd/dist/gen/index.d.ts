import { BDDConfig } from '../config';
export declare class TestFilesGenerator {
    private config;
    private runConfiguration;
    private featuresLoader;
    private supportCodeLibrary;
    private files;
    private tagsExpression?;
    private logger;
    constructor(config: BDDConfig);
    generate(): Promise<void>;
    extractSteps(): Promise<import("@cucumber/cucumber/lib/models/step_definition").default[]>;
    extractUnusedSteps(): Promise<import("@cucumber/cucumber/lib/models/step_definition").default[]>;
    private loadCucumberConfig;
    private loadFeatures;
    private loadSteps;
    private loadDecoratorSteps;
    private buildFiles;
    private getSpecPathByFeaturePath;
    private checkUndefinedSteps;
    private checkImportTestFrom;
    private saveFiles;
    private clearOutputDir;
    private warnForTsNodeRegister;
    private handleParseErrors;
}
//# sourceMappingURL=index.d.ts.map