/**
 * Installs require hook to transform ts.
 * Extracted from playwright.
 * See: https://github.com/microsoft/playwright/blob/main/packages/playwright-test/src/transform/transform.ts
 */
export declare function installTransform(): () => void;
export declare function requireTransform(): {
    resolveHook: any;
    shouldTransform: any;
    transformHook: any;
    requireOrImport: any;
};
//# sourceMappingURL=transform.d.ts.map