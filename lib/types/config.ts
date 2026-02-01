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
 * Sort order options for search results.
 */
export type BlocketSortOrder =
  | 'RELEVANCE'
  | 'PRICE_ASC'
  | 'PRICE_DESC'
  | 'PUBLISHED_ASC'
  | 'PUBLISHED_DESC';

/**
 * Swedish location IDs for filtering by region.
 */
export const BlocketLocations = {
  BLEKINGE: '0.300010',
  DALARNA: '0.300020',
  GOTLAND: '0.300009',
  GAVLEBORG: '0.300021',
  HALLAND: '0.300013',
  JAMTLAND: '0.300023',
  JONKOPING: '0.300006',
  KALMAR: '0.300008',
  KRONOBERG: '0.300007',
  NORRBOTTEN: '0.300025',
  SKANE: '0.300012',
  STOCKHOLM: '0.300001',
  SODERMANLAND: '0.300004',
  UPPSALA: '0.300003',
  VARMLAND: '0.300017',
  VASTERBOTTEN: '0.300024',
  VASTERNORRLAND: '0.300022',
  VASTMANLAND: '0.300019',
  VASTRA_GOTALAND: '0.300014',
  OREBRO: '0.300018',
  OSTERGOTLAND: '0.300005',
} as const;

export type BlocketLocation =
  (typeof BlocketLocations)[keyof typeof BlocketLocations];

/**
 * Main category IDs for filtering.
 */
export const BlocketCategories = {
  AFFARSVERKSAMHET: '0.91',
  DJUR_OCH_TILLBEHOR: '0.77',
  ELEKTRONIK_OCH_VITVAROR: '0.93',
  FORDONSTILLBEHOR: '0.90',
  FRITID_HOBBY_OCH_UNDERHALLNING: '0.86',
  FORALDRAR_OCH_BARN: '0.68',
  KLADER_KOSMETIKA_OCH_ACCESSOARER: '0.71',
  KONST_OCH_ANTIKT: '0.76',
  MOBLER_OCH_INREDNING: '0.78',
  SPORT_OCH_FRITID: '0.69',
  TRADGARD_OCH_RENOVERING: '0.67',
} as const;

export type BlocketCategory =
  (typeof BlocketCategories)[keyof typeof BlocketCategories];

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
   * The maximum number of results to return per page.
   * @default 20
   * @max 60
   */
  limit?: number;
  /**
   * The sorting order of the results.
   * @default 'RELEVANCE'
   */
  sort?: BlocketSortOrder;
  /**
   * Filter by location/region. Can be a single location or array of locations.
   * Use BlocketLocations constants for valid values.
   * @example 'STOCKHOLM' or ['STOCKHOLM', 'UPPSALA']
   */
  location?: BlocketLocation | BlocketLocation[];
  /**
   * Filter by main category.
   * Use BlocketCategories constants for valid values.
   */
  category?: BlocketCategory | string;
  /**
   * Filter by subcategory.
   * Cannot be used together with category.
   */
  subCategory?: string;
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
  sort?: string;
  location?: string | string[];
  category?: string;
  sub_category?: string;
  page?: number;
}
