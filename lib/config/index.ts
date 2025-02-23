/**
 * Configuration interface.
 */
export interface BlocketConfig {
  /**
   * Base URL for the Blocket API.
   * @default 'https://api.blocket.se/v1'
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
 * Default configuration.
 */
export const defaultConfig: BlocketConfig = {
  apiBaseUrl: 'https://api.blocket.se/v1',
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
export const getConfig = (): BlocketConfig => currentConfig;

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
  if (levels[getConfig().logLevel] >= levels[level]) {
    console[level === 'error' ? 'error' : 'log'](message);
  }
};
