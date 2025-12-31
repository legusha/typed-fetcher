export const HTTP_ERROR_TYPE = {
  JSON: 'JSON',
  ARRAY_BUFFER: 'ARRAY_BUFFER',
} as const;

export type HttpErrorType = (typeof HTTP_ERROR_TYPE)[keyof typeof HTTP_ERROR_TYPE];

export abstract class ErrorBase<Type extends HttpErrorType> extends Error {
  public abstract type: Type;
  public abstract status: number;
  public abstract message: string;
  public abstract details: null | unknown;
}

export type HttpError = ErrorBase<typeof HTTP_ERROR_TYPE.JSON> | ErrorBase<typeof HTTP_ERROR_TYPE.ARRAY_BUFFER>;
