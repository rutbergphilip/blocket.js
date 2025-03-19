export * from './config';

/**
 * Access token.
 */
export type BlocketAccessToken = {
  user: null;
  isLoggedIn: false;
  bearerToken: string;
};

/**
 * Blocket API response containing an array of ads.
 */
export interface BlocketAdSearchResponse {
  data: BlocketAd[];
}

/**
 * Blocket API response containing a single ad.
 */
export interface BlocketAdResponse {
  data: BlocketAd;
}

/**
 * Blocket API response containing an array of ads with additional metadata.
 */
export interface BlocketApiResponse {
  data: BlocketAd[];
  gallery: unknown[];
  inventory: Record<string, unknown>;
  next_scroll_block: number;
  next_scroll_id: string;
  non_shipping_count: number;
  query_signature: string;
  saveable: boolean;
  selected_values: string;
  share_url: string;
  title: string;
  total_count: number;
  total_page_count: number;
}

/**
 * Blocket advertisement object.
 */
export interface BlocketAd {
  ad_id: string;
  ad_status: 'active' | 'inactive' | string;
  advertiser: {
    account_id: string;
    contact_methods: Record<string, any>;
    name: string;
    public_profile: Record<string, any>;
    type: 'private' | 'business';
  };
  body: string;
  category: Record<string, any>[];
  co2_text: string;
  images: Record<string, any>[];
  list_id: string;
  list_time: string; // ISO date string
  location: Record<string, any>[];
  map_url: string;
  parameter_groups: Record<string, any>[];
  parameters_raw: {
    is_shipping_buy_now_enabled: Record<string, any>;
    shipping_enabled: Record<string, any>;
  };
  price: {
    suffix: string;
    value: number;
  };
  price_badge?: {
    icon: Record<string, any>;
    id: string;
    label: string;
  };
  share_url: string;
  state_id: string;
  subject: string;
  type: string;
  zipcode: string;
}
