"use strict";
/**
 * Partial from: https://github.com/microsoft/playwright/blob/main/packages/playwright/src/runner/loadUtils.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOrImportDefaultFunction = void 0;
/* eslint-disable complexity */
const node_path_1 = __importDefault(require("node:path"));
const transform_1 = require("./transform");
async function requireOrImportDefaultFunction(file, expectConstructor) {
    let func = await (0, transform_1.requireTransform)().requireOrImport(file);
    if (func && typeof func === 'object' && 'default' in func)
        func = func['default'];
    if (typeof func !== 'function') {
        throw errorWithFile(file, `file must export a single ${expectConstructor ? 'class' : 'function'}.`);
    }
    return func;
}
exports.requireOrImportDefaultFunction = requireOrImportDefaultFunction;
function relativeFilePath(file) {
    if (!node_path_1.default.isAbsolute(file))
        return file;
    return node_path_1.default.relative(process.cwd(), file);
}
function errorWithFile(file, message) {
    return new Error(`${relativeFilePath(file)}: ${message}`);
}
//# sourceMappingURL=loadUtils.js.map