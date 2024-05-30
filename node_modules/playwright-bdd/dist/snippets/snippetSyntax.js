"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// todo: custom cucumber parameters
// See: https://github.com/cucumber/cucumber-expressions#custom-parameter-types
class default_1 {
    constructor() {
        this.isTypescript = false;
    }
    build({ generatedExpressions, functionName, stepParameterNames }) {
        // Always take only first generatedExpression
        // Other expressions are for int/float combinations
        const generatedExpression = generatedExpressions[0];
        const expressionParameters = generatedExpression.parameterNames.map((name, i) => {
            const argName = `arg${i === 0 ? '' : i}`;
            const type = name.startsWith('string') ? 'string' : 'number';
            return this.isTypescript ? `${argName}: ${type}` : argName;
        });
        const stepParameters = stepParameterNames.map((argName) => {
            const type = argName === 'dataTable' ? 'DataTable' : 'string';
            return this.isTypescript ? `${argName}: ${type}` : argName;
        });
        const allParameterNames = ['{}', ...expressionParameters, ...stepParameters];
        const functionSignature = `${functionName}('${this.escapeSpecialCharacters(generatedExpression)}', async (${allParameterNames.join(', ')}) => {`;
        return [
            functionSignature, // prettier-ignore
            `  // ...`,
            '});',
        ].join('\n');
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
//# sourceMappingURL=snippetSyntax.js.map