import { HttpClient, HttpErrorManager } from '../src'
import {config, data} from "./setup";
import { data as staticData, User } from "./setup/data";
import {ErrorBase} from "../src/error";
import {HTTP_ERROR_TYPE} from "../src/error/errorBase";

const BASE_URL = config.BASE_URL

const errorManager = new HttpErrorManager()
const httpClient = new HttpClient(errorManager)

httpClient.applySettings({ baseUrl: BASE_URL, responseAs: 'json' })
const errorMessage = data.HTTP_ERRORS.SERVER_ERROR.message
const errorStatus = data.HTTP_ERRORS.SERVER_ERROR.statusCode;

const testServerError = (e: unknown): void => {
  const error = e as ErrorBase<typeof HTTP_ERROR_TYPE.JSON>
  const statusCode = error.status;
  const details = error.details;

  expect(e).toBeInstanceOf(ErrorBase);
  expect(statusCode).toEqual(errorStatus);
  expect(details).toEqual({ error: errorMessage })
}

describe('Test without catch Error', () => {
  test('GET without catch Error', async () => {
    try {
      const { data } = await httpClient.get<User>(
        `/user-error`,
        undefined,
        { catchError: false, responseAs: 'json' }
      )
    } catch (e) {
      testServerError(e)
    }
  });

  test('GET not found endpoint without catch Error', async () => {
    try {
      const { data } = await httpClient.get<User>(
        `/user-error/not-found`,
        undefined,
        { catchError: false, responseAs: 'json' }
      )
    } catch (e) {
      const notFoundMessage = 'fetch failed'
      const error = e as Error;
      expect(error.message).toEqual(notFoundMessage);
    }
  });

  test('POST without catch Error', async () => {
    try {
      const body = staticData.USER
      const { data } = await httpClient.post<User>(
        `/user-error`,
        { body },
        { catchError: false, responseAs: 'json' }
      )
    } catch (e) {
      testServerError(e)
    }
  })

  test('PUT without catch Error', async () => {
    try {
      const body = staticData.USER
      const { data } = await httpClient.put<User>(
        `/user-error`,
        { body },
        { catchError: false, responseAs: 'json' }
      )
    } catch (e) {
      testServerError(e)
    }
  })

  test('DELETE without catch Error', async () => {
    try {
      const body = staticData.USER
      const { data } = await httpClient.delete<User>(
        `/user-error`,
        { body },
        { catchError: false, responseAs: 'json' }
      )
    } catch (e) {
      testServerError(e)
    }
  })

  test('PATCH without catch Error', async () => {
    try {
      const body = staticData.USER
      const { data } = await httpClient.patch<User>(
        `/user-error`,
        { body },
        { catchError: false, responseAs: 'json' }
      )
    } catch (e) {
      testServerError(e)
    }
  })
})
