import type { HttpErrorManagerBase, HttpResponseFull } from '../http-client/index';
import { HttpErrorArrayBuffer, HttpErrorJSON } from '../http-error/index';

export class HttpErrorManager implements HttpErrorManagerBase {
  private readonly contentType = {
    JSON: 'application/json',
    ARRAY_BUFFER: 'application/octet-stream',
    TEXT: 'text/plain',
  };
  public constructor() {}

  public throw(response: Response, dataText: string): never {
    if (dataText) {
      const contentType = response.headers.get('content-type');

      if (contentType?.includes(this.contentType.ARRAY_BUFFER)) {
        const encoder = new TextEncoder();
        const buffer = encoder.encode(dataText).buffer;
        throw new HttpErrorArrayBuffer(response.status, buffer);
      }

      if (contentType?.includes(this.contentType.TEXT)) {
        throw new HttpErrorJSON(dataText, response.status, dataText);
      }

      let errorJSON;
      try {
        errorJSON = JSON.parse(dataText);
      } catch (e) {
        /* empty */
      }

      if (errorJSON) {
        const defaultMessage = 'Unknown error please check details field';
        throw new HttpErrorJSON(errorJSON?.message ?? defaultMessage, response.status, errorJSON);
      }
    }

    const error = {
      status: response.status,
      message: response.statusText,
      details: 'No response for details',
    };

    throw new HttpErrorJSON(error.message, error.status, error.details);
  }

  public parse<Data>(errorData: unknown): HttpResponseFull<Data> {
    const isJsonError = errorData instanceof HttpErrorJSON;
    const isArrayBufferError = errorData instanceof HttpErrorArrayBuffer;

    if (isJsonError || isArrayBufferError) {
      return {
        original: null,
        data: null,
        error: errorData,
      };
    }

    throw errorData;
  }
}
