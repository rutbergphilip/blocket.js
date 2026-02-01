export * from './config';

/**
 * Blocket API response containing an array of ads with metadata.
 */
export interface BlocketApiResponse {
  docs: BlocketAd[];
  filters: unknown[];
  metadata: BlocketMetadata;
}

/**
 * Blocket API metadata containing pagination and search info.
 */
export interface BlocketMetadata {
  params: Record<string, string[]>;
  search_key: string;
  selected_filters: unknown[];
  num_results: number;
  result_size: {
    match_count: number;
    group_count: number;
  };
  paging: {
    param: string;
    current: number;
    last: number;
  };
  title: string;
  is_savable_search: boolean;
  is_end_of_paging: boolean;
  timestamp: number;
}

/**
 * Blocket advertisement object.
 */
export interface BlocketAd {
  type: string;
  id: string;
  ad_id: number;
  main_search_key: string;
  heading: string;
  location: string;
  image: {
    url: string;
    path: string;
    height: number;
    width: number;
    aspect_ratio: number;
  } | null;
  image_urls: string[];
  flags: string[];
  timestamp: number;
  coordinates?: {
    lat: number;
    lon: number;
    accuracy: number;
  };
  ad_type: number;
  labels: Array<{
    id: string;
    text: string;
    type: 'PRIMARY' | 'SECONDARY' | string;
  }>;
  canonical_url: string;
  extras: unknown[];
  price: {
    amount: number;
    currency_code: string;
    price_unit: string;
  };
  distance: number;
  trade_type: string;
}

