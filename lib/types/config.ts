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
   * Value is omitted by default but defaults to 20 by the API.
   * @default 20
   * @max 60
   */
  limit?: number;
  /**
   * The sorting order of the results.
   */
  sort?: 'rel';
  /**
   * The type of listing to search for. `s` for selling, `b` for buying, `a` for all.
   * @default 's'
   */
  listingType?: 's' | 'b' | 'a';
  /**
   * The status of the ad. `active`, `inactive`, or `all`.
   * @default 'active'
   */
  status?: 'active' | 'inactive' | 'all';
  /**
   * The maximum distance in kilometers from the search location.
   */
  geolocation?: number;
  /**
   * Additional filters or fields to include in the response.
   */
  include?: 'extend_with_shipping' | string;
}

/**
 * Native Blocket query parameters for API requests.
 */
export interface BlocketQueryParamsNative {
  q: string;
  lim?: number;
  sort?: 'rel';
  st?: 's' | 'b' | 'a';
  status?: 'active' | 'inactive' | 'all';
  gl?: number;
  include?: string;
}
