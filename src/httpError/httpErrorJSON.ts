import { HTTP_ERROR_TYPE, HttpErrorBase } from './httpErrorBase';

const typeJSON = HTTP_ERROR_TYPE.JSON;

export class HttpErrorJSON extends HttpErrorBase<typeof typeJSON> implements HttpErrorBase<typeof typeJSON> {
  public type = typeJSON;

  public constructor(
    public message: string,
    public status: number,
    public details: null | unknown,
  ) {
    super(message || 'Unknown error');
  }
}
