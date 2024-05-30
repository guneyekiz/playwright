"use strict";
/**
 * Load features.
 *
 * See: https://github.com/cucumber/cucumber-js/blob/main/src/api/load_sources.ts
 * See: https://github.com/cucumber/cucumber-js/blob/main/src/api/gherkin.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturesLoader = void 0;
const gherkin_streams_1 = require("@cucumber/gherkin-streams");
const gherkin_utils_1 = require("@cucumber/gherkin-utils");
class FeaturesLoader {
    constructor() {
        this.gherkinQuery = new gherkin_utils_1.Query();
        this.parseErrors = [];
    }
    /**
     * Loads and parses feature files.
     * - featurePaths should be absolute.
     *   See: https://github.com/cucumber/gherkin-streams/blob/main/src/GherkinStreams.ts#L36
     * - if options.relativeTo is provided, uri in gherkin documents will be relative to it.
     *   See: https://github.com/cucumber/gherkin-streams/blob/main/src/SourceMessageStream.ts#L31
     * - options.defaultDialect is 'en' by default.
     *   See: https://github.com/cucumber/gherkin-streams/blob/main/src/makeGherkinOptions.ts#L5
     */
    async load(featurePaths, options) {
        this.gherkinQuery = new gherkin_utils_1.Query();
        this.parseErrors = [];
        await gherkinFromPaths(featurePaths, options, (envelope) => {
            this.gherkinQuery.update(envelope);
            if (envelope.parseError) {
                this.parseErrors.push(envelope.parseError);
            }
        });
    }
    getDocumentsCount() {
        return this.gherkinQuery.getGherkinDocuments().length;
    }
    getDocumentsWithPickles() {
        return this.gherkinQuery.getGherkinDocuments().map((gherkinDocument) => {
            const pickles = this.getDocumentPickles(gherkinDocument);
            return { ...gherkinDocument, pickles };
        });
    }
    getDocumentPickles(gherkinDocument) {
        return this.gherkinQuery
            .getPickles()
            .filter((pickle) => gherkinDocument.uri === pickle.uri)
            .map((pickle) => this.getPickleWithLocation(pickle));
    }
    getPickleWithLocation(pickle) {
        const lastAstNodeId = pickle.astNodeIds[pickle.astNodeIds.length - 1];
        const location = this.gherkinQuery.getLocation(lastAstNodeId);
        return { ...pickle, location };
    }
}
exports.FeaturesLoader = FeaturesLoader;
async function gherkinFromPaths(paths, options, onEnvelope) {
    return new Promise((resolve, reject) => {
        const gherkinMessageStream = gherkin_streams_1.GherkinStreams.fromPaths(paths, options);
        gherkinMessageStream.on('data', onEnvelope);
        gherkinMessageStream.on('end', resolve);
        gherkinMessageStream.on('error', reject);
    });
}
//# sourceMappingURL=loadFeatures.js.map