import { httpClient } from '../src'
import { config } from "./setup/config";
import { data as staticData, User } from "./setup/data";

const BASE_URL = config.BASE_URL

httpClient.applySettings({baseUrl: BASE_URL, responseAs: 'json'})

test('GET User', async () => {
  const { data, error } = await httpClient.get<User>(
    `/user`,
    undefined,
    { responseAs: 'json' },
  )

  expect(data).toEqual(staticData.USER);
});

test('POST User', async () => {
  const body = staticData.USER
  const { data, error } = await httpClient.post<User>(
    `/user`,
    { body },
    { responseAs: 'json' },
  )

  expect(data).toEqual(staticData.USER);
})

test('PUT User', async () => {
  const body = staticData.USER
  const { data, error } = await httpClient.put<User>(
    `/user`,
    { body },
    { responseAs: 'json' },
  )

  expect(data).toEqual(staticData.USER);
})

test('DELETE User', async () => {
  const body = staticData.USER
  const { data, error } = await httpClient.delete<User>(
    `/user`,
    { body },
    { responseAs: 'json' },
  )

  expect(data).toEqual(staticData.USER);
})

test('PATCH User', async () => {
  const body = staticData.USER
  const { data, error } = await httpClient.patch<User>(
    `/user`,
    { body },
    { responseAs: 'json' },
  )

  expect(data).toEqual(staticData.USER);
})

test('HEAD User', async () => {
  const { data, error } = await httpClient.head(
    `/user`,
    undefined,
    { responseAs: 'json' },
  )

  expect(data?.get('X-Custom-Header')).toEqual(staticData.HEADERS['X-Custom-Header']);
})
