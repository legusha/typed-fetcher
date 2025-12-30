import type {
  RequestOptionsInput,
  HttpClientBase,
  HttpErrorManagerBase,
  HttpFetchProvider,
  HttpResponse,
  HttpResponseFull,
  RequestMethod,
  RequestParams,
  Url,
  StableOptions,
} from './httpClient.types';
import { REQUEST_METHOD } from './httpClient.types';
import { HttpClientNormalizer } from './httpClientNormalizer';
import type { Settings } from '../htttpClientSetting';
import { HttpClientSettings, RESPONSE_AS } from '../htttpClientSetting';
import { FetchProvider } from '../provider';

export class HttpClient implements HttpClientBase {
  private readonly setting = new HttpClientSettings();

  private readonly normalizer = new HttpClientNormalizer();

  public constructor(
    private readonly errorManager: HttpErrorManagerBase,
    private readonly fetchProvider: HttpFetchProvider = new FetchProvider(),
  ) {}

  public async get<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting.get(),
  ): Promise<HttpResponse<Data>> {
    return await this.fetchData<Data>(REQUEST_METHOD.GET, url, options, setting);
  }

  public async post<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting.get(),
  ): Promise<HttpResponse<Data>> {
    return await this.fetchData<Data>(REQUEST_METHOD.POST, url, options, setting);
  }

  public async put<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting.get(),
  ): Promise<HttpResponse<Data>> {
    return await this.fetchData<Data>(REQUEST_METHOD.PUT, url, options, setting);
  }

  public async patch<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting.get(),
  ): Promise<HttpResponse<Data>> {
    return await this.fetchData<Data>(REQUEST_METHOD.PATCH, url, options, setting);
  }

  public async delete<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting.get(),
  ): Promise<HttpResponse<Data>> {
    return await this.fetchData<Data>(REQUEST_METHOD.DELETE, url, options, setting);
  }

  public async head(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting.get(),
  ): Promise<HttpResponse<Headers>> {
    return await this.fetchHeaders(REQUEST_METHOD.HEAD, url, options, setting);
  }

  public async options(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting.get(),
  ): Promise<HttpResponse<Headers>> {
    return await this.fetchHeaders(REQUEST_METHOD.OPTIONS, url, options, setting);
  }

  public async fetchGet<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting.get(),
  ): Promise<HttpResponseFull<Data>> {
    return await this.fetch<Data>(REQUEST_METHOD.GET, url, options, setting);
  }

  public async fetchPost<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting.get(),
  ): Promise<HttpResponseFull<Data>> {
    return await this.fetch<Data>(REQUEST_METHOD.POST, url, options, setting);
  }

  public async fetchPut<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting.get(),
  ): Promise<HttpResponseFull<Data>> {
    return await this.fetch<Data>(REQUEST_METHOD.PUT, url, options, setting);
  }

  public async fetchPatch<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting.get(),
  ): Promise<HttpResponseFull<Data>> {
    return await this.fetch(REQUEST_METHOD.PATCH, url, options, setting);
  }

  public async fetchDelete<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting.get(),
  ): Promise<HttpResponseFull<Data>> {
    return await this.fetch<Data>(REQUEST_METHOD.DELETE, url, options, setting);
  }

  public fetchHead(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting.get(),
  ): Promise<HttpResponseFull<null>> {
    return this.fetch<null>(REQUEST_METHOD.HEAD, url, options, setting);
  }

  public fetchOptions(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting.get(),
  ): Promise<HttpResponseFull<null>> {
    return this.fetch<null>(REQUEST_METHOD.OPTIONS, url, options, setting);
  }

  public applyOptions(options: StableOptions): void {
    this.normalizer.setOptions(options);
  }

  public unapplyOptions(): void {
    this.normalizer.setOptions({});
  }

  public applySettings(settings: Settings): void {
    this.setting.set(settings);
  }

  public unapplySettings(): void {
    this.setting.set(HttpClientSettings.getDefault());
  }

  private async fetch<Data>(
    method: RequestMethod,
    url: Url,
    optionsInput?: RequestOptionsInput,
    settingInput = this.setting.get(),
  ): Promise<HttpResponseFull<Data>> {
    const requestSetting = this.setting.merge(settingInput);
    const options = optionsInput ?? {};

    const requestOptions = this.normalizer.normalizeOptions(options, requestSetting);

    try {
      const requestParams: RequestParams = {
        url: this.setting.makeUrl(url),
        method,
        options: requestOptions,
      };

      const response = await this.fetchProvider.fetch(requestParams);

      if (response.ok) {
        return await this.normalizer.normalizeResponse<Data>(response, requestSetting);
      }

      const dataAsText = await response.text();

      this.errorManager.throw(response, dataAsText);
    } catch (e) {
      return this.errorManager.parse<Data>(e);
    }
  }

  private async fetchData<Data>(
    method: RequestMethod,
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting.get(),
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
    setting = this.setting.get(),
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
