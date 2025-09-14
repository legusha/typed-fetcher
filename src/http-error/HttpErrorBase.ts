export const HTTP_ERROR_TYPE = {
  JSON: 'JSON',
} as const;

export type HttpErrorType = (typeof HTTP_ERROR_TYPE)[keyof typeof HTTP_ERROR_TYPE];

export abstract class HttpErrorBase<Type extends HttpErrorType> extends Error {
  public abstract status: number;
  public abstract message: string;
  public abstract details: null | unknown;
  public abstract type: Type;
}

export type HttpError = HttpErrorBase<typeof HTTP_ERROR_TYPE.JSON>;
