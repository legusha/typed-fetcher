import { ErrorJSON, ErrorArrayBuffer } from '../../src/error';
import { ErrorManager } from '../../src/errorManager';

describe('ErrorManager', () => {
  let errorManager: ErrorManager;

  beforeEach(() => {
    errorManager = new ErrorManager();
  });

  describe('throw', () => {
    it('should throw ErrorJSON for JSON content type', () => {
      const response = {
        headers: new Map([['content-type', 'application/json']]),
        status: 400,
        statusText: 'Bad Request',
      } as unknown as Response;
      const dataText = JSON.stringify({ message: 'Validation Error', field: 'email' });

      try {
        errorManager.throw(response, dataText);
      } catch (error) {
        expect(error).toBeInstanceOf(ErrorJSON);
        if (error instanceof ErrorJSON) {
          expect(error.message).toBe('Validation Error');
          expect(error.status).toBe(400);
          expect((error.details as any).field).toBe('email');
        }
      }
    });

    it('should throw ErrorArrayBuffer for ArrayBuffer content type', () => {
      const response = {
        headers: new Map([['content-type', 'application/octet-stream']]),
        status: 500,
      } as unknown as Response;
      const dataText = 'binary data';

      try {
        errorManager.throw(response, dataText);
      } catch (error) {
        expect(error).toBeInstanceOf(ErrorArrayBuffer);
        if (error instanceof ErrorArrayBuffer) {
          expect(error.status).toBe(500);
          expect(error.details).toBeInstanceOf(ArrayBuffer);
        }
      }
    });

    it('should throw ErrorJSON simple text for text content type', () => {
      const response = {
        headers: new Map([['content-type', 'text/plain']]),
        status: 404,
      } as unknown as Response;
      const dataText = 'Not Found';

      try {
        errorManager.throw(response, dataText);
      } catch (error) {
        expect(error).toBeInstanceOf(ErrorJSON);
        if (error instanceof ErrorJSON) {
          expect(error.message).toBe('Not Found');
          expect(error.status).toBe(404);
          expect(error.details).toBe('Not Found');
        }
      }
    });

    it('should handle malformed JSON gracefully', () => {
      const response = {
        headers: new Map([['content-type', 'application/json']]),
        status: 500,
        statusText: 'Internal Error',
      } as unknown as Response;
      const dataText = '{ malformed json ';

      try {
        errorManager.throw(response, dataText);
      } catch (error) {
        expect(error).toBeInstanceOf(ErrorJSON);
        if (error instanceof ErrorJSON) {
          expect(error.message).toBe('Internal Error');
          expect(error.status).toBe(500);
          expect(error.details).toBe('No response for details');
        }
      }
    });

    it('should throw generic ErrorJSON if no dataText', () => {
      const response = {
        status: 401,
        statusText: 'Unauthorized',
      } as unknown as Response;

      try {
        errorManager.throw(response, '');
      } catch (error) {
        expect(error).toBeInstanceOf(ErrorJSON);
        if (error instanceof ErrorJSON) {
          expect(error.message).toBe('Unauthorized');
          expect(error.status).toBe(401);
        }
      }
    });
  });

  describe('parse', () => {
    it('should return HttpResponseFull with error if input is HttpError', () => {
      const httpError = new ErrorJSON('test', 400, null);
      const result = errorManager.parse(httpError, { responseAs: 'json' });

      expect(result.error).toBe(httpError);
      expect(result.data).toBeNull();
      expect(result.original).toBeNull();
    });

    it('should rethrow if input is not HttpError', () => {
      const regularError = new Error('regular error');
      expect(() => errorManager.parse(regularError, { responseAs: 'json' })).toThrow(regularError);
    });
  });

  describe('isHttpError', () => {
    it('should return true for ErrorJSON', () => {
      const error = new ErrorJSON('test', 200, null);
      expect(ErrorManager.isKnownError(error)).toBe(true);
    });

    it('should return false for regular Error', () => {
      const error = new Error('test');
      expect(ErrorManager.isKnownError(error)).toBe(false);
    });

    it('should return false for plain object without status', () => {
      expect(ErrorManager.isKnownError({ message: 'test' })).toBe(false);
    });

    it('should return true for plain object with message and status', () => {
      expect(ErrorManager.isKnownError({ message: 'test', status: 400 })).toBe(true);
    });
  });
});
