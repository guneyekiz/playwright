"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPickleStepMap = exports.getStepKeyword = exports.getScenarioDescription = void 0;
function getScenarioDescription({ pickle, gherkinScenarioMap, }) {
    return pickle.astNodeIds.map((id) => gherkinScenarioMap[id]).filter((x) => x != null)[0]
        .description;
}
exports.getScenarioDescription = getScenarioDescription;
function getStepKeyword({ pickleStep, gherkinStepMap }) {
    return pickleStep.astNodeIds.map((id) => gherkinStepMap[id]).filter((x) => x != null)[0].keyword;
}
exports.getStepKeyword = getStepKeyword;
function getPickleStepMap(pickle) {
    const result = {};
    pickle.steps.forEach((pickleStep) => (result[pickleStep.id] = pickleStep));
    return result;
}
exports.getPickleStepMap = getPickleStepMap;
//# sourceMappingURL=PickleParser.js.map