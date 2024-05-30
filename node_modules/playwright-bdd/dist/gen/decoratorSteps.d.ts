/**
 * Decorator steps are generated differently from regular steps.
 * Because they need to guess correct fixture after all steps are processed (to handle POM classes inheritance).
 * In the first pass, decorator steps are rendered as empty lines (slots).
 * Then fixtures are guessed and slots are filled with decorator steps lines.
 */
import { PickleStep } from '@cucumber/messages';
import { PomNode } from '../steps/decorators/pomGraph';
type DecoratorStepsOptions = {
    statefulPoms?: boolean;
    featureUri: string;
    testTitle: string;
    testFixtureNames: Set<string>;
    testTags?: string[];
};
type DecoratorStepInfo = {
    index: number;
    keyword: string;
    pickleStep: PickleStep;
    pomNode: PomNode;
    fixtureName: string;
};
export declare class DecoratorSteps {
    private options;
    private steps;
    private testPoms;
    constructor(options: DecoratorStepsOptions);
    push(partialStepInfo: Omit<DecoratorStepInfo, 'fixtureName'>): void;
    forEach(fn: (step: DecoratorStepInfo) => unknown): void;
    resolveFixtureNames(): void;
    private getFixtureName;
    private exitEmptyFixture;
    private exitAmbiguousFixture;
}
export {};
//# sourceMappingURL=decoratorSteps.d.ts.map