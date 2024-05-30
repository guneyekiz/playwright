"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    build({ generatedExpressions, functionName }) {
        // Always take only first generatedExpression
        // Other expressions are for int/float combinations
        const generatedExpression = generatedExpressions[0];
        return `@${functionName}('${this.escapeSpecialCharacters(generatedExpression)}')`;
    }
    escapeSpecialCharacters(generatedExpression) {
        let source = generatedExpression.source;
        // double up any backslashes because we're in a javascript string
        source = source.replace(/\\/g, '\\\\');
        // escape any single quotes because that's our quote delimiter
        source = source.replace(/'/g, "\\'");
        return source;
    }
}
exports.default = default_1;
//# sourceMappingURL=snippetSyntaxDecorators.js.map