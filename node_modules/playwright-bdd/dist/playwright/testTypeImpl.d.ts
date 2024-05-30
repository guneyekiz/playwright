import { Location } from '@playwright/test/reporter';
import { TestTypeCommon } from './types';
/**
 * Run step with location pointing to Given, When, Then call.
 */
export declare function runStepWithCustomLocation(test: TestTypeCommon, stepText: string, location: Location, body: () => unknown): Promise<unknown>;
/**
 * Returns true if test contains all fixtures of subtest.
 * - test was extended from subtest
 * - test is a result of mergeTests(subtest, ...)
 */
export declare function isTestContainsSubtest(test: TestTypeCommon, subtest: TestTypeCommon): boolean;
//# sourceMappingURL=testTypeImpl.d.ts.map