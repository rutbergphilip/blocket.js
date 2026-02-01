import { ofetch, type FetchOptions } from 'ofetch';

import { logger } from '../config';

/**
 * Make an API request with User-Agent authentication.
 * @param url URL to fetch.
 * @param options Fetch options.
 * @returns Parsed response of type T.
 */
export async function apiRequest<T>(
  url: string,
  options: FetchOptions<'json', any> = {}
): Promise<T> {
  try {
    return await ofetch<T>(url, {
      ...options,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',
        ...options.headers,
      },
    });
  } catch (error: any) {
    if (error?.status >= 400) {
      logger(
        'error',
        `HTTP ${error.status}: ${error.statusText || 'Request failed'}`
      );
    }
    throw error;
  }
}
