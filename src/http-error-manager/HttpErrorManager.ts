import { HttpErrorJSON } from '../http-error/index';
import { HTTP_ERROR_CODE } from '../http-error/HttpError.types';
import type { HttpErrorManagerBase, HttpClientSettings, HttpResponseFull } from '../http-client/index';
import type { HttpErrorCode } from '../http-error/HttpError.types';
import type { HttpError } from '../http-error/HttpErrorBase';

export class HttpErrorManager implements HttpErrorManagerBase {
  private readonly codeByStatus = new Map<number, HttpErrorCode>([
    [400, HTTP_ERROR_CODE.BAD_REQUEST],
    [401, HTTP_ERROR_CODE.UNAUTHORIZED],
    [404, HTTP_ERROR_CODE.NOT_FOUND],
    [408, HTTP_ERROR_CODE.REQUEST_TIMEOUT],
    [429, HTTP_ERROR_CODE.TOO_MANY_REQUEST],
    [500, HTTP_ERROR_CODE.SERVER_ERROR]
  ]);

  public constructor() {}

  public throw(data: Response, dataText: string): never {
    if (dataText) {
      let errorJSON;

      try {
        errorJSON = JSON.parse(dataText);
      } catch (e) {
        console.error(e);
      }

      const code = this.codeByStatus.get(data.status);

      if (errorJSON && errorJSON.message && code) {
        throw new HttpErrorJSON(code, errorJSON.message, data.status, null);
      }

      if (errorJSON && errorJSON.errorMessages && errorJSON.errorMessages?.length && code) {
        const firstMessage: string = errorJSON.errorMessages.at(0);

        throw new HttpErrorJSON(code, firstMessage, data.status, errorJSON);
      }
    }

    const code = this.codeByStatus.get(data.status);
    const error = {
      status: data.status,
      message: data.statusText,
      details: '',
      code: code
    };

    if (error.code) {
      throw new HttpErrorJSON(error.code as HttpErrorCode, error.message, error.status, error.details);
    }

    throw new HttpErrorJSON(HTTP_ERROR_CODE.UNKNOWN, error.message, error.status, error.details);
  }

  public parse<Data>(errorData: string | Error | HttpError, setting: HttpClientSettings): HttpResponseFull<Data> {
    if (setting.isCatchError && errorData instanceof HttpErrorJSON) {
      return {
        original: null,
        data: null,
        error: errorData
      };
    }

    throw errorData;
  }
}
