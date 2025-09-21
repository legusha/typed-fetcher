export const RESPONSE_AS = {
  json: 'json',
  text: 'text',
  arrayBuffer: 'arrayBuffer',
} as const;

export type ResponseAs = (typeof RESPONSE_AS)[keyof typeof RESPONSE_AS];

export interface Settings {
  responseAs: ResponseAs;
  baseUrl: string;
}
