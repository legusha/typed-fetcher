import type { HttpFetchProvider, RequestParams } from '../httpClient';

export class XmlHttpProvider implements HttpFetchProvider {
  public constructor() {
    if (!globalThis.XMLHttpRequest) {
      throw new Error('XMLHttpRequest is not supported in this environment');
    }
  }

  public fetch(params: RequestParams): Promise<Response> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open(params.method, params.url, true);

      if (params.options.headers) {
        for (const [key, value] of Object.entries(params.options.headers)) {
          xhr.setRequestHeader(key, value);
        }
      }

      if (params.options?.credentials === 'include') {
        xhr.withCredentials = true;
      }

      xhr.onload = () => {
        const responseInit = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: new Headers(),
        };

        xhr
          .getAllResponseHeaders()
          .trim()
          .split(/[\r\n]+/)
          .forEach((line) => {
            const parts = line.split(': ');
            const header = parts.shift();
            const value = parts.join(': ');
            if (header) {
              responseInit.headers.append(header, value);
            }
          });

        const body = xhr.response || xhr.responseText;
        resolve(new Response(body, responseInit));
      };

      xhr.onerror = () => {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = () => {
        reject(new TypeError('Network request timed out'));
      };

      const body = JSON.stringify(params.options.body);
      xhr.send(body || null);
    });
  }
}
