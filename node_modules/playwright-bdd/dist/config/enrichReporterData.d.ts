/**
 * Config's enrichReporterData is auto-configured if undefined.
 * It allows to automatically enrich reporter data when Cucumber reporter is used,
 * and don't enrich if Cucumber reporter is not used to keep Playwirhgt's reporter data clear.
 *
 * For auto-configuration we use a separate env variable,
 * b/c when resolving config reporter file is not executed yet.
 */
import { BDDConfig } from '.';
export declare function enableEnrichReporterData(): void;
export declare function getEnrichReporterData(config: BDDConfig): boolean;
//# sourceMappingURL=enrichReporterData.d.ts.map