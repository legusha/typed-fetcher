import { HttpClient, HttpErrorManager } from '../src'
import { config } from "./setup";
import { data as staticData, User } from "./setup/data";
import {arrayBufferToObject} from "./utils/arrayBuffer";

const BASE_URL = config.BASE_URL

const errorManager = new HttpErrorManager()
const httpClient = new HttpClient(errorManager)

httpClient.applySettings({baseUrl: BASE_URL, responseAs: 'arrayBuffer'})

test('GET User as text', async () => {
  const { data, error } = await httpClient.get<ArrayBuffer>(
    `/user`,
  )

  if (error) {
    throw error;
  }

  expect(arrayBufferToObject(data)).toEqual(staticData.USER);
});

test('POST User as text', async () => {
  const body = staticData.USER
  const { data, error } = await httpClient.post<ArrayBuffer>(
    `/user`,
    { body },
  )

  if (error) {
    throw error;
  }

  expect(arrayBufferToObject(data)).toEqual(staticData.USER);
})

test('PUT User as text', async () => {
  const body = staticData.USER
  const { data, error } = await httpClient.put<ArrayBuffer>(
    `/user`,
    { body },
  )

  if (error) {
    throw error;
  }

  expect(arrayBufferToObject(data)).toEqual(staticData.USER);
})

test('DELETE User as text', async () => {
  const body = staticData.USER
  const { data, error } = await httpClient.delete<ArrayBuffer>(
    `/user`,
    { body },
  )

  if (error) {
    throw error;
  }

  expect(arrayBufferToObject(data)).toEqual(staticData.USER);
})

test('PATCH User as text', async () => {
  const body = staticData.USER
  const { data, error } = await httpClient.patch<ArrayBuffer>(
    `/user`,
    { body },
  )

  if (error) {
    throw error;
  }

  expect(arrayBufferToObject(data)).toEqual(staticData.USER);
})
