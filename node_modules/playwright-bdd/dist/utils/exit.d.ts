/**
 * Exit utils.
 *
 * When calling process.exit() in worker thread used for test-file generation,
 * logs are not flushed (https://github.com/vitalets/playwright-bdd/issues/59).
 * That's why instead of process.exit we throw ExitError
 * that just sets process.exitCode = 1 and allow program to exit normally.
 * This esnured by wrapping code with withExitHandler().
 *
 * On the other hand, when running in the main thread, especially inside Playwright,
 * thrown error is captured by Playwright and show with additional messages (e.g. no tests found).
 * That's why in main thread we to call process.exit() to show only needed error.
 *
 * Relevant discussions:
 * - https://github.com/nodejs/node/issues/6379
 * - https://github.com/nodejs/node-v0.x-archive/issues/3737
 * - https://github.com/cucumber/cucumber-js/pull/123
 */
export declare function withExitHandler(fn: () => unknown): Promise<unknown>;
export declare function exit(...messages: string[]): void;
//# sourceMappingURL=exit.d.ts.map