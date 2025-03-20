import { apiRequest } from './request';
import { getBaseConfig, createQueryConfig } from '../config';

import type { FetchOptions } from 'ofetch';
import type {
  BlocketQueryParamsNative,
  BlocketAd,
  BlocketAdResponse,
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

  const firstPageParams = remapQueryParams(queryConfig);
  Object.assign(firstPageParams, {
    page: 1,
  });

  const firstPageResponse = await apiRequest<BlocketApiResponse>(
    config.apiBaseUrl,
    {
      query: firstPageParams,
      ...fetchOptions,
    }
  );

  if (
    !firstPageResponse ||
    !firstPageResponse.data ||
    !Array.isArray(firstPageResponse.data)
  ) {
    throw new Error(
      `Unexpected Blocket API response structure, expected array of ads, got: ${typeof firstPageResponse?.data}`
    );
  }

  // If only 1 page of results, return immediately
  if (firstPageResponse.total_page_count <= 1) {
    return firstPageResponse.data;
  }

  // Otherwise, fetch all remaining pages
  const allAds = [...firstPageResponse.data];
  const totalPages = firstPageResponse.total_page_count;

  // Create an array of promises for remaining pages
  const pagePromises = [];
  for (let page = 2; page <= totalPages; page++) {
    const pageParams = remapQueryParams(queryConfig);
    Object.assign(pageParams, {
      page,
    });

    const pagePromise = apiRequest<BlocketApiResponse>(config.apiBaseUrl, {
      query: pageParams,
      ...fetchOptions,
    });

    pagePromises.push(pagePromise);
  }

  // Wait for all pages to complete
  const pageResponses = await Promise.all(pagePromises);

  // Validate and collect results from all pages
  for (const response of pageResponses) {
    if (response && response.data && Array.isArray(response.data)) {
      allAds.push(...response.data);
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
