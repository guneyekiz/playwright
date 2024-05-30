/**
 * Class to build and print testMeta object containing meta info about each test.
 * Tests are identified by special key constructed from title path.
 *
 * Example:
 * const testMeta = {
 *  "Simple scenario": { pickleLocation: "3:10", tags: ["@foo"] },
 *  "Scenario with examples|Example #1": { pickleLocation: "8:26", tags: [] },
 *  "Rule 1|Scenario with examples|Example #1": { pickleLocation: "9:42", tags: [] },
 * };
 */
import { TestNode } from './testNode';
import { PickleWithLocation } from '../cucumber/loadFeatures';
import { TestInfo } from '@playwright/test';
export type TestMetaMap = Record<string, TestMeta>;
export type TestMeta = {
    pickleLocation: string;
    tags?: string[];
};
export declare class TestMetaBuilder {
    private tests;
    get testCount(): number;
    registerTest(node: TestNode, pickle: PickleWithLocation): void;
    getObjectLines(): string[];
    private getTestKey;
}
export declare function getTestMeta(testMetaMap: TestMetaMap, testInfo: TestInfo): TestMeta;
//# sourceMappingURL=testMeta.d.ts.map