import { ErrorArrayBuffer, ErrorJSON } from '../error';
import type { HttpError } from '../error/errorBase';
import type { HttpErrorManagerBase, HttpResponseFull } from '../httpClient';
import type { Settings } from '../htttpClientSetting';

export class ErrorManager implements HttpErrorManagerBase {
  private readonly contentType = {
    JSON: 'application/json',
    ARRAY_BUFFER: 'application/octet-stream',
    TEXT: 'text/plain',
  };
  public constructor() {}

  public throw(response: Response, dataText: string): never {
    if (dataText) {
      const contentTypeHeaderName = 'content-type';
      const contentType = response.headers.get(contentTypeHeaderName);

      this.throwErrorIfContentTypeArrayBuffer(dataText, response, contentType)
        .throwErrorIfContentTypeText(dataText, response, contentType)
        .throwErrorIfContentJson(dataText, response);
    }

    this.throwDefaultError(response);
  }

  public parse<Data>(errorData: unknown, settings: Settings): HttpResponseFull<Data> {
    if (settings.catchError === false && ErrorManager.isKnownError(errorData)) {
      throw errorData;
    }

    if (ErrorManager.isKnownError(errorData)) {
      return {
        original: null,
        data: null,
        error: errorData,
      };
    }

    throw errorData;
  }

  public static isKnownError(error: unknown): error is HttpError {
    const isObject = typeof error === 'object' && error !== null;

    return isObject && 'message' in error && 'status' in error;
  }

  private throwErrorIfContentTypeArrayBuffer(
    dataText: string,
    response: Response,
    contentType: string | null,
  ): never | this {
    if (contentType?.includes(this.contentType.ARRAY_BUFFER)) {
      const encoder = new TextEncoder();
      const buffer = encoder.encode(dataText).buffer;
      throw new ErrorArrayBuffer(response.status, buffer);
    }

    return this;
  }

  private throwErrorIfContentTypeText(dataText: string, response: Response, contentType: string | null): never | this {
    if (contentType?.includes(this.contentType.TEXT)) {
      throw new ErrorJSON(dataText, response.status, dataText);
    }

    return this;
  }

  private throwErrorIfContentJson(dataText: string, response: Response): never | void {
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

  private throwDefaultError(response: Response): never {
    const defaultDetails = 'No response for details';

    throw new ErrorJSON(response.statusText, response.status, defaultDetails);
  }
}
