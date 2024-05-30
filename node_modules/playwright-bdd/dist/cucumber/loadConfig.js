"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = void 0;
const api_1 = require("@cucumber/cucumber/api");
const cache = new Map();
async function loadConfig(options, environment) {
    const cacheKey = JSON.stringify(options);
    let config = cache.get(cacheKey);
    if (!config) {
        config = (0, api_1.loadConfiguration)(options, environment);
        cache.set(cacheKey, config);
    }
    return config;
}
exports.loadConfig = loadConfig;
//# sourceMappingURL=loadConfig.js.map