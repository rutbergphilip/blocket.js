/**
 * Blocket.js Global Configuration interface.
 */
export interface BlocketConfig {
  /**
   * Base URL for the Blocket API.
   * @default 'https://api.blocket.se/search_bff/v2/content'
   */
  apiBaseUrl: string;
  /**
   * Endpoint URL to fetch the token.
   * @default 'https://www.blocket.se/api/adout-api-route/refresh-token-and-validate-session'
   */
  tokenEndpoint: string;
  /**
   * Log level for debugging.
   * Options: 'none', 'error', 'info', 'debug'
   * @default 'error'
   */
  logLevel: 'none' | 'error' | 'info' | 'debug';
  /**
   * Maximum number of retry attempts on 401 error.
   * @default 3
   */
  retryAttempts: number;
}

/**
 * Default global configuration.
 */
export const defaultConfig: BlocketConfig = {
  apiBaseUrl: 'https://api.blocket.se/search_bff/v2/content',
  tokenEndpoint:
    'https://www.blocket.se/api/adout-api-route/refresh-token-and-validate-session',
  logLevel: 'error',
  retryAttempts: 3,
};

let currentConfig: BlocketConfig = { ...defaultConfig };

/**
 * Configure Blocket.js globally.
 * @param config Partial configuration to override defaults.
 */
export const configure = (config: Partial<BlocketConfig>): void => {
  currentConfig = { ...currentConfig, ...config };
};

/**
 * Get the current configuration.
 * @returns The current Blocket.js configuration.
 */
export const getBaseConfig = (): BlocketConfig => currentConfig;

/**
 * Simple logger function based on log level.
 * @param level Log level of the message.
 * @param message Message to log.
 */
export const logger = (
  level: 'error' | 'info' | 'debug',
  message: string
): void => {
  const levels = { none: 0, error: 1, info: 2, debug: 3 };
  if (levels[getBaseConfig().logLevel] >= levels[level]) {
    console[level === 'error' ? 'error' : 'log'](message);
  }
};

/**
 * Blocket Query Configuration interface.
 * The only required property is the query string.
 */
export interface BlocketQueryConfig {
  /**
   * The search query string.
   */
  query: string;
  /**
   * The maximum number of results to return.
   * @default 100
   */
  limit?: number;
  /**
   * The sorting order of the results.
   * @default 'rel'
   */
  sort?: 'rel';
  /**
   * The type of listing to search for. 's' for selling, 'b' for buying.
   * @default 's'
   */
  listingType?: 's' | 'b';
  /**
   * The status of the ad.
   * @default 'active'
   */
  status?: 'active' | 'inactive' | string;
  /**
   * The maximum distance in kilometers from the search location.
   * @default 3
   */
  gl?: number;
  /**
   * Additional filters or fields to include in the response.
   * @default 'extend_with_shipping'
   */
  include?: string;
}

/**
 * Default query configuration (excluding the required query string).
 */
export const defaultQueryConfig: Omit<BlocketQueryConfig, 'query'> = {
  limit: 100,
  sort: 'rel',
  listingType: 's',
  status: 'active',
  gl: 3,
  include: 'extend_with_shipping',
};

/**
 * Merges the provided query configuration with default values.
 * @param queryConfig Partial query configuration that must include the query string.
 * @returns A complete BlocketQueryConfig object.
 */
export const createQueryConfig = (
  queryConfig: Pick<BlocketQueryConfig, 'query'> &
    Partial<Omit<BlocketQueryConfig, 'query'>>
): BlocketQueryConfig => {
  return { ...defaultQueryConfig, ...queryConfig };
};
