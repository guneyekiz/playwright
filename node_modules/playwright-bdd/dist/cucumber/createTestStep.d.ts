/**
 * Creates partial TestStep for usage in reporter.
 * It is partial, b/c final pickleStepId will be known only in reporter.
 *
 * See: https://github.com/cucumber/cucumber-js/blob/main/src/runtime/assemble_test_cases.ts#L93
 */
import StepDefinition from '@cucumber/cucumber/lib/models/step_definition';
import { TestStep } from '@cucumber/messages';
export declare function createTestStep(stepDefinition: StepDefinition, stepText: string): TestStep;
//# sourceMappingURL=createTestStep.d.ts.map