import type { HttpClientTimeoutConfig } from '../httpClientRetry/httpClientRetry';

export const RESPONSE_AS = {
  json: 'json',
  text: 'text',
  arrayBuffer: 'arrayBuffer',
} as const;

export type ResponseAs = (typeof RESPONSE_AS)[keyof typeof RESPONSE_AS];

export interface BaseSettings {
  responseAs: ResponseAs;
  baseUrl?: string;
  timeout?: HttpClientTimeoutConfig;
}

interface WithCatchError {
  catchError: boolean;
}

export interface Settings extends BaseSettings, WithCatchError {}
