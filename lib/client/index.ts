import { apiRequest } from './request';
import { getBaseConfig, createQueryConfig } from '../config';

import type { FetchOptions } from 'ofetch';
import type {
  BlocketQueryParamsNative,
  BlocketAd,
  BlocketQueryConfig,
  BlocketApiResponse,
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
    location: 'location',
    category: 'category',
    subCategory: 'sub_category',
    page: 'page',
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
 * Automatically handles pagination if the API returns multiple pages of results.
 * @param query Blocket query parameters.
 * @param fetchOptions Additional fetch options.
 * @returns Array of Blocket ads from all available pages.
 */
export async function find(
  query: BlocketQueryConfig,
  fetchOptions?: FetchOptions<'json', any>
): Promise<BlocketAd[]> {
  if (!query.query) throw new Error('Query string is required');

  const config = getBaseConfig();
  const queryConfig = createQueryConfig(query);

  const params = remapQueryParams(queryConfig);

  const firstPageResponse = await apiRequest<BlocketApiResponse>(
    config.apiBaseUrl,
    {
      query: params,
      ...fetchOptions,
    }
  );

  if (
    !firstPageResponse ||
    !firstPageResponse.docs ||
    !Array.isArray(firstPageResponse.docs)
  ) {
    throw new Error(
      `Unexpected Blocket API response structure, expected array of ads, got: ${typeof firstPageResponse?.docs}`
    );
  }

  const paging = firstPageResponse.metadata?.paging;
  if (!paging || paging.last <= 1) {
    return firstPageResponse.docs;
  }

  const allAds = [...firstPageResponse.docs];
  const totalPages = paging.last;

  // Optimized pagination: Direct page parameter requests without delay
  for (let page = 2; page <= totalPages; page++) {
    const pageParams = {
      ...params,
      page,
    };

    const response = await apiRequest<BlocketApiResponse>(config.apiBaseUrl, {
      query: pageParams,
      ...fetchOptions,
    });

    if (response && response.docs && Array.isArray(response.docs)) {
      allAds.push(...response.docs);
    } else {
      throw new Error(
        `Unexpected Blocket API response structure in paginated results, expected array of ads`
      );
    }
  }

  return allAds;
}

/**
 * Get details of a specific ad by its ID.
 *
 * Note: The Blocket API no longer provides a public endpoint for single ad lookups.
 * This method searches for the ad and returns it if found.
 *
 * @param adId Advertisement ID.
 * @param fetchOptions Additional fetch options.
 * @returns {Promise<BlocketAd | null>} Blocket ad or null if not found.
 */
export async function findById(
  adId: string,
  fetchOptions?: FetchOptions<'json', any>
): Promise<BlocketAd | null> {
  const config = getBaseConfig();

  // Search with a generic query and filter by ID
  // The API doesn't support direct ID lookup, so we use the ad ID as query
  const response = await apiRequest<BlocketApiResponse>(config.apiBaseUrl, {
    query: { q: adId, lim: 100 },
    ...fetchOptions,
  });

  if (!response || !response.docs) {
    return null;
  }

  // Find the exact ad by ID
  const ad = response.docs.find(
    (doc) => doc.id === adId || doc.ad_id === parseInt(adId, 10)
  );

  return ad || null;
}
