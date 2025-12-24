import { HttpClient } from './http-client';
import { HttpErrorManager } from './http-error-manager';

export type { HttpClientBase, HttpFetchProvider, HttpErrorManagerBase } from './http-client/HttpClient.types';

export { HttpErrorManager, HttpClient };
export { HttpErrorJSON, HttpErrorBase } from './http-error';
export { XmlHttpProvider, FetchProvider } from './provider';

const httpErrorManager = new HttpErrorManager();
export const httpClient = new HttpClient(httpErrorManager);
