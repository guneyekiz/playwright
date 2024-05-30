/**
 * This function is used for playwright-style steps and decorators.
 * It extracts fixtures names from first parameter of function
 * using Playwright's helper.
 */
export declare function extractFixtureNames(fn?: Function): string[];
/**
 * This function is used for cucumber-style steps.
 * It looks for `this.useFixture('xxx')` entries in function body
 * and extracts fixtures names from it.
 */
export declare function extractFixtureNamesFromFnBodyMemo(fn?: Function): string[];
//# sourceMappingURL=fixtures.d.ts.map