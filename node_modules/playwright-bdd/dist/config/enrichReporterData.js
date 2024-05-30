"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnrichReporterData = exports.enableEnrichReporterData = void 0;
function enableEnrichReporterData() {
    process.env.PLAYWRIGHT_BDD_ENRICH_REPORTER_DATA = '1';
}
exports.enableEnrichReporterData = enableEnrichReporterData;
function getEnrichReporterData(config) {
    const enrichReporterDataFromEnv = Boolean(process.env.PLAYWRIGHT_BDD_ENRICH_REPORTER_DATA);
    if (config.enrichReporterData === true)
        return true;
    if (config.enrichReporterData === false) {
        if (enrichReporterDataFromEnv) {
            throw new Error([
                `Cucumber reports can't work with enrichReporterData = false in bdd config.`,
                `Please, set enrichReporterData = true OR remove it from config`,
                `to let it be auto-configured.`,
            ].join(' '));
        }
        return false;
    }
    return enrichReporterDataFromEnv;
}
exports.getEnrichReporterData = getEnrichReporterData;
//# sourceMappingURL=enrichReporterData.js.map