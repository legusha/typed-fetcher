import type {
  RequestOptionsInput,
  HttpClientBase,
  HttpErrorManagerBase,
  HttpClientSettings,
  HttpFetchProvider,
  HttpResponse,
  HttpResponseFull,
  RequestMethod,
  RequestParams,
  Url,
} from './HttpClient.types';
import { REQUEST_METHOD, RESPONSE_AS } from './HttpClient.types';
import { HttpClientPreparer } from './HttpClientPreparer';
import { FetchProvider } from '../provider';

export class HttpClient implements HttpClientBase {
  private readonly setting: HttpClientSettings = {
    responseAs: RESPONSE_AS.json,
  };

  private readonly prepare = new HttpClientPreparer();

  public constructor(
    private readonly errorManager: HttpErrorManagerBase,
    private readonly fetchProvider: HttpFetchProvider = new FetchProvider(),
  ) {}

  public async get<Data>(url: Url, options?: RequestOptionsInput, setting = this.setting): Promise<HttpResponse<Data>> {
    return await this.fetchWithShortResponse<Data>(REQUEST_METHOD.GET, url, options, setting);
  }

  public async post<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting,
  ): Promise<HttpResponse<Data>> {
    return await this.fetchWithShortResponse<Data>(REQUEST_METHOD.POST, url, options, setting);
  }

  public async put<Data>(url: Url, options?: RequestOptionsInput, setting = this.setting): Promise<HttpResponse<Data>> {
    return await this.fetchWithShortResponse<Data>(REQUEST_METHOD.PUT, url, options, setting);
  }

  public async patch<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting,
  ): Promise<HttpResponse<Data>> {
    return await this.fetchWithShortResponse<Data>(REQUEST_METHOD.PATCH, url, options, setting);
  }

  public async delete<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting,
  ): Promise<HttpResponse<Data>> {
    return await this.fetchWithShortResponse<Data>(REQUEST_METHOD.DELETE, url, options, setting);
  }

  public async head(url: Url, options?: RequestOptionsInput, setting = this.setting): Promise<HttpResponse<Headers>> {
    return await this.fetchHeaders(REQUEST_METHOD.HEAD, url, options, setting);
  }

  public async options(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting,
  ): Promise<HttpResponse<Headers>> {
    return await this.fetchHeaders(REQUEST_METHOD.OPTIONS, url, options, setting);
  }

  public async fetchGet<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting,
  ): Promise<HttpResponseFull<Data>> {
    return await this.fetch<Data>(REQUEST_METHOD.GET, url, options, setting);
  }

  public async fetchPost<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting,
  ): Promise<HttpResponseFull<Data>> {
    return await this.fetch<Data>(REQUEST_METHOD.POST, url, options, setting);
  }

  public async fetchPut<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting,
  ): Promise<HttpResponseFull<Data>> {
    return await this.fetch<Data>(REQUEST_METHOD.PUT, url, options, setting);
  }

  public async fetchPatch<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting,
  ): Promise<HttpResponseFull<Data>> {
    return await this.fetch(REQUEST_METHOD.PATCH, url, options, setting);
  }

  public async fetchDelete<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting,
  ): Promise<HttpResponseFull<Data>> {
    return await this.fetch<Data>(REQUEST_METHOD.DELETE, url, options, setting);
  }

  public fetchHead(url: Url, options?: RequestOptionsInput, setting = this.setting): Promise<HttpResponseFull<null>> {
    return this.fetch<null>(REQUEST_METHOD.HEAD, url, options, setting);
  }

  public fetchOptions(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting,
  ): Promise<HttpResponseFull<null>> {
    return this.fetch<null>(REQUEST_METHOD.OPTIONS, url, options, setting);
  }

  private async fetch<Data>(
    method: RequestMethod,
    url: Url,
    optionsInput?: RequestOptionsInput,
    settingInput = this.setting,
  ): Promise<HttpResponseFull<Data>> {
    const requestSetting = { ...this.setting, ...settingInput };
    const options = optionsInput ?? {};

    const requestOptions = this.prepare.getRequestOptions(options, requestSetting);

    try {
      const requestParams: RequestParams = {
        url,
        method,
        options: requestOptions,
      };

      const response = await this.fetchProvider.fetch(requestParams);

      if (response.ok) {
        return await this.prepare.getResponse<Data>(response, requestSetting);
      }

      const dataAsText = await response.text();

      this.errorManager.throw(response, dataAsText);
    } catch (e) {
      return this.errorManager.parse<Data>(e);
    }
  }

  private async fetchWithShortResponse<Data>(
    method: RequestMethod,
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting,
  ): Promise<HttpResponse<Data>> {
    const payload = await this.fetch<Data>(method, url, options, setting);

    if (payload.error) {
      return {
        data: null,
        error: payload.error,
      };
    }

    return {
      data: payload.data,
      error: null,
    };
  }

  private async fetchHeaders(
    method: typeof REQUEST_METHOD.HEAD | typeof REQUEST_METHOD.OPTIONS,
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting,
  ): Promise<HttpResponse<Headers>> {
    const optionsWithNoBody = { ...options, body: undefined };
    const settingResponseAsText = { ...setting, responseAs: RESPONSE_AS.text };
    const { error, original } = await this.fetch<Headers>(method, url, optionsWithNoBody, settingResponseAsText);

    if (error) {
      return {
        data: null,
        error: error,
      };
    }
    const headers = original?.headers || null;

    return {
      data: headers,
      error: null,
    };
  }
}
