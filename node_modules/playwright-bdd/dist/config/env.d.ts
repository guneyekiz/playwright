/**
 * Storing configs in env var PLAYWRIGHT_BDD_CONFIGS as JSON-stringified values.
 * For passing configs to playwright workers and bddgen.
 */
import { BDDConfig } from '.';
type OutputDir = string;
type EnvConfigs = Record<OutputDir, BDDConfig>;
export declare function saveConfigToEnv(config: BDDConfig): void;
export declare function getConfigFromEnv(outputDir: string): BDDConfig;
export declare function getEnvConfigs(): EnvConfigs;
export {};
//# sourceMappingURL=env.d.ts.map