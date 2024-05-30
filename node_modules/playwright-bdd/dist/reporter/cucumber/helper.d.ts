/**
 * Helper function to define reporter in a type-safe way.
 *
 * Examples:
 * reporter: [cucumberReporter('html', { outputFile: 'cucumber-report.html' })],
 * reporter: [cucumberReporter('./reporter.ts', { foo: 'bar' })],
 */
import { BuiltinReporters, CucumberReporterOptions } from '.';
export declare function cucumberReporter<T extends keyof BuiltinReporters | string>(type: T, userOptions?: CucumberReporterOptions<T>): [string, unknown];
//# sourceMappingURL=helper.d.ts.map