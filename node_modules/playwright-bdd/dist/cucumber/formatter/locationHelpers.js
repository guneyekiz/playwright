"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLocation = void 0;
const node_path_1 = __importDefault(require("node:path"));
const valueChecker_1 = require("../valueChecker");
function formatLocation(obj, cwd) {
    let uri = obj.uri;
    if ((0, valueChecker_1.doesHaveValue)(cwd)) {
        uri = node_path_1.default.relative(cwd, uri);
    }
    return `${uri}:${obj.line.toString()}`;
}
exports.formatLocation = formatLocation;
//# sourceMappingURL=locationHelpers.js.map