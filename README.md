# blocket.js

A lightweight TypeScript/JavaScript client for searching ads on [Blocket.se](https://blocket.se) - Sweden's largest marketplace.

[![npm version](https://img.shields.io/npm/v/blocket.js)](https://www.npmjs.com/package/blocket.js)
[![npm downloads](https://img.shields.io/npm/dm/blocket.js)](https://www.npmjs.com/package/blocket.js)
[![build status](https://img.shields.io/github/actions/workflow/status/rutbergphilip/blocket.js/publish.yml)](https://github.com/rutbergphilip/blocket.js/actions)
[![license](https://img.shields.io/npm/l/blocket.js)](https://github.com/rutbergphilip/blocket.js/blob/main/LICENSE)

## Features

- **Simple API** - Just import and search, no setup required
- **Automatic Pagination** - Fetches all results across multiple pages automatically
- **TypeScript Support** - Fully typed interfaces for all responses
- **Zero Configuration** - Works out of the box with sensible defaults
- **Lightweight** - Minimal dependencies

## Installation

```bash
npm install blocket.js
```

```bash
yarn add blocket.js
```

```bash
pnpm add blocket.js
```

## Quick Start

```typescript
import client from 'blocket.js';

// Search for items
const ads = await client.find({ query: 'iPhone 15' });

console.log(`Found ${ads.length} ads`);
ads.forEach(ad => {
  console.log(`${ad.heading} - ${ad.price.amount} ${ad.price.currency_code}`);
});
```

## API Reference

### `client.find(query, options?)`

Search for ads on Blocket. Automatically handles pagination to return all matching results.

```typescript
const ads = await client.find({
  query: 'macbook pro',      // Required: search term
  limit: 50,                  // Results per page (default: 20, max: 60)
  sort: 'price_asc',          // Sort order
  listingType: 's',           // 's' = selling, 'b' = buying, 'a' = all
  status: 'active',           // 'active', 'deleted', 'hidden_by_user', 'all'
});
```

#### Query Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `query` | `string` | *required* | Search term |
| `limit` | `number` | `20` | Results per page (max 60) |
| `sort` | `string` | `'rel'` | `'rel'`, `'date'`, `'price_asc'`, `'price_desc'` |
| `listingType` | `string` | `'s'` | `'s'` (selling), `'b'` (buying), `'a'` (all) |
| `status` | `string` | `'active'` | `'active'`, `'deleted'`, `'hidden_by_user'`, `'all'` |
| `geolocation` | `number` | - | Max distance in km |
| `include` | `string` | - | Additional fields (e.g., `'extend_with_shipping'`) |

#### Returns

Returns `Promise<BlocketAd[]>` - an array of ad objects.

---

### `client.findById(id)`

Find a specific ad by its ID.

```typescript
const ad = await client.findById('12345678');

if (ad) {
  console.log(ad.heading);
  console.log(ad.price.amount);
}
```

#### Returns

Returns `Promise<BlocketAd | null>` - the ad object or `null` if not found.

---

## Response Types

### `BlocketAd`

Each ad object contains:

```typescript
interface BlocketAd {
  id: string;                    // Ad ID (string)
  ad_id: number;                 // Ad ID (number)
  heading: string;               // Ad title
  location: string;              // Location name
  canonical_url: string;         // Full URL to the ad

  price: {
    amount: number;              // Price value
    currency_code: string;       // e.g., 'SEK'
    price_unit: string;          // e.g., 'kr'
  };

  image: {                       // Primary image (or null)
    url: string;
    width: number;
    height: number;
  } | null;

  image_urls: string[];          // All image URLs
  timestamp: number;             // Unix timestamp
  trade_type: string;            // e.g., 'Säljes'

  coordinates?: {                // Location coordinates (if available)
    lat: number;
    lon: number;
  };

  labels: Array<{                // Ad labels/badges
    id: string;
    text: string;
    type: 'PRIMARY' | 'SECONDARY';
  }>;

  flags: string[];               // e.g., ['private', 'shipping_exists']
}
```

## Configuration

Customize the client behavior using `configure()`:

```typescript
import client, { configure } from 'blocket.js';

configure({
  logLevel: 'debug',  // 'none' | 'error' | 'info' | 'debug'
});
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `logLevel` | `string` | `'error'` | Logging verbosity |
| `apiBaseUrl` | `string` | Blocket API | Override API endpoint |

## Examples

### Search with Sorting

```typescript
// Get cheapest items first
const cheapest = await client.find({
  query: 'playstation 5',
  sort: 'price_asc',
});

// Get newest listings first
const newest = await client.find({
  query: 'playstation 5',
  sort: 'date',
});
```

### Filter by Location

```typescript
// Find items within 50km
const nearby = await client.find({
  query: 'bicycle',
  geolocation: 50,
});
```

### Process Results

```typescript
const ads = await client.find({ query: 'furniture' });

// Filter by price
const affordable = ads.filter(ad => ad.price.amount < 5000);

// Get total value
const totalValue = ads.reduce((sum, ad) => sum + ad.price.amount, 0);

// Extract locations
const locations = [...new Set(ads.map(ad => ad.location))];
```

### Error Handling

```typescript
import client from 'blocket.js';

try {
  const ads = await client.find({ query: 'laptop' });
  console.log(`Found ${ads.length} ads`);
} catch (error) {
  console.error('Search failed:', error.message);
}
```

## Disclaimer

This is an **unofficial** package and is not affiliated with Blocket.se. Use responsibly and in accordance with Blocket's terms of service.

## License

[MIT](https://github.com/rutbergphilip/blocket.js/blob/main/LICENSE) - free for personal and commercial use.

---

**Found this useful?** Give it a ⭐ on [GitHub](https://github.com/rutbergphilip/blocket.js)!
