"use strict";
/**
 * Creates partial TestStep for usage in reporter.
 * It is partial, b/c final pickleStepId will be known only in reporter.
 *
 * See: https://github.com/cucumber/cucumber-js/blob/main/src/runtime/assemble_test_cases.ts#L93
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestStep = void 0;
function createTestStep(stepDefinition, stepText) {
    const result = stepDefinition.expression.match(stepText);
    if (!result) {
        // this should not happen as stepDefinition is already matched
        throw Error(`Step definition didn't match step "${stepText}"`);
    }
    const stepMatchArguments = result.map((arg) => {
        return {
            group: mapArgumentGroup(arg.group),
            parameterTypeName: arg.parameterType.name,
        };
    });
    return {
        // id will be generated in reporter, no need to generate it here
        id: '',
        // looks like it's useless to store stepDefinitionIds here
        // b/c they will be different in reporter
        // stepDefinitionIds: [stepDefinition.id],
        stepMatchArgumentsLists: [{ stepMatchArguments }],
    };
}
exports.createTestStep = createTestStep;
function mapArgumentGroup(group) {
    return {
        start: group.start,
        value: group.value,
        children: group.children?.map((child) => mapArgumentGroup(child)),
    };
}
//# sourceMappingURL=createTestStep.js.map