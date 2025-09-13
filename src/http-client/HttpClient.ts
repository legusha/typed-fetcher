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
  Url
} from './HttpClient.types';
import { RESPONSE_AS } from './HttpClient.types';
import { HttpClientPreparer } from './HttpClientPreparer';
import {FetchProvider} from "../fetchProvider/fetchProvider";

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
    return await this.fetchWithShortResponse<Data>('GET', url, options, setting);
  }

  public async post<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting
  ): Promise<HttpResponse<Data>> {
    return await this.fetchWithShortResponse<Data>('POST', url, options, setting);
  }

  public async put<Data>(url: Url, options?: RequestOptionsInput, setting = this.setting): Promise<HttpResponse<Data>> {
    return await this.fetchWithShortResponse<Data>('PUT', url, options, setting);
  }

  public async delete<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting
  ): Promise<HttpResponse<Data>> {
    return await this.fetchWithShortResponse<Data>('DELETE', url, options, setting);
  }

  public async fetchGet<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting
  ): Promise<HttpResponseFull<Data>> {
    return await this.fetch<Data>('GET', url, options, setting);
  }

  public async fetchPost<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting
  ): Promise<HttpResponseFull<Data>> {
    return await this.fetch<Data>('POST', url, options, setting);
  }

  public async fetchPut<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting
  ): Promise<HttpResponseFull<Data>> {
    return await this.fetch<Data>('PUT', url, options, setting);
  }

  public async fetchDelete<Data>(
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting
  ): Promise<HttpResponseFull<Data>> {
    return await this.fetch<Data>('DELETE', url, options, setting);
  }

  private async fetch<Data>(
    method: RequestMethod,
    url: Url,
    optionsInput?: RequestOptionsInput,
    settingInput = this.setting
  ): Promise<HttpResponseFull<Data>> {
    const requestSetting = { ...this.setting, ...settingInput };
    const options = optionsInput ?? {};

    const requestOptions = this.prepare.getRequestOptions(options, requestSetting);

    try {
      const requestParams: RequestParams = {
        url,
        method,
        options: requestOptions
      };

      const data = await this.fetchProvider.fetch(requestParams);

      if (data.ok) {
        return await this.prepare.getResponse<Data>(data, requestSetting);
      }

      const dataAsText = await data.text();

      this.errorManager.throw(data, dataAsText);
    } catch (e) {
      return this.errorManager.parse<Data>(e);
    }
  }

  private async fetchWithShortResponse<Data>(
    method: RequestMethod,
    url: Url,
    options?: RequestOptionsInput,
    setting = this.setting
  ): Promise<HttpResponse<Data>> {
    const payload = await this.fetch<Data>(method, url, options, setting);

    if (payload.error) {
      return {
        data: null,
        error: payload.error
      };
    }

    return {
      data: payload.data,
      error: null
    };
  }
}
