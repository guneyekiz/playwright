/**
 * Store playwright config dir in env to provide access to it in workers.
 * Important that in workers there is different process.argv, that's why we save it to env.
 * Config dir is needed to resolve all paths (features, step definitions).
 */
/**
 * Returns Playwright config dir considering cli --config option.
 */
export declare function getPlaywrightConfigDir({ resolveAndSave }?: {
    resolveAndSave?: boolean | undefined;
}): string;
//# sourceMappingURL=configDir.d.ts.map