import { HTTP_ERROR_TYPE, ErrorBase } from './errorBase';

const typeJSON = HTTP_ERROR_TYPE.JSON;
const defaultMessage = 'Unknown error';

export class ErrorJSON extends ErrorBase<typeof typeJSON> implements ErrorBase<typeof typeJSON> {
  public type = typeJSON;

  public constructor(
    public message: string,
    public status: number,
    public details: null | unknown,
  ) {
    super(message || defaultMessage);
  }
}
