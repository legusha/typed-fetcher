import { httpClient } from '../src'
import {config} from "./setup";
import {data as staticData, User} from "./setup/data";

const BASE_URL = config.BASE_URL

test('GET User', async () => {
  const { data, error } = await httpClient.get<User>(
    `${BASE_URL}/user`,
    undefined,
    { responseAs: 'json' },
  )

  expect(data).toEqual(staticData.USER);
});

test('POST User', async () => {
  const body = staticData.USER
  const { data, error } = await httpClient.post<User>(
    `${BASE_URL}/user`,
    { body },
    { responseAs: 'json' },
  )

  expect(data).toEqual(staticData.USER);
})

test('PUT User', async () => {
  const body = staticData.USER
  const { data, error } = await httpClient.put<User>(
    `${BASE_URL}/user`,
    { body },
    { responseAs: 'json' },
  )

  expect(data).toEqual(staticData.USER);
})

test('DELETE User', async () => {
  const body = staticData.USER
  const { data, error } = await httpClient.delete<User>(
    `${BASE_URL}/user`,
    { body },
    { responseAs: 'json' },
  )

  expect(data).toEqual(staticData.USER);
})

test('PATCH User', async () => {
  const body = staticData.USER
  const { data, error } = await httpClient.patch<User>(
    `${BASE_URL}/user`,
    { body },
    { responseAs: 'json' },
  )

  expect(data).toEqual(staticData.USER);
})

test('HEAD User', async () => {
  const { data, error } = await httpClient.head(
    `${BASE_URL}/user`,
    undefined,
    { responseAs: 'json' },
  )

  expect(data?.get('X-Custom-Header')).toEqual(staticData.HEADERS['X-Custom-Header']);
})
