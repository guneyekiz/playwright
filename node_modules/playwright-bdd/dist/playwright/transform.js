"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireTransform = exports.installTransform = void 0;
const module_1 = __importDefault(require("module"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const utils_1 = require("./utils");
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */
/* eslint-disable max-params */
/**
 * Installs require hook to transform ts.
 * Extracted from playwright.
 * See: https://github.com/microsoft/playwright/blob/main/packages/playwright-test/src/transform/transform.ts
 */
function installTransform() {
    const { pirates } = (0, utils_1.requirePlaywrightModule)('lib/utilsBundle.js');
    const { resolveHook, shouldTransform, transformHook } = requireTransform();
    let reverted = false;
    const originalResolveFilename = module_1.default._resolveFilename;
    function resolveFilename(specifier, parent, ...rest) {
        if (!reverted && parent) {
            const resolved = resolveHook(parent.filename, specifier);
            if (resolved !== undefined)
                specifier = resolved;
        }
        return originalResolveFilename.call(this, specifier, parent, ...rest);
    }
    module_1.default._resolveFilename = resolveFilename;
    const revertPirates = pirates.addHook((code, filename) => {
        if (!shouldTransform(filename))
            return code;
        // Since PW 1.42 transformHook returns { code, serializedCache } instead of code string
        // See: https://github.com/microsoft/playwright/commit/f605a5009b3c75746120a6ec6d940f62624af5ec#diff-0f8a2f313f1572108f59a6e84663858ebb4fc455163410526b56878794001103
        // See: https://github.com/vitalets/playwright-bdd/issues/96
        const res = transformHook(code, filename);
        return typeof res === 'string' ? res : res.code;
    }, { exts: ['.ts', '.tsx', '.js', '.jsx', '.mjs'] });
    return () => {
        reverted = true;
        module_1.default._resolveFilename = originalResolveFilename;
        revertPirates();
    };
}
exports.installTransform = installTransform;
function requireTransform() {
    const transformPathSince1_35 = (0, utils_1.getPlaywrightModulePath)('lib/transform/transform.js');
    if (node_fs_1.default.existsSync(transformPathSince1_35)) {
        const { resolveHook, shouldTransform, transformHook, requireOrImport } = (0, utils_1.requirePlaywrightModule)(transformPathSince1_35);
        return { resolveHook, shouldTransform, transformHook, requireOrImport };
    }
    else {
        const { resolveHook, transformHook, requireOrImport } = (0, utils_1.requirePlaywrightModule)('lib/common/transform.js');
        // see: https://github.com/microsoft/playwright/blob/b4ffb848de1b00e9a0abad6dacdccce60cce9bed/packages/playwright-test/src/reporters/base.ts#L524
        const shouldTransform = (file) => !file.includes(`${node_path_1.default.sep}node_modules${node_path_1.default.sep}`);
        return { resolveHook, shouldTransform, transformHook, requireOrImport };
    }
}
exports.requireTransform = requireTransform;
//# sourceMappingURL=transform.js.map