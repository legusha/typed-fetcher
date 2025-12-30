import { HTTP_ERROR_TYPE, HttpErrorBase } from './httpErrorBase';

const typeArrayBuffer = HTTP_ERROR_TYPE.ARRAY_BUFFER;

export class HttpErrorArrayBuffer
  extends HttpErrorBase<typeof typeArrayBuffer>
  implements HttpErrorBase<typeof typeArrayBuffer>
{
  public readonly type = typeArrayBuffer;

  public constructor(
    public readonly status: number,
    public readonly details: null | ArrayBuffer,
    public readonly message: string = 'ArrayBuffer http error, please check details field',
  ) {
    super(message);
  }
}
