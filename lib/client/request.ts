import { ofetch, type FetchOptions } from 'ofetch';

import { fetchToken, setCachedToken } from './token';
import { getBaseConfig, logger } from '../config';

/**
 * Make an API request with automatic token handling and retry on 401 errors.
 * @param url URL to fetch.
 * @param options Fetch options.
 * @param retryCount Current retry count.
 * @returns Parsed response of type T.
 */
export async function apiRequest<T>(
  url: string,
  options: FetchOptions<'json', any> = {},
  retryCount: number = 0
): Promise<T> {
  const config = getBaseConfig();
  const token = await fetchToken();

  try {
    const response = await ofetch<T>(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'sv-SE,sv;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': 'https://www.blocket.se/',
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error: any) {
    // Enhanced error handling for HTTP status codes
    if (error?.status >= 400) {
      logger('error', `HTTP ${error.status}: ${error.statusText || 'Request failed'}`);
    }

    if ((error?.status === 401 || error?.data?.status_code === 401) && retryCount < config.retryAttempts) {
      logger(
        'info',
        `Token expired (${error.status}). Retrying request (${retryCount + 1}/${
          config.retryAttempts
        }).`
      );
      const newToken = await fetchToken(true);
      setCachedToken(newToken);
      return apiRequest<T>(url, options, retryCount + 1);
    }
    throw error;
  }
}
