/**
 * Blocket.js Global Configuration interface.
 */
export interface BlocketConfig {
  /**
   * Base URL for the Blocket API.
   * @default 'https://www.blocket.se/recommerce/forsale/search/api/search/SEARCH_ID_BAP_COMMON'
   */
  apiBaseUrl: string;
  /**
   * Log level for debugging.
   * Options: 'none', 'error', 'info', 'debug'
   * @default 'error'
   */
  logLevel: 'none' | 'error' | 'info' | 'debug';
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
  sort?: 'rel' | 'date' | 'price_asc' | 'price_desc';
  /**
   * The type of listing to search for. `s` for selling, `b` for buying, `a` for all.
   * @default 's'
   */
  listingType?: 's' | 'b' | 'a';
  /**
   * The status of the ad. `active`, `inactive`, or `all`.
   * @default 'active'
   */
  status?: 'active' | 'deleted' | 'hidden_by_user' | 'all';
  /**
   * The maximum distance in kilometers from the search location.
   */
  geolocation?: number;
  /**
   * Additional filters or fields to include in the response.
   */
  include?: 'extend_with_shipping' | string;
  /**
   * Page number for pagination (starts from 1).
   */
  page?: number;
}

/**
 * Native Blocket query parameters for API requests.
 */
export interface BlocketQueryParamsNative {
  q: string;
  lim?: number;
  sort?: 'rel' | 'date' | 'price_asc' | 'price_desc';
  st?: 's' | 'b' | 'a';
  status?: 'active' | 'deleted' | 'hidden_by_user' | 'all';
  gl?: number;
  include?: string;
  page?: number;
}
