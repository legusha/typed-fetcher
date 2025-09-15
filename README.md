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

> HttpClient supports the following HTTP methods:
- [x] GET
- [x] POST
- [x] PUT
- [x] DELETE
- [x] PATCH
- [x] HEAD
- [x] OPTIONS

## Installation

#### npm
```shell
  npm i typed-fetcher
```

#### yarn
```shell
  yarn add typed-fetcher
```

### ES Modules

```typescript
import { HttpClient, HttpErrorManager } from 'typed-fetcher';

const errorManager = new HttpErrorManager();
const httpClient = new HttpClient(errorManager);
```

### CommonJS
```typescript
const { HttpClient, HttpErrorManager } = require('typed-fetcher')

const errorManager = new HttpErrorManager();
const httpClient = new HttpClient(errorManager);
```

### HTML script
```html
<script src="https://cdn.jsdelivr.net/npm/typed-fetcher@1.0.4/dist/index.umd.js"></script>
<script>
    const { HttpClient, HttpErrorManager } = window.typedFetcher
    const errorManager = new HttpErrorManager();
    const httpClient = new HttpClient(errorManager);
</script>
})()
```

## Usage

### Response data
```typescript
import { HttpClient, HttpErrorManager } from 'typed-fetcher';

const errorManager = new HttpErrorManager();
const httpClient = new HttpClient(errorManager);

// Pass the some interface to the request and it will be returned as a response
interface SomeInterface {
  id: number;
  name: string;
}

const { data, error } = await httpClient.get<SomeInterface>('https://some-api.com/some-endpoint');
````

**If we have success response we will get the following structure:**
```typescript
{
  data: SomeInterface;
  error: null;
}
````

**If we have error response we will get the following structure:**
```typescript
{
  data: null
  error: HttpErrorBase;
}
````

**Error has the following structure:**
```typescript
interface HttpErrorBase {
  type: 'JSON' | 'ARRAY_BUFFER';
  status: number;
  message: string;
  details: null | unknown | ArrayBuffer;
}
```

**If you are need to get reference on response object you can use `fetchGet, fetchPost` and etc property whose name starts with `fetch`:**
```typescript
const { data, error, origin } = await httpClient.fetchGet<SomeInterface>('https://some-api.com/some-endpoint');

// origin is a reference on response object
````

### Example request

**GET request:**

```typescript
interface User {
  name: string
  id: number
}

void (async (): Promise<void> => {
  const { data, error } = await httpClient.get<User>(`/posts`)

  if (error) {
    // do something with error
    return
  }
  console.log(data)
})()
````

**POST request:**

```typescript
void (async (): Promise<void> => {
  const user: User = {
    name: 'Example name',
    id: 1,
  }
  const { data, error } = await httpClient.post<User>(`/posts`, { body: user })

  if (error) {
    // do something with error
    return
  }
  console.log(data)
})()
````

**PUT request:**

```typescript
void (async (): Promise<void> => {
  const user: User = {
    name: 'Example name',
    id: 1,
  }
  const { data, error } = await httpClient.put<User>(`/posts`, { body: user })

  if (error) {
    // do something with error
    return
  }
  console.log(data)
})()
````

**DELETE request:**

```typescript
void (async (): Promise<void> => {
  const userId = 1
  const { data, error } = await httpClient.delete<User>(`/posts/${userId}`)

  if (error) {
    // do something with error
    return
  }
  console.log(data)
})()
````

**Auth or headers:**

```typescript
void (async (): Promise<void> => {
  const exampleToken = ''
  const requestOptions = {
    credentials: 'include', // if you use cookies auth
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${exampleToken}`,
    },
  }
  const {data, error} = await httpClient.get<User>(`/posts/${userId}`, requestOptions)

  if (error) {
    // do something with error
    return
  }
  console.log(data)
})()
````

### XMLHttpRequest provider

You can use any implementation to perform requests — for example:
- `fetch` (default)
- `XMLHttpRequest`
- `Custom implementation of fetch (sometimes this happens)`

```typescript
import { HttpClient, HttpErrorManager, XmlHttpProvider } from 'typed-fetcher'

const httpErrorManager = new HttpErrorManager()
const xmlHttpProvider = new XmlHttpProvider()
const httpClient = new HttpClient(httpErrorManager, xmlHttpProvider)
```


### Custom provider

**You need to write a custom provider if you want to use `custom implementation of fetch`.**

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

const customProvider = new CustomProvider();
const httpErrorManager = new HttpErrorManager();

const fetch = new HttpClient(httpErrorManager, customProvider);
```

### Custom error handling

**You need to write a custom error handler if you want to handle errors in a custom way.**
```typescript
// interface HttpErrorManagerBase {
//    throw: (response: Response, dataText: string) => never;
//    parse: <Data>(errorData: unknown) => HttpResponseFull<Data>;
// }

import { HttpErrorManagerBase, HttpErrorJSON } from 'typed-fetcher';

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
      const message: string = 'Your custom message'
      const status: number = 500;
      const details: unknown | null = null;
      
      return {
        data: null,
        error: new HttpErrorJSON(message, status, details) // or you can extend from class HttpErrorBase and write your own error
      }
    }
  }
}
const errorHandler = new ErrorHandler();
const httpErrorManager = new HttpErrorManager(errorHandler);

