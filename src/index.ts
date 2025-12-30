import { ErrorManager } from './errorManager';
import { HttpClient } from './httpClient';

export type { HttpClientBase, HttpFetchProvider, HttpErrorManagerBase } from './httpClient/httpClient.types.js';

export { HttpClient, ErrorManager as HttpErrorManager };
export { ErrorJSON as HttpErrorJSON, ErrorBase as HttpErrorBase } from './error';
export { XmlHttpProvider, FetchProvider } from './provider';

const httpErrorManager = new ErrorManager();
export const httpClient = new HttpClient(httpErrorManager);
