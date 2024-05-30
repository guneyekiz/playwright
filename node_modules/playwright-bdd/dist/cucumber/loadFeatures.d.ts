/**
 * Load features.
 *
 * See: https://github.com/cucumber/cucumber-js/blob/main/src/api/load_sources.ts
 * See: https://github.com/cucumber/cucumber-js/blob/main/src/api/gherkin.ts
 */
import { IGherkinStreamOptions } from '@cucumber/gherkin-streams';
import { Query as GherkinQuery } from '@cucumber/gherkin-utils';
import { ParseError, Pickle, GherkinDocument, Location } from '@cucumber/messages';
export type GherkinDocumentWithPickles = GherkinDocument & {
    pickles: PickleWithLocation[];
};
export type PickleWithLocation = Pickle & {
    location: Location;
};
export declare class FeaturesLoader {
    gherkinQuery: GherkinQuery;
    parseErrors: ParseError[];
    /**
     * Loads and parses feature files.
     * - featurePaths should be absolute.
     *   See: https://github.com/cucumber/gherkin-streams/blob/main/src/GherkinStreams.ts#L36
     * - if options.relativeTo is provided, uri in gherkin documents will be relative to it.
     *   See: https://github.com/cucumber/gherkin-streams/blob/main/src/SourceMessageStream.ts#L31
     * - options.defaultDialect is 'en' by default.
     *   See: https://github.com/cucumber/gherkin-streams/blob/main/src/makeGherkinOptions.ts#L5
     */
    load(featurePaths: string[], options: IGherkinStreamOptions): Promise<void>;
    getDocumentsCount(): number;
    getDocumentsWithPickles(): GherkinDocumentWithPickles[];
    private getDocumentPickles;
    private getPickleWithLocation;
}
//# sourceMappingURL=loadFeatures.d.ts.map