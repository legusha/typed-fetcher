import type {
  RequestOptionsInput,
  HttpErrorManagerBase,
  HttpFetchProvider,
  HttpResponse,
  HttpResponseFull,
  RequestMethod,
  RequestParams,
  Url,
  StableOptions,
  HttpClientBase,
} from './httpClient.types';
import { REQUEST_METHOD } from './httpClient.types';
import { HttpClientNormalizer } from './httpClientNormalizer';

import { HttpClientRetry } from '../httpClientRetry';
import type { BaseSettings, Settings } from '../htttpClientSetting';
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
    inputSetting: BaseSettings = this.setting.get(),
  ): Promise<HttpResponse<Data>> {
    const settings = this.setting.generateCatchErrorOn(inputSetting);

    return await this.fetchData<Data>(REQUEST_METHOD.GET, url, settings, options);
  }

  public async post<Data>(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings = this.setting.get(),
  ): Promise<HttpResponse<Data>> {
    const settings = this.setting.generateCatchErrorOn(inputSettings);

    return await this.fetchData<Data>(REQUEST_METHOD.POST, url, settings, options);
  }

  public async put<Data>(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings = this.setting.get(),
  ): Promise<HttpResponse<Data>> {
    const settings = this.setting.generateCatchErrorOn(inputSettings);

    return await this.fetchData<Data>(REQUEST_METHOD.PUT, url, settings, options);
  }

  public async patch<Data>(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings = this.setting.get(),
  ): Promise<HttpResponse<Data>> {
    const settings = this.setting.generateCatchErrorOn(inputSettings);

    return await this.fetchData<Data>(REQUEST_METHOD.PATCH, url, settings, options);
  }

  public async delete<Data>(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings = this.setting.get(),
  ): Promise<HttpResponse<Data>> {
    const settings = this.setting.generateCatchErrorOn(inputSettings);

    return await this.fetchData<Data>(REQUEST_METHOD.DELETE, url, settings, options);
  }

  public async head(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings = this.setting.get(),
  ): Promise<HttpResponse<Headers>> {
    const settings = this.setting.generateCatchErrorOn(inputSettings);

    return await this.fetchHeaders(REQUEST_METHOD.HEAD, url, settings, options);
  }

  public async options(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings = this.setting.get(),
  ): Promise<HttpResponse<Headers>> {
    const settings = this.setting.generateCatchErrorOn(inputSettings);

    return await this.fetchHeaders(REQUEST_METHOD.OPTIONS, url, settings, options);
  }

  public async getUnsafe<Data>(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings: BaseSettings = this.setting.get(),
  ): Promise<Data> {
    const settings = this.setting.generateCatchErrorOff(inputSettings);

    const { data } = await this.fetchData<Data>(REQUEST_METHOD.GET, url, settings, options);

    return data!;
  }

  public async postUnsafe<Data>(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings: BaseSettings = this.setting.get(),
  ): Promise<Data> {
    const settings = this.setting.generateCatchErrorOff(inputSettings);

    const { data } = await this.fetchData<Data>(REQUEST_METHOD.POST, url, settings, options);

    return data!;
  }

  public async putUnsafe<Data>(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings: BaseSettings = this.setting.get(),
  ): Promise<Data> {
    const settings = this.setting.generateCatchErrorOff(inputSettings);

    const { data } = await this.fetchData<Data>(REQUEST_METHOD.PUT, url, settings, options);

    return data!;
  }

  public async patchUnsafe<Data>(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings: BaseSettings = this.setting.get(),
  ): Promise<Data> {
    const settings = this.setting.generateCatchErrorOff(inputSettings);

    const { data } = await this.fetchData<Data>(REQUEST_METHOD.PATCH, url, settings, options);

    return data!;
  }

  public async deleteUnsafe<Data>(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings: BaseSettings = this.setting.get(),
  ): Promise<Data> {
    const settings = this.setting.generateCatchErrorOff(inputSettings);

    const { data } = await this.fetchData<Data>(REQUEST_METHOD.DELETE, url, settings, options);

    return data!;
  }

  public async headUnsafe(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings: BaseSettings = this.setting.get(),
  ): Promise<Headers> {
    const settings = this.setting.generateCatchErrorOff(inputSettings);

    const { data } = await this.fetchHeaders(REQUEST_METHOD.HEAD, url, settings, options);

    return data!;
  }

  public async optionsUnsafe(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings: BaseSettings = this.setting.get(),
  ): Promise<Headers> {
    const settings = this.setting.generateCatchErrorOff(inputSettings);

    const { data } = await this.fetchHeaders(REQUEST_METHOD.OPTIONS, url, settings, options);

    return data!;
  }

  public async fetchGet<Data>(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings = this.setting.get(),
  ): Promise<HttpResponseFull<Data>> {
    const settings = this.setting.generateCatchErrorOn(inputSettings);

    return await this.maybeFetchWithRetry<Data>(REQUEST_METHOD.GET, url, settings, options);
  }

  public async fetchPost<Data>(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings = this.setting.get(),
  ): Promise<HttpResponseFull<Data>> {
    const settings = this.setting.generateCatchErrorOn(inputSettings);

    return await this.maybeFetchWithRetry<Data>(REQUEST_METHOD.POST, url, settings, options);
  }

  public async fetchPut<Data>(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings = this.setting.get(),
  ): Promise<HttpResponseFull<Data>> {
    const settings = this.setting.generateCatchErrorOn(inputSettings);

    return await this.maybeFetchWithRetry<Data>(REQUEST_METHOD.PUT, url, settings, options);
  }

  public async fetchPatch<Data>(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings = this.setting.get(),
  ): Promise<HttpResponseFull<Data>> {
    const settings = this.setting.generateCatchErrorOn(inputSettings);

    return await this.maybeFetchWithRetry(REQUEST_METHOD.PATCH, url, settings, options);
  }

  public async fetchDelete<Data>(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings = this.setting.get(),
  ): Promise<HttpResponseFull<Data>> {
    const settings = this.setting.generateCatchErrorOn(inputSettings);

    return await this.maybeFetchWithRetry<Data>(REQUEST_METHOD.DELETE, url, settings, options);
  }

  public async fetchHead(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings = this.setting.get(),
  ): Promise<HttpResponseFull<null>> {
    const settings = this.setting.generateCatchErrorOn(inputSettings);

    return this.maybeFetchWithRetry<null>(REQUEST_METHOD.HEAD, url, settings, options);
  }

  public async fetchOptions(
    url: Url,
    options?: RequestOptionsInput,
    inputSettings = this.setting.get(),
  ): Promise<HttpResponseFull<null>> {
    const settings = this.setting.generateCatchErrorOn(inputSettings);

    return this.maybeFetchWithRetry<null>(REQUEST_METHOD.OPTIONS, url, settings, options);
  }

  public applyOptions(options: StableOptions): void {
    this.normalizer.setOptions(options);
  }

  public unapplyOptions(): void {
    this.normalizer.setOptions({});
  }

  public applySettings(settings: BaseSettings): void {
    this.setting.set(settings);
  }

  public unapplySettings(): void {
    this.setting.set(HttpClientSettings.getDefault());
  }

  private maybeFetchWithRetry<Data>(
    method: RequestMethod,
    url: Url,
    settingInput: Settings,
    optionsInput?: RequestOptionsInput,
  ): Promise<HttpResponseFull<Data>> {
    const requestSetting = this.setting.merge(settingInput);

    if (!requestSetting.timeout) {
      return this.fetch(method, url, settingInput, optionsInput);
    }

    const retry = new HttpClientRetry(requestSetting.timeout);
    return retry.fetch<Data>(this.fetch.bind(this), method, url, settingInput, optionsInput);
  }

  private async fetch<Data>(
    method: RequestMethod,
    url: Url,
    settingInput: Settings,
    optionsInput?: RequestOptionsInput,
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
      return this.errorManager.parse<Data>(e, requestSetting);
    }
  }

  private async fetchData<Data>(
    method: RequestMethod,
    url: Url,
    setting: Settings,
    options?: RequestOptionsInput,
  ): Promise<HttpResponse<Data>> {
    const payload = await this.maybeFetchWithRetry<Data>(method, url, setting, options);

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
    setting: Settings,
    options?: RequestOptionsInput,
  ): Promise<HttpResponse<Headers>> {
    const optionsWithNoBody = { ...options, body: undefined };
    const settingResponseAsText = { ...setting, responseAs: RESPONSE_AS.text };
    const { error, original } = await this.maybeFetchWithRetry<Headers>(
      method,
      url,
      settingResponseAsText,
      optionsWithNoBody,
    );

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
