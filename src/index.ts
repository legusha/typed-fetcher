import { HttpClient } from './httpClient';
import { HttpErrorManager } from './httpErrorManager';

export type { HttpClientBase, HttpFetchProvider, HttpErrorManagerBase } from './httpClient/httpClient.types.js';

export { HttpErrorManager, HttpClient };
export { HttpErrorJSON, HttpErrorBase } from './httpError';
export { XmlHttpProvider, FetchProvider } from './provider';

const httpErrorManager = new HttpErrorManager();
export const httpClient = new HttpClient(httpErrorManager);
