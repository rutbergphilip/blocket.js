import { ofetch } from 'ofetch';
import { getConfig, logger } from '@/config';

import type { BlocketAccessToken } from '@/types';

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

  const config = getConfig();

  const tokenData = await ofetch<BlocketAccessToken>(config.tokenEndpoint);
  if (!tokenData || !tokenData.bearerToken) {
    throw new Error('Failed to retrieve Blocket API token.');
  }

  cachedToken = tokenData.bearerToken;
  return cachedToken;
};
