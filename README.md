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

### ES Modules

```typescript
import { HttpClient, HttpErrorManager } from 'typed-fetcher';

const errorManager = new HttpErrorManager();
const httpClient = new HttpClient(errorManager);

interface SomeData {
  id: number;
  name: string;
}

(async (): Promise<void> => {
  const { data, error } = await httpClient.get<SomeData>('https://example.com');

  if (error) {
    console.error(error);
    // do something with error
    return;
  }

  console.log(data);
})()
```

### CommonJS
```typescript
const { HttpClient, HttpErrorManager } = require('typed-fetcher')

const errorManager = new HttpErrorManager();
const httpClient = new HttpClient(errorManager);
```

### HTML script
```html
<script src="https://cdn.jsdelivr.net/npm/typed-fetcher@1.0.2/dist/index.umd.js"></script>
<script>
    const { HttpClient, HttpErrorManager } = window.typedFetcher
    const errorManager = new HttpErrorManager();
    const httpClient = new HttpClient(errorManager);
</script>
})()
```

You can use any implementation to perform requests — for example:
- `fetch` (default)
- `XMLHttpRequest`

### XMLHttpRequest provider
```typescript
import { HttpClient, HttpErrorManager, XmlHttpProvider } from 'typed-fetcher'

const httpErrorManager = new HttpErrorManager()
const xmlHttpProvider = new XmlHttpProvider()
const fetch = new HttpClient(httpErrorManager, xmlHttpProvider)
```


### Custom provider

> You need to write a custom provider if you want to use `Custom implementation of fetch`. 
```typescript
// interface HttpFetchProvider {
//   fetch: (params: RequestParams) => Promise<Response>;
// }

import { HttpFetchProvider, HttpErrorManager } from 'typed-fetcher';

class CustomProvider implements HttpFetchProvider {
  public fetch(params: RequestParams): Promise<Response> {
    // write your own implementation
  }
}

const customProvider = new XmlHttpProvider();
const httpErrorManager = new HttpErrorManager();

const fetch = new HttpClient(httpErrorManager, customProvider);
```

### Custom error handling

> You need to write a custom error handler if you want to handle errors in a custom way.
```typescript
// interface HttpErrorManagerBase {
//    throw: (response: Response, dataText: string) => never;
//    parse: <Data>(errorData: unknown) => HttpResponseFull<Data>;
// }

import { HttpErrorManagerBase, HttpErrorJSON, HTTP_ERROR_CODE } from 'typed-fetcher';

class ErrorHandler extends HttpErrorManagerBase {
  private readonly errorMessage = 'Custom error message';
  
  public throw(response: Response, dataText: string): never {
    // You need to throw an error in this method
    
    // For example:
    throw new Error(this.errorMessage);
  }
  
  parse<Data>(errorData: unknown): HttpResponseFull<Data> {
    // And this mehod you need a parse error which you throw in the throw method
    // You need to return an error in this method
    
    // For example:
    
    if (errodData instanceof Error && errorData.message === this.errorMessage) {
      const code = HTTP_ERROR_CODE.INTERNAL_SERVER_ERROR;
      const message: string = 'Your custom message'
      const status: number = 500;
      const details: unknown | null = null;
      
      return {
        data: null,
        error: new HttpErrorJSON(code, message, status, details) // or you can extend from class HttpErrorBase and write your own error
      }
    }
  }
}
const errorHandler = new ErrorHandler();
const httpErrorManager = new HttpErrorManager(errorHandler);

