import type { HttpError } from '../error/errorBase';
import type { BaseSettings, Settings } from '../htttpClientSetting';

export const REQUEST_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
  PATCH: 'PATCH',
} as const;

export type RequestMethod = (typeof REQUEST_METHOD)[keyof typeof REQUEST_METHOD];

export interface RequestParams {
  url: string;
  method: string;
  options: RequestOptions;
}

interface HttpResponseError {
  data: null;
  error: HttpError;
}

export interface HttpResponseSuccess<Data> {
  data: Data;
  error: null;
}

export type HttpResponse<Data> = HttpResponseSuccess<Data> | HttpResponseError;

export interface HttpResponseErrorFull extends HttpResponseError {
  original: null;
}

export interface HttpResponseSuccessFull<Data> extends HttpResponseSuccess<Data> {
  original: Response;
}

export type HttpResponseFull<Data> = HttpResponseSuccessFull<Data> | HttpResponseErrorFull;

export interface HttpClientBase {
  get<Data>(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<HttpResponse<Data>>;

  post<Data>(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<HttpResponse<Data>>;

  put<Data>(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<HttpResponse<Data>>;

  patch<Data>(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<HttpResponse<Data>>;

  delete<Data>(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<HttpResponse<Data>>;

  head(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<HttpResponse<Headers>>;

  options(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<HttpResponse<Headers>>;

  getUnsafe<Data>(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<Data>;

  postUnsafe<Data>(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<Data>;

  putUnsafe<Data>(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<Data>;

  patchUnsafe<Data>(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<Data>;

  deleteUnsafe<Data>(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<Data>;

  headUnsafe(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<Headers>;

  optionsUnsafe(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<Headers>;

  fetchGet<Data>(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<HttpResponseFull<Data>>;

  fetchPost<Data>(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<HttpResponseFull<Data>>;

  fetchPut<Data>(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<HttpResponseFull<Data>>;

  fetchPatch<Data>(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<HttpResponseFull<Data>>;

  fetchDelete<Data>(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<HttpResponseFull<Data>>;

  fetchHead(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<HttpResponseFull<null>>;

  fetchOptions(url: Url, options?: RequestOptionsInput, setting?: BaseSettings): Promise<HttpResponseFull<null>>;

  applyOptions(options: StableOptions): void;
  unapplyOptions(): void;

  applySettings(settings: BaseSettings): void;
  unapplySettings(): void;
}

export interface HttpErrorManagerBase {
  throw: (response: Response, dataText: string) => never;
  parse: <Data>(errorData: unknown, settings: Settings) => HttpResponseFull<Data>;
}

export interface HttpFetchProvider {
  fetch: (params: RequestParams) => Promise<Response>;
}

export interface RequestOptionsInput extends Omit<RequestInit, 'body' | 'method'> {
  body?: RequestInit['body'] | Record<string, any>;
}

export interface StableOptions extends Omit<RequestOptionsInput, 'body'> {}

export interface RequestOptions extends RequestInit {}

export type Url = string;
