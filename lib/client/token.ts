import { ofetch } from 'ofetch';

import { getBaseConfig, logger } from '../config';

import type { BlocketAccessToken } from '../types';

let cachedToken: string | null = null;

/**
 * Get the cached token.
 * @returns Cached bearer token if available.
 */
export const getCachedToken = (): string | null => cachedToken;

/**
 * Set the cached token.
 * @param token Bearer token.
 */
export const setCachedToken = (token: string): void => {
  cachedToken = token;
};

/**
 * Fetch a new token from Blocket API.
 * @param forceRefresh If true, ignores cached token and fetches a new one.
 * @returns The bearer token.
 */
export const fetchToken = async (
  forceRefresh: boolean = false
): Promise<string> => {
  if (!forceRefresh && cachedToken) return cachedToken;

  logger('debug', 'Fetching new Blocket API token.');

  const config = getBaseConfig();

  const tokenData = await ofetch<BlocketAccessToken>(config.tokenEndpoint, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'sv-SE,sv;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Referer': 'https://www.blocket.se/',
    },
  });

  if (!tokenData || !tokenData.bearerToken) {
    throw new Error('Failed to retrieve Blocket API token.');
  }

  cachedToken = tokenData.bearerToken;
  return cachedToken;
};
