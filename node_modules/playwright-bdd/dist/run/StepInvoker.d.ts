/**
 * Class to invoke step in playwright runner.
 */
import { BddWorld } from './bddWorld';
import { PickleStepArgument } from '@cucumber/messages';
import { Fixtures, TestTypeCommon } from '../playwright/types';
type StepKeyword = 'Given' | 'When' | 'Then' | 'And' | 'But';
export declare class StepInvoker {
    private world;
    private keyword;
    constructor(world: BddWorld, keyword: StepKeyword);
    /**
     * Invokes particular step.
     * See: https://github.com/cucumber/cucumber-js/blob/main/src/runtime/test_case_runner.ts#L299
     */
    invoke(stepText: string, argument?: PickleStepArgument | null, stepFixtures?: Fixtures<TestTypeCommon>): Promise<void>;
    private getStepDefinition;
    private getStepParameters;
    private getStepTitle;
}
export {};
//# sourceMappingURL=StepInvoker.d.ts.map