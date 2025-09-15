import type { RequestOptionsInput, HttpClientSettings, HttpResponseFull, RequestOptions } from './HttpClient.types';
import { RESPONSE_AS } from './HttpClient.types';

export class HttpClientPreparer {
  public getRequestOptions(options: RequestOptionsInput, setting: HttpClientSettings): RequestOptions {
    const requestOptions: RequestOptions = {
      ...options,
      body: this.getRequestBody(options.body),
    };

    if (setting.responseAs === RESPONSE_AS.json) {
      requestOptions.headers = { 'Content-Type': 'application/json', ...requestOptions.headers };
    }

    return {
      ...requestOptions,
      headers: requestOptions.headers ?? {},
    };
  }

  public async getResponse<Data>(response: Response, setting: HttpClientSettings): Promise<HttpResponseFull<Data>> {
    return {
      original: response,
      data: await response[setting.responseAs](),
      error: null,
    };
  }

  private getRequestBody(body: RequestOptionsInput['body']): RequestOptions['body'] {
    if (body && body instanceof ArrayBuffer) {
      return body;
    }

    if (body && body instanceof Blob) {
      return body;
    }

    if (body && body instanceof ReadableStream) {
      return body;
    }

    if (body && body instanceof URLSearchParams) {
      return body;
    }

    if (body && typeof body === 'string') {
      return body;
    }

    if (body && body instanceof FormData) {
      return body.toString();
    }

    if (body) {
      return JSON.stringify(body);
    }

    return undefined;
  }
}
