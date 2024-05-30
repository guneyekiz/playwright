/**
 * Utility functions for filtering Playwright steps.
 */
import * as pw from '@playwright/test/reporter';
import { HookType } from './Hook';
export declare function collectStepsWithCategory(parent: pw.TestResult | pw.TestStep | undefined, category: string | string[]): pw.TestStep[];
export declare function getHooksRootPwStep(result: pw.TestResult, type: HookType): pw.TestStep | undefined;
export declare function findDeepestStepWithError(root?: pw.TestStep): pw.TestStep | undefined;
export declare function findDeepestStepWithUnknownDuration(root?: pw.TestStep): pw.TestStep | undefined;
/**
 * Returns all steps in DFS order.
 * See: https://en.wikipedia.org/wiki/Depth-first_search
 */
export declare function collectStepsDfs(parent: pw.TestResult | pw.TestStep | undefined): pw.TestStep[];
export declare function isUnknownDuration(pwStep: pw.TestStep): boolean;
//# sourceMappingURL=pwStepUtils.d.ts.map