import { GherkinStepKeyword } from '@cucumber/cucumber/lib/models/gherkin_step_keyword';
import StepDefinition from '@cucumber/cucumber/lib/models/step_definition';
import { ISupportCodeLibrary } from './types';
interface IStepDefinitionConfig {
    code: any;
    line: number;
    options: any;
    keyword: GherkinStepKeyword;
    pattern: string | RegExp;
    uri: string;
}
export declare function buildStepDefinition({ keyword, pattern, code, line, options, uri }: IStepDefinitionConfig, supportCodeLibrary: ISupportCodeLibrary): StepDefinition;
export {};
//# sourceMappingURL=buildStepDefinition.d.ts.map