"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeatureNameWithProject = exports.getFeatureUriWithProject = exports.getProjectInfo = exports.TITLE_SEPARATOR = void 0;
const AutofillMap_1 = require("../../../utils/AutofillMap");
// title separator used in Playwright
exports.TITLE_SEPARATOR = ' › ';
const projectsMap = new AutofillMap_1.AutofillMap();
function getProjectInfo(test) {
    const project = test.parent.project();
    const projectId = project?.name;
    return projectsMap.getOrCreate(projectId, () => {
        return {
            projectName: project?.name,
            // browserName will be empty if not defined in project
            // todo: get browser info from bddData
            browserName: project?.use.browserName || project?.use.defaultBrowserType,
        };
    });
}
exports.getProjectInfo = getProjectInfo;
/**
 * Returns URI prepended with project name.
 * It allows to separate PW projects runs of the same feature file.
 *
 * Now result should not contain spaces as Cucumber HTML report uses it as uuid.
 * See: https://github.com/cucumber/react-components/issues/344
 */
function getFeatureUriWithProject(projectInfo, uri) {
    return projectInfo?.projectName && uri ? `[${projectInfo.projectName}]:${uri}` : uri;
}
exports.getFeatureUriWithProject = getFeatureUriWithProject;
function getFeatureNameWithProject(projectName, featureName) {
    return projectName ? `${projectName}${exports.TITLE_SEPARATOR}${featureName}` : featureName;
}
exports.getFeatureNameWithProject = getFeatureNameWithProject;
//# sourceMappingURL=Projects.js.map