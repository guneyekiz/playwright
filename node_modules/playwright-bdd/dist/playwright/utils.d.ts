import { TestInfo } from '@playwright/test';
import { PwAnnotation } from './types';
export declare const playwrightVersion: string;
/**
 * Requires Playwright's internal module that is not exported via package.exports.
 */
export declare function requirePlaywrightModule(modulePath: string): any;
export declare function getPlaywrightModulePath(relativePath: string): string;
/**
 * Create or update annotation with provided type.
 */
export declare function updateAnnotation(testInfo: TestInfo, annotation: PwAnnotation, { create }?: {
    create?: boolean | undefined;
}): void;
//# sourceMappingURL=utils.d.ts.map