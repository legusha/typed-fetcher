# Typed-fetcher

[![npm badge][npm-badge-png]][package-url]

Typed-fetcher is a scalable and flexible package for **typed HTTP requests**.

[npm-badge-png]: https://nodei.co/npm/typed-fetcher.png?downloads=true&stars=true
[package-url]: https://npmjs.org/package/typed-fetcher

### Description
Typed-fetcher is a lightweight, dependency-free TypeScript package for making fully typed HTTP requests.
It enables you to define request and response types, ensuring type safety throughout your API calls.
With built-in error handling that eliminates the need for try/catch, flexible support for custom HTTP providers (like fetch or XMLHttpRequest), and easy integration with both npm and yarn, Typed-fetcher streamlines HTTP communication in modern TypeScript and JavaScript projects.
Its customizable error management and provider system make it suitable for a wide range of use cases, from simple REST APIs to complex, enterprise-grade applications.

### Features
- [x] Typed requests
- [x] Typed responses
- [x] Error handling
- [x] No need try/catch
- [x] No need for JSON.stringify/parse for body
- [x] No dependencies
- [x] Custom fetch providers (if needed)
- [x] Custom error handling (if needed)
- [x] Retry request with convenient configuration
- [x] Retry request with Circuit Breaker and convenient configuration

> Supports the following HTTP methods: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`, `OPTIONS`

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

import { httpClient } from 'typed-fetcher';

const { data, error } = await httpClient.get<SomeInterface>('https://example.com');
```

### CommonJS
```typescript
const { httpClient } = require('typed-fetcher')

const { data, error } = await httpClient.get<SomeInterface>('https://example.com');
```

### HTML script
```html
<script src="https://cdn.jsdelivr.net/npm/typed-fetcher@1.0.11/dist/index.umd.js"></script>
<script>
    const { httpClient } = window.typedFetcher
    
    const { data, error } = await httpClient.get<SomeInterface>('https://example.com');
</script>
})()
```

## Usage

### Response data
Pass an interface to the request, and it will be returned as a response in data property
```typescript
import { httpClient } from 'typed-fetcher';

// For example:
interface SomeInterface {
  id: number;
  name: string;
}

const { data, error } = await httpClient.get<SomeInterface>('https://some-api.com/some-endpoint');
````

If we have **success** response we will get the following structure:
```typescript
{
  data: SomeInterface;
  error: null;
}
````

If we have **error** response we will get the following structure:
```typescript
{
  data: null
  error: HttpErrorBase;
}
````

Error has the following structure:
```typescript
interface HttpErrorBase {
  type: 'JSON' | 'ARRAY_BUFFER';
  status: number;
  message: string;
  details: null | unknown | ArrayBuffer;
}
```

**Origin field** is a reference to the response object, if you are need to get reference on response object you can use `fetchGet, fetchPost` and etc property whose name starts with `fetch`:
```typescript
const { data, error, origin } = await httpClient.fetchGet<SomeInterface>('https://some-api.com/some-endpoint');
````

Apply **[options](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)** for every request; the body and method will ignored because it is not needed.
```typescript
const exampleToken = ''
const options = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${exampleToken}`,
  },
}

// And then this options will be applied for every request
httpClient.applyOptions(options)
```

Unapply **[options](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)** for every request
```typescript
httpClient.unapplyOptions()
```

Rewrite **[options](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)** for concrete request. You can rewrite options for some request, it applies only for this request once. The body will be converted to JSON automatically if **responseAs** setting is **json** and method will be ignored because it is not needed.
```typescript
const optionsForConcreteRequest = {
  credentials: 'omit',
}
const { data, error } = await httpClient
  .get<SomeInterface>('https://some-api.com/some-endpoint', optionsForConcreteRequest);
```

Apply **settings** for every request
```typescript
const settings = {
  responseAs: 'json' | 'text' | 'arrayBuffer',
  baseUrl: 'https://example.com' // it will added to every url
}

// And then this settings will be applied for every request
httpClient.applySettings(options)
```

Unapply **settings** for every request
```typescript
httpClient.unapplySettings()
```

Rewrite **settings** for concrete request. You can rewrite **settings** for some request, it applies only for this request once.
```typescript
const settingsForConcreteRequest = {
  responseAs: 'text',
  baseUrl: 'https://some-api.com'
}
const { data, error } = await httpClient
  .get<SomeInterface>('/some-endpoint', {}, settingsForConcreteRequest);
```

### Timeout and Circuit Breaker

You can configure retry attempts and circuit breaker to handle network instability.

**Retry only:**
```typescript
const settings = {
  responseAs: 'json',
  timeout: {
    retry: {
      errorStatus: [429, 500, 524],
      delays: [600, 3000, 6000, 9000],
      totalWaitTime: 60000,
    }
  }
}

httpClient.applySettings(settings); // or pass to individual request
```

**Retry + Circuit Breaker:**
```typescript
const settings = {
  responseAs: 'json',
  timeout: {
    retry: {
      errorStatus: [429, 500, 524],
      delays: [600, 3000, 6000, 9000],
      totalWaitTime: 60000,
    },
    circuitBreaker: {
      failureThreshold: 3,
      successThreshold: 1,
      timeout: 3000,
    }
  }
}

httpClient.applySettings(settings); // or pass to individual request
```

### Settings Parameters
By default retry requests and circuit breaker are ***disabled***

| Parameter Name | Type | Description |
| :--- | :--- | :--- |
| `responseAs` | `'json' \| 'text' \| 'arrayBuffer'` | Determines how the response body is parsed. Default is `'json'`. |
| `baseUrl` | `string` | Base URL to be prepended to all request URLs. Optional. |
| `timeout` | `object` | Configuration object for retry policies and circuit breaker. Optional. |
| `timeout.retry` | `object` | Retry strategy configuration. Required if `timeout` is defined. |
| `timeout.retry.errorStatus` | `number[]` | List of HTTP status codes that trigger a retry (e.g., `[429, 500, 524]`). |
| `timeout.retry.delays` | `number[]` | Array of delays (in ms) between retry attempts. |
| `timeout.retry.totalWaitTime` | `number` | Maximum amount of time (in ms) to wait for retries before giving up. |
| `timeout.circuitBreaker` | `object` | Circuit breaker configuration to prevent cascading failures. Optional. |
| `timeout.circuitBreaker.failureThreshold` | `number` | Number of failed requests before the circuit opens. |
| `timeout.circuitBreaker.successThreshold` | `number` | Number of successful requests required to close the circuit. |
| `timeout.circuitBreaker.timeout` | `number` | Duration (in ms) to wait in the open state before attempting a reset (half-open). |

### Rewrite fetch provider or error manager
If you want to rewrite implementation with fetch provider you should pass your provider to second argument, all example you can find it below in the documentation
```typescript
import { HttpErrorManager } from 'typed-fetcher';

const errorManager = new HttpErrorManager();
const httpClient = new HttpClient(errorManager, /* pass your custom fetch provider*/);
````

If you want to rewrite implementation with error manager you should pass your provider to first argument, all example you can find it below in the documentation
```typescript
import { FetchProvider } from 'typed-fetcher';

const fetchProvider = new FetchProvider()
const yourErrorManager: HttpErrorManagerBase = {}
const httpClient = new HttpClient(yourErrorManager, fetchProvider);
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

You need to write a custom provider if you want to use `custom implementation of fetch`.

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

You need to write a custom error handler if you want to handle errors in a custom way.
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

