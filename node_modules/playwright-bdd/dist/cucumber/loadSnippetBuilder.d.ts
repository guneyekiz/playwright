/**
 * Loads snippet builder
 * See: https://github.com/cucumber/cucumber-js/blob/main/src/formatter/builder.ts
 */
import { SnippetInterface } from '@cucumber/cucumber/lib/formatter/step_definition_snippet_builder/snippet_syntax';
import { ISupportCodeLibrary } from './types';
export declare function loadSnippetBuilder(supportCodeLibrary: ISupportCodeLibrary, snippetInterface?: SnippetInterface, snippetSyntax?: string): Promise<import("@cucumber/cucumber/lib/formatter/step_definition_snippet_builder").default>;
//# sourceMappingURL=loadSnippetBuilder.d.ts.map