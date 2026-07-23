/* Type surface for the self-hosted JS SDK (@openviglet/model-catalog-client),
 * which the page imports at runtime from ../sdk/model-catalog-client.js (emit
 * copies clients/js/index.js there — see T50). The SDK ships as plain .js with a
 * hand-written .d.ts in clients/js; this local declaration covers only the subset
 * the page consumes, mapped onto the page's own types. It sits at src/sdk/ so the
 * "../sdk/model-catalog-client.js" specifier resolves here at compile time; the
 * browser resolves the same specifier to public/sdk/ at runtime. */
import type {
  Catalog, ModelEntry, Classification,
  Stats, Coverage, PlansDataset, ProvidersRegistry, Leaderboards,
} from "../page/types.js";

export interface ModelCatalogClientOptions {
  baseUrl: string;
}

export class ModelCatalogClient {
  constructor(options: ModelCatalogClientOptions);
  load(): Promise<Catalog>;
  stats(): Promise<Stats | null>;
  coverage(): Promise<Coverage | null>;
  plans(): Promise<PlansDataset | null>;
  providers(): Promise<ProvidersRegistry | null>;
  leaderboards(): Promise<Leaderboards | null>;
}

export function classify(model: ModelEntry): Classification;
