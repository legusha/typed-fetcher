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
  test('GET unsafe check error', async () => {
    try {
      await httpClient.getUnsafe<User>(
        `/user-error`,
        undefined,
      )
    } catch (e) {
      testServerError(e)
    }
  });

  test('GET not found endpoint unsafe check error', async () => {
    try {
      await httpClient.getUnsafe<User>(
        `/user-error/not-found`,
        undefined,
      )
    } catch (e) {
      const notFoundMessage = 'fetch failed'
      const error = e as Error;
      expect(error.message).toEqual(notFoundMessage);
    }
  });

  test('POST unsafe check error', async () => {
    try {
      const body = staticData.USER
      await httpClient.postUnsafe<User>(
        `/user-error`,
        { body },
      )
    } catch (e) {
      testServerError(e)
    }
  })

  test('PUT unsafe check error', async () => {
    try {
      const body = staticData.USER
      await httpClient.putUnsafe<User>(
        `/user-error`,
        { body },
      )
    } catch (e) {
      testServerError(e)
    }
  })

  test('DELETE unsafe check error', async () => {
    try {
      const body = staticData.USER
      await httpClient.deleteUnsafe<User>(
        `/user-error`,
        { body },
      )
    } catch (e) {
      testServerError(e)
    }
  })

  test('PATCH unsafe check error', async () => {
    try {
      const body = staticData.USER
      await httpClient.patchUnsafe<User>(
        `/user-error`,
        { body },
      )
    } catch (e) {
      testServerError(e)
    }
  })

  test('HEAD unsafe check error', async () => {
    try {
      await httpClient.headUnsafe(
        `/user-error`,
      )
    } catch (e) {
      testServerError(e)
    }
  })

  test('OPTIONS unsafe check error', async () => {
    try {
      await httpClient.headUnsafe(
        `/user-error`,
      )
    } catch (e) {
      testServerError(e)
    }
  })
})
