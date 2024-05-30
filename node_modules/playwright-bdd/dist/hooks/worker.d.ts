/**
 * Worker-level hooks: BeforeAll / AfterAll.
 */
import { WorkerInfo } from '@playwright/test';
import { KeyValue } from '../playwright/types';
type WorkerHookOptions = {
    timeout?: number;
};
type WorkerHookBddFixtures = {
    $workerInfo: WorkerInfo;
};
type WorkerHookFn<Fixtures> = (fixtures: Fixtures) => unknown;
type WorkerHook<Fixtures = object> = {
    type: 'beforeAll' | 'afterAll';
    options: WorkerHookOptions;
    fn: WorkerHookFn<Fixtures>;
};
/**
 * When calling BeforeAll() / AfterAll() you can pass:
 * 1. hook fn
 * 2. options object + hook fn
 *
 * See: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/api_reference.md#afteralloptions-fn
 */
type WorkerHookDefinitionArgs<Fixtures> = [WorkerHookFn<Fixtures>] | [WorkerHookOptions, WorkerHookFn<Fixtures>];
/**
 * Returns BeforeAll() / AfterAll() functions.
 */
export declare function workerHookFactory<WorkerFixtures extends KeyValue>(type: WorkerHook['type']): (...args: WorkerHookDefinitionArgs<WorkerFixtures & WorkerHookBddFixtures>) => void;
export declare function runWorkerHooks<Fixtures extends WorkerHookBddFixtures>(type: WorkerHook['type'], fixtures: Fixtures): Promise<void>;
export declare function getWorkerHooksFixtures(): string[];
export {};
//# sourceMappingURL=worker.d.ts.map