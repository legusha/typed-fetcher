import { ErrorJSON } from '../../src/error';
import { ErrorArrayBuffer } from '../../src/error';
import { HTTP_ERROR_TYPE } from '../../src/error/errorBase';

describe('Errors', () => {
    describe('ErrorJSON', () => {
        test('should create an instance with correct properties', () => {
            const message = 'Test Error';
            const status = 400;
            const details = { field: 'invalid' };
            const error = new ErrorJSON(message, status, details);

            expect(error.type).toBe(HTTP_ERROR_TYPE.JSON);
            expect(error.message).toBe(message);
            expect(error.status).toBe(status);
            expect(error.details).toEqual(details);
            expect(error).toBeInstanceOf(Error);
        });

        test('should use default message if empty string provided', () => {
            const status = 500;
            const error = new ErrorJSON('', status, null);

            expect(error.message).toBe('');
        });
    });

    describe('ErrorArrayBuffer', () => {
        test('should create an instance with correct properties', () => {
            const status = 200;
            const buffer = new ArrayBuffer(8);
            const message = 'Test ErrorArrayBuffer';
            const error = new ErrorArrayBuffer(status, buffer, message);

            expect(error.type).toBe(HTTP_ERROR_TYPE.ARRAY_BUFFER);
            expect(error.status).toBe(status);
            expect(error.details).toBe(buffer);
            expect(error.message).toBe(message);
            expect(error).toBeInstanceOf(Error);
        });

        test('should create an instance with correct default properties', () => {
            const status = 200;
            const buffer = new ArrayBuffer(8);
            const error = new ErrorArrayBuffer(status, buffer);

            expect(error.type).toBe(HTTP_ERROR_TYPE.ARRAY_BUFFER);
            expect(error.status).toBe(status);
            expect(error.details).toBe(buffer);
            expect(error.message).toBe('ArrayBuffer http error, please check details field');
            expect(error).toBeInstanceOf(Error);
        });
    });
});
