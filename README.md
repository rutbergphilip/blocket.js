# blocket.js

blocket.js is a lightweight and easy-to-use npm package that provides a TypeScript interface to the unofficial Blocket API. It allows you to search and retrieve ads from blocket.se with automatic token management and error handling, so you can focus on building your application without worrying about the underlying API token management.

## Features

- **Simple API**: Import the client and call methods like `find` and `getAd` directly.
- **Automatic Token Management**: Handles token retrieval, caching, and refreshing automatically when a token expires (detected via 401 errors).
- **Configurable**: Global and per-request configuration options let you override API endpoints, logging preferences, retry attempts, and more.
- **TypeScript Support**: Fully typed interfaces for query parameters, API responses, and advertisements.
- **Robust Error Handling & Logging**: Automatic retries on token expiry with configurable logging to assist in debugging.

## Installation

Install blocket.js via npm:

```bash
npm install blocket.js
```

or using yarn:

```bash
yarn add blocket.js
```

## Usage

### Basic Usage

After installing the package, import the client and start using its methods immediately:

```ts
import client from 'blocket.js';

(async () => {
  try {
    const ads = await client.find({ query: 'macbook air' });
    console.log(ads);
  } catch (error) {
    console.error('Error fetching ads:', error);
  }
})();
```

### Advanced Usage

#### Global Configuration

Customize the package behavior with the global configuration. This allows you to override default values such as the API base URL, token endpoint, log level, and retry attempts.

```ts
import client, { configure } from 'blocket.js';

configure({
  apiBaseUrl: 'https://api.blocket.se/v1', // API base URL (default)
  tokenEndpoint:
    'https://www.blocket.se/api/adout-api-route/refresh-token-and-validate-session', // Token endpoint
  logLevel: 'debug', // Options: 'none', 'error', 'info', 'debug'
  retryAttempts: 3, // Maximum retry attempts on 401 errors
});

(async () => {
  try {
    const ads = await client.find({ query: 'macbook air', limit: 10 });
    console.log(ads);
  } catch (error) {
    console.error('Error fetching ads:', error);
  }
})();
```

#### Per Request Configuration

You can also pass additional fetch options for individual requests to customize headers or other request parameters:

```ts
import client from 'blocket.js';

(async () => {
  try {
    const ads = await client.find(
      { query: 'macbook air', limit: 10 },
      { headers: { 'Custom-Header': 'customValue' } }
    );
    console.log(ads);
  } catch (error) {
    console.error('Error fetching ads:', error);
  }
})();
```

## API Reference

`client.find(query: BlocketQueryParams, fetchOptions?: FetchOptions): Promise<BlocketAd[]>`

Searches for ads on Blocket based on the provided query parameters.

- Parameters:
  - `query`: An object conforming to the `BlocketQueryParams` interface:
    - `query` (string): The search query (e.g., `'macbook air'`).
    - `limit` (number, optional): Maximum number of results to return (default: 60).
    - `sort` (string, optional): Sorting order (default: `'rel'`).
    - `listingType` (string, optional): Listing type; `'s'` for selling, `'b'` for buying (default: `'s'`).
    - `status` (string, optional): Ad status (`'active'` or `'inactive'`, default: `'active'`).
    - `gl` (number, optional): Maximum distance in kilometers.
    - `include` (string, optional): Additional filters or fields to include (e.g., 'image,description').
  - `fetchOptions` (optional): Additional options to pass to the underlying fetch request.
- Returns: A promise that resolves to an array of `BlocketAd` objects.
