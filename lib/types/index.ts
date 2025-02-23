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
export interface BlocketResponse {
  data: BlocketAd[];
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

/**
 * Parameters for querying Blocket ads.
 */
export interface BlocketQueryParams {
  /**
   * The search query.
   * @example 'macbook air'
   */
  query: string;
  /**
   * The maximum number of results to return.
   * @example 10
   * @default 60
   */
  limit?: number;
  /**
   * The sorting order of the results.
   * @example 'rel'
   * @default 'rel'
   */
  sort?: 'rel';
  /**
   * The type of listing to search for. 's' for selling, 'b' for buying.
   * @example 's'
   * @default 's'
   * @options 's' | 'b'
   */
  listingType?: 's' | 'b';
  /**
   * The status of the ad.
   * @example 'active'
   * @default 'active'
   */
  status?: 'active' | 'inactive' | string;
  /**
   * The maximum distance in kilometers from the search location.
   * @example 10
   */
  gl?: number;
  /**
   * Additional filters or fields to include in the response.
   * @example 'image,description'
   */
  include?: string;
}
