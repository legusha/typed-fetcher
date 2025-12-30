import { ErrorArrayBuffer, ErrorJSON } from '../error';
import type { HttpError } from '../error/errorBase';
import type { HttpErrorManagerBase, HttpResponseFull } from '../httpClient';

export class ErrorManager implements HttpErrorManagerBase {
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
        throw new ErrorArrayBuffer(response.status, buffer);
      }

      if (contentType?.includes(this.contentType.TEXT)) {
        throw new ErrorJSON(dataText, response.status, dataText);
      }

      let errorJSON;
      try {
        errorJSON = JSON.parse(dataText);
      } catch (e) {
        /* empty */
      }

      if (errorJSON) {
        const defaultMessage = 'Unknown error please check details field';
        throw new ErrorJSON(errorJSON?.message ?? defaultMessage, response.status, errorJSON);
      }
    }

    const error = {
      status: response.status,
      message: response.statusText,
      details: 'No response for details',
    };

    throw new ErrorJSON(error.message, error.status, error.details);
  }

  public parse<Data>(errorData: unknown): HttpResponseFull<Data> {
    if (ErrorManager.isHttpError(errorData)) {
      return {
        original: null,
        data: null,
        error: errorData,
      };
    }

    throw errorData;
  }

  public static isHttpError(error: unknown): error is HttpError {
    const isObject = typeof error === 'object' && error !== null;

    return isObject && 'message' in error && 'status' in error;
  }
}
