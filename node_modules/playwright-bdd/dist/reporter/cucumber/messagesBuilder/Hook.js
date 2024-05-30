"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hook = void 0;
/**
 * Hook that can be used in different test cases.
 * Builds Cucumber's hook message.
 */
const node_crypto_1 = require("node:crypto");
const configDir_1 = require("../../../config/configDir");
const node_path_1 = __importDefault(require("node:path"));
class Hook {
    static getInternalId(pwStep) {
        const { file, line, column } = pwStep.location || {};
        return [pwStep.category, ...pwStep.titlePath(), file, line, column].join('|');
    }
    constructor(internalId, 
    /* one of pwSteps for this hook */
    pwStep) {
        this.internalId = internalId;
        this.id = (0, node_crypto_1.randomUUID)();
        this.name = this.getName(pwStep);
        this.sourceReference = this.getSourceReference(pwStep);
    }
    buildMessage() {
        const hook = {
            id: this.id,
            name: this.name,
            sourceReference: this.sourceReference,
        };
        return { hook };
    }
    getName(pwStep) {
        // These fixture names are for anonymous hooks
        // created with Before() / After() functions.
        // Keep name empty for them to be consistent with Cucumber.
        // const bddSystemFixtures = ['fixture: $before', 'fixture: $after'];
        // if (!pwStep.title || bddSystemFixtures.includes(pwStep.title)) return undefined;
        return pwStep.title;
    }
    getSourceReference(pwStep) {
        const { file, line, column } = pwStep.location || {};
        const uri = file ? node_path_1.default.relative((0, configDir_1.getPlaywrightConfigDir)(), file) : undefined;
        return {
            uri,
            location: line
                ? {
                    line,
                    column,
                }
                : undefined,
        };
    }
}
exports.Hook = Hook;
//# sourceMappingURL=Hook.js.map