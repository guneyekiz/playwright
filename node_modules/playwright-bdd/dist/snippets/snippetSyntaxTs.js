"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Playwright-style snippet syntax for typescript.
 * Important to use separate file as it's simplest way to distinguish between js/ts
 * without hooking into cucumber machinery.
 */
const snippetSyntax_1 = __importDefault(require("./snippetSyntax"));
class default_1 extends snippetSyntax_1.default {
    constructor() {
        super(...arguments);
        this.isTypescript = true;
    }
}
exports.default = default_1;
//# sourceMappingURL=snippetSyntaxTs.js.map