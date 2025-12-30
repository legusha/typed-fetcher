import { httpClient } from '../src'
import { config } from "./setup";
import { data as staticData, User } from "./setup/data";

const BASE_URL = config.BASE_URL

httpClient.applySettings({baseUrl: BASE_URL, responseAs: 'text'})

test('GET User as text', async () => {
  const { data, error } = await httpClient.get<string>(
    `/user`,
    undefined,
  )

  expect(JSON.parse(data ?? '')).toEqual(staticData.USER);
});

test('POST User as text', async () => {
  const body = staticData.USER
  const { data, error } = await httpClient.post<string>(
    `/user`,
    { body },
  )

  expect(JSON.parse(data ?? '')).toEqual(staticData.USER);
})

test('PUT User as text', async () => {
  const body = staticData.USER
  const { data, error } = await httpClient.put<string>(
    `/user`,
    { body },
  )

  expect(JSON.parse(data ?? '')).toEqual(staticData.USER);
})

test('DELETE User as text', async () => {
  const body = staticData.USER
  const { data, error } = await httpClient.delete<string>(
    `/user`,
    { body },
  )

  expect(JSON.parse(data ?? '')).toEqual(staticData.USER);
})

test('PATCH User as text', async () => {
  const body = staticData.USER
  const { data, error } = await httpClient.patch<string>(
    `/user`,
    { body },
  )

  expect(JSON.parse(data ?? '')).toEqual(staticData.USER);
})
