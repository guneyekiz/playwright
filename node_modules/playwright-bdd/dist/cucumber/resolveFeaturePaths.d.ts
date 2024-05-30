/**
 * Representation of https://github.com/cucumber/cucumber-js/blob/main/src/paths/paths.ts
 * Since Cucumber 10.1 resolvePaths was moved from lib/api/paths to lib/paths/paths.
 * This module makes resolvePaths working with any version of Cucumber.
 * See: https://github.com/cucumber/cucumber-js/pull/2361/files
 *
 * todo: replace with own paths resolution.
 */
import { IRunConfiguration, IRunEnvironment } from '@cucumber/cucumber/api';
/**
 * Returns list of absolute feature paths.
 */
export declare function resovleFeaturePaths(runConfiguration: IRunConfiguration, environment?: IRunEnvironment): Promise<{
    featurePaths: string[];
    unexpandedFeaturePaths: string[];
}>;
//# sourceMappingURL=resolveFeaturePaths.d.ts.map