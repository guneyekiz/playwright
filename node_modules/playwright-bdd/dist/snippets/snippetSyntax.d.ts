import { ISnippetSyntaxBuildOptions } from '@cucumber/cucumber/lib/formatter/step_definition_snippet_builder/snippet_syntax';
export default class {
    isTypescript: boolean;
    build({ generatedExpressions, functionName, stepParameterNames }: ISnippetSyntaxBuildOptions): string;
    private escapeSpecialCharacters;
}
//# sourceMappingURL=snippetSyntax.d.ts.map