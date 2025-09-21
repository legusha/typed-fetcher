import type { RequestOptionsInput, HttpResponseFull, RequestOptions, StableOptions } from './HttpClient.types';
import type { Settings } from '../htttp-client-setting';
import { RESPONSE_AS } from '../htttp-client-setting';

export class HttpClientNormalizer {
  private options: StableOptions = {};

  public setOptions(options: StableOptions): void {
    this.options = options;
  }

  public normalizeOptions(options: RequestOptionsInput, setting: Settings): RequestOptions {
    const requestOptions: RequestOptions = {
      ...this.options,
      ...options,
      body: this.normalizeBody(options.body),
    };

    if (setting.responseAs === RESPONSE_AS.json) {
      requestOptions.headers = { 'Content-Type': 'application/json', ...requestOptions.headers };
    }

    return {
      ...requestOptions,
      headers: requestOptions.headers ?? {},
    };
  }

  public async normalizeResponse<Data>(response: Response, setting: Settings): Promise<HttpResponseFull<Data>> {
    return {
      original: response,
      data: await response[setting.responseAs](),
      error: null,
    };
  }

  private normalizeBody(body: RequestOptionsInput['body']): RequestOptions['body'] {
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
