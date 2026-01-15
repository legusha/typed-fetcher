import { HTTP_ERROR_TYPE, ErrorBase } from './errorBase';

const typeArrayBuffer = HTTP_ERROR_TYPE.ARRAY_BUFFER;
const defaultMessage = 'ArrayBuffer http error, please check details field';

export class ErrorArrayBuffer extends ErrorBase<typeof typeArrayBuffer> implements ErrorBase<typeof typeArrayBuffer> {
  public readonly type = typeArrayBuffer;

  public constructor(
    public readonly status: number,
    public readonly details: null | ArrayBuffer,
    public readonly message: string = defaultMessage,
  ) {
    super(message);
  }
}
