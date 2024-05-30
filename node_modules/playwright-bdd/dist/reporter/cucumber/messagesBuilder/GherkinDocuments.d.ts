import { TestCaseRun } from './TestCaseRun';
import { GherkinDocumentWithPickles } from '../../../cucumber/loadFeatures';
import { ConcreteEnvelope } from './types';
import { ProjectInfo } from './Projects';
export declare class GherkinDocuments {
    private featuresLoader;
    private projectsPerFeaturePath;
    private gherkinDocumentsPerProject;
    constructor();
    load(testCaseRuns: TestCaseRun[]): Promise<void>;
    getDocumentsForProject(projectInfo: ProjectInfo): GherkinDocumentWithPickles[];
    buildMessages(): {
        sources: ConcreteEnvelope<"source">[];
        gherkinDocuments: ConcreteEnvelope<"gherkinDocument">[];
    };
    private fillProjectsPerFeaturePath;
    private fillGherkinDocumentsPerProject;
    private addGherkinDocumentToProject;
    private buildSourceMessage;
    private getFeaturesLang;
}
//# sourceMappingURL=GherkinDocuments.d.ts.map