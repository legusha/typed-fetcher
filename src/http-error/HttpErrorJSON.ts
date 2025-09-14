import { type HttpErrorCode } from './HttpError.types';
import { HTTP_ERROR_TYPE, HttpErrorBase } from './HttpErrorBase';

const typeJSON = HTTP_ERROR_TYPE.JSON;

export class HttpErrorJSON extends HttpErrorBase<typeof typeJSON> implements HttpErrorBase<typeof typeJSON> {
  public type = typeJSON;

  public constructor(
    public code: HttpErrorCode,
    public message: string,
    public status: number,
    public details: null | unknown,
  ) {
    super(message || 'Unknown error');
  }
}
