import { apiRequest } from './request';
import { getBaseConfig, createQueryConfig } from '../config';

import type { FetchOptions } from 'ofetch';
import type {
  BlocketQueryParamsNative,
  BlocketAd,
  BlocketResponse,
  BlocketQueryConfig,
} from '../types';

/**
 * Remap BlocketQueryConfig to API readable BlocketQueryParamsNative.
 * @param params Blocket query parameters.
 * @returns Remapped query parameters.
 */
function remapQueryParams(
  params: BlocketQueryConfig
): BlocketQueryParamsNative {
  return {
    q: params.query,
    lim: params.limit,
    sort: params.sort,
    st: params.listingType,
    status: params.status,
    gl: params.geolocation,
    include: params.include,
  } as BlocketQueryParamsNative;
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
  const config = getBaseConfig();
  const queryConfig = createQueryConfig(query);

  const response = await apiRequest<BlocketResponse>(config.apiBaseUrl, {
    query: remapQueryParams(queryConfig),
    ...fetchOptions,
  });

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
 * @returns Blocket ad details.
 */
async function getAd(
  adId: string,
  fetchOptions?: FetchOptions<'json', any>
): Promise<BlocketAd> {
  const config = getBaseConfig();
  const url = `${config.apiBaseUrl}/ad/${adId}`;

  return await apiRequest<BlocketAd>(url, fetchOptions);
}
