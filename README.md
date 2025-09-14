# Typed-fetcher

This npm package provides **typed HTTP requests**.

### Description
This is an npm package that provides typed HTTP requests. You can use any implementation to perform HTTP requests, for example, fetch (default) or XMLHttpRequest (but for this, you will need to write your own provider).

### Features
- [x] Typed requests
- [x] Typed responses
- [x] Error handling
- [x] No need try/catch
- [x] No dependencies
- [x] Custom fetch providers (if need)
- [x] Custom error handling (if need)

This is a basic implementation, and over time this package will be improved.

## Installation

#### npm
```shell
  npm i typed-fetcher
```

#### yarn
```shell
  yarn add typed-fetcher
```

## Usage
```typescript
import { HttpClient } from 'typed-fetcher';

const fetch = new HttpClient();

interface SomeData {
  id: number;
  name: string;
}

(async (): Promise<void> => {
  const { data, error } = await fetch.get<SomeData>('https://example.com');

  if (error) {
    console.error(error);
    // do something with error
    return;
  }

  console.log(data);
})()
```


You can use any implementation to perform requests — for example:
- `fetch` (default)
- `XMLHttpRequest` (requires writing a custom provider)

> You need to write a custom provider if you want to use `XMLHttpRequest`. 
```typescript
// interface HttpFetchProvider {
//   fetch: (params: RequestParams) => Promise<Response>;
// }

import { HttpFetchProvider, HttpErrorManager } from 'typed-fetcher';

class XmlHttpProvider implements HttpFetchProvider {
  public fetch(params: RequestParams): Promise<Response> {
    // write your own implementation
  }
}
const xmlHttpProvider = new XmlHttpProvider();
const httpErrorManager = new HttpErrorManager();

const fetch = new HttpClient(httpErrorManager, xmlHttpProvider);
```

