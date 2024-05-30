"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestStepAttachments = void 0;
/**
 * Class for getting attachment messages for a particular step.
 */
const node_fs_1 = __importDefault(require("node:fs"));
const messages = __importStar(require("@cucumber/messages"));
const node_path_1 = __importDefault(require("node:path"));
class TestStepAttachments {
    constructor(testCaseRun, testStep, pwStep) {
        this.testCaseRun = testCaseRun;
        this.testStep = testStep;
        this.pwStep = pwStep;
    }
    buildMessages() {
        if (!this.pwStep)
            return [];
        return this.testCaseRun.attachmentMapper
            .getStepAttachments(this.pwStep)
            .map((pwAttachment) => this.buildAttachmentMessage(pwAttachment));
    }
    buildAttachmentMessage(pwAttachment) {
        const attachment = {
            testCaseStartedId: this.testCaseRun.id,
            testStepId: this.testStep.id,
            // for now always attach as base64
            // todo: for text/plain and application/json use raw to save some bytes
            body: this.getAttachmentBodyBase64(pwAttachment),
            contentEncoding: messages.AttachmentContentEncoding.BASE64,
            mediaType: pwAttachment.contentType,
            fileName: pwAttachment.name,
        };
        return { attachment };
    }
    getAttachmentBodyBase64(pwAttachment) {
        if (pwAttachment.path) {
            if (node_fs_1.default.existsSync(pwAttachment.path)) {
                return node_fs_1.default.readFileSync(pwAttachment.path, 'base64');
            }
            throw createMissingAttachmentError(pwAttachment.path);
        }
        if (pwAttachment.body) {
            return pwAttachment.body.toString('base64');
        }
        throw new Error(`Playwright attachment without path and body`);
    }
}
exports.TestStepAttachments = TestStepAttachments;
function createMissingAttachmentError(attachmentPath) {
    const attachmentDir = node_path_1.default.join(node_path_1.default.dirname(attachmentPath));
    const attachmentDirExists = node_fs_1.default.existsSync(attachmentDir);
    const files = attachmentDirExists ? node_fs_1.default.readdirSync(attachmentDir) : [];
    const errorMsg = [
        `Attachment file is not found:`,
        attachmentPath,
        `Attachment dir ${attachmentDirExists ? 'exists' : 'does not exist'}.`,
        ...(attachmentDirExists ? [`Available files (${files.length}):`, ...files] : []),
        '',
    ].join('\n');
    return new Error(errorMsg);
}
//# sourceMappingURL=TestStepAttachments.js.map