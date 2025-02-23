import { ofetch, type FetchOptions } from 'ofetch';

import { fetchToken, setCachedToken } from './token';
import { getConfig, logger } from '@/config';

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
  const config = getConfig();
  const token = await fetchToken();

  try {
    return await ofetch<T>(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    if (error?.data?.status_code === 401 && retryCount < config.retryAttempts) {
      logger(
        'info',
        `Token expired. Retrying request (${retryCount + 1}/${
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
