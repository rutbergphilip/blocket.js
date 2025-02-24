import { BlocketQueryConfig, BlocketConfig } from '../types';

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
 * Default query configuration (excluding the required query string).
 */
export const defaultQueryConfig: Omit<BlocketQueryConfig, 'query'> = {
  listingType: 's',
  status: 'active',
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
