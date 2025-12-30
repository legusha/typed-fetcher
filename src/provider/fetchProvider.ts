import type { HttpFetchProvider, RequestParams } from '../httpClient/index';

export class FetchProvider implements HttpFetchProvider {
  public fetch(params: RequestParams): Promise<Response> {
    return globalThis.fetch(params.url, {
      method: params.method,
      ...params.options,
    });
  }
}
