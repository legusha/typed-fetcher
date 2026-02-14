import { httpClient } from '../src'
import {config} from "./setup";
import {data as staticData, User} from "./setup/data";

const BASE_URL = config.BASE_URL

describe('Test request unsafe', () => {
  test('GET unsafe User', async () => {
    const data = await httpClient.getUnsafe<User>(
      `${BASE_URL}/user`,
      undefined,
      { responseAs: 'json' },
    )

    expect(data).toEqual(staticData.USER);
  });

  test('POST unsafe User', async () => {
    const body = staticData.USER;

    const data = await httpClient.postUnsafe<User>(
      `${BASE_URL}/user`,
      { body },
      { responseAs: 'json' },
    )

    expect(data).toEqual(staticData.USER);
  })

  test('PUT unsafe User', async () => {
    const body = staticData.USER;

    const data = await httpClient.putUnsafe<User>(
      `${BASE_URL}/user`,
      { body },
      { responseAs: 'json' },
    )

    expect(data).toEqual(staticData.USER);
  })

  test('DELETE unsafe User', async () => {
    const body = staticData.USER;

    const data = await httpClient.deleteUnsafe<User>(
      `${BASE_URL}/user`,
      { body },
      { responseAs: 'json' },
    )

    expect(data).toEqual(staticData.USER);
  })

  test('PATCH unsafe User', async () => {
    const body = staticData.USER;

    const data = await httpClient.patchUnsafe<User>(
      `${BASE_URL}/user`,
      { body },
      { responseAs: 'json' },
    )

    expect(data).toEqual(staticData.USER);
  })

  test('HEAD unsafe User', async () => {
    const data = await httpClient.headUnsafe(
      `${BASE_URL}/user`,
      undefined,
      { responseAs: 'json' },
    )

    expect(data?.get('X-Custom-Header')).toEqual(staticData.HEADERS['X-Custom-Header']);
  })

  test('OPTIONS unsafe User', async () => {
    const data = await httpClient.optionsUnsafe(
      `${BASE_URL}/user`,
      undefined,
      { responseAs: 'json' },
    )

    expect(data?.get('X-Custom-Header')).toEqual(staticData.HEADERS['X-Custom-Header']);
  })
})
