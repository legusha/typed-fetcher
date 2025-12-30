import { HTTP_ERROR_TYPE, ErrorBase } from './errorBase';

const typeArrayBuffer = HTTP_ERROR_TYPE.ARRAY_BUFFER;

export class ErrorArrayBuffer extends ErrorBase<typeof typeArrayBuffer> implements ErrorBase<typeof typeArrayBuffer> {
  public readonly type = typeArrayBuffer;

  public constructor(
    public readonly status: number,
    public readonly details: null | ArrayBuffer,
    public readonly message: string = 'ArrayBuffer http error, please check details field',
  ) {
    super(message);
  }
}
