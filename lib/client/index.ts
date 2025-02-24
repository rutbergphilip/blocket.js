import { apiRequest } from './request';
import { getBaseConfig, createQueryConfig } from '../config';

import type { FetchOptions } from 'ofetch';
import type {
  BlocketQueryParamsNative,
  BlocketAd,
  BlocketAdResponse,
  BlocketAdSearchResponse,
  BlocketQueryConfig,
} from '../types';

/**
 * Remap BlocketQueryConfig to API readable BlocketQueryParamsNative.
 * @param params Blocket user readable query parameters.
 * @returns Remapped API readable query parameters.
 */
function remapQueryParams(
  params: BlocketQueryConfig
): BlocketQueryParamsNative {
  const mapping: Record<
    keyof BlocketQueryConfig,
    keyof BlocketQueryParamsNative
  > = {
    query: 'q',
    limit: 'lim',
    sort: 'sort',
    listingType: 'st',
    status: 'status',
    geolocation: 'gl',
    include: 'include',
  };

  const remapped: Partial<BlocketQueryParamsNative> = {};

  for (const key in params) {
    if (mapping[key as keyof BlocketQueryConfig]) {
      const newKey = mapping[key as keyof BlocketQueryConfig];
      Object.assign(remapped, {
        [newKey]: params[key as keyof BlocketQueryConfig],
      });
    }
  }

  return remapped as BlocketQueryParamsNative;
}

/**
 * Find ads on Blocket based on query parameters.
 * @param query Blocket query parameters.
 * @param fetchOptions Additional fetch options.
 * @returns Array of Blocket ads.
 */
export async function find(
  query: BlocketQueryConfig,
  fetchOptions?: FetchOptions<'json', any>
): Promise<BlocketAd[]> {
  if (!query.query) throw new Error('Query string is required');

  const config = getBaseConfig();
  const queryConfig = createQueryConfig(query);

  const response = await apiRequest<BlocketAdSearchResponse>(
    config.apiBaseUrl,
    {
      query: remapQueryParams(queryConfig),
      ...fetchOptions,
    }
  );

  if (!response || !response.data || !Array.isArray(response.data)) {
    throw new Error(
      `Unexpected Blocket API response structure, expected array of ads, got: ${typeof response?.data}`
    );
  }

  return response.data;
}

/**
 * Get details of a specific ad by its ID.
 * @param adId Advertisement ID.
 * @param fetchOptions Additional fetch options.
 * @returns {Promise<BlocketAd | null>} Blocket ad details or null if not found.
 */
export async function findById(
  adId: string,
  fetchOptions?: FetchOptions<'json', any>
): Promise<BlocketAd | null> {
  const config = getBaseConfig();
  const url = `${config.apiBaseUrl}/${adId}`;

  const ad = await apiRequest<BlocketAdResponse>(url, fetchOptions);

  if (!ad || !ad?.data) {
    return null;
  }

  return ad.data;
}
