/**
 * Scenario level hooks: Before / After.
 *
 * before(async ({ page }) => {})
 */
import { TestInfo } from '@playwright/test';
import parseTagsExpression from '@cucumber/tag-expressions';
import { BddWorld } from '../run/bddWorld';
import { KeyValue, PlaywrightLocation } from '../playwright/types';
type ScenarioHookOptions = {
    name?: string;
    tags?: string;
    timeout?: number;
};
type ScenarioHookBddFixtures<World> = {
    $bddWorld: World;
    $tags: string[];
    $testInfo: TestInfo;
};
type ScenarioHookFn<Fixtures, World> = (this: World, fixtures: Fixtures) => unknown;
type ScenarioHook<Fixtures = object, World extends BddWorld = BddWorld> = {
    type: 'before' | 'after';
    options: ScenarioHookOptions;
    fn: ScenarioHookFn<Fixtures, World>;
    tagsExpression?: ReturnType<typeof parseTagsExpression>;
    location: PlaywrightLocation;
};
/**
 * When calling Before() / After() you can pass:
 * 1. hook fn
 * 2. tags string + hook fn
 * 3. options object + hook fn
 *
 * See: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/api_reference.md#afteroptions-fn
 */
type ScenarioHookDefinitionArgs<Fixtures, World> = [ScenarioHookFn<Fixtures, World>] | [NonNullable<ScenarioHookOptions['tags']>, ScenarioHookFn<Fixtures, World>] | [ScenarioHookOptions, ScenarioHookFn<Fixtures, World>];
/**
 * Returns Before() / After() functions.
 */
export declare function scenarioHookFactory<TestFixtures extends KeyValue, WorkerFixtures extends KeyValue, World>(type: ScenarioHook['type']): (...args: ScenarioHookDefinitionArgs<TestFixtures & WorkerFixtures & ScenarioHookBddFixtures<World>, World>) => void;
export declare function hasScenarioHooks(): boolean;
export declare function runScenarioHooks<World extends BddWorld, Fixtures extends ScenarioHookBddFixtures<World>>(type: ScenarioHook['type'], fixtures: Fixtures): Promise<void>;
export declare function getScenarioHooksFixtures(): string[];
export {};
//# sourceMappingURL=scenario.d.ts.map