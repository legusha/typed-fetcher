import { HttpClient, HttpErrorManager } from '../src'
import { config } from "./setup";
import { data as staticData, User } from "./setup/data";

const BASE_URL = config.BASE_URL

const errorManager = new HttpErrorManager()
const httpClient = new HttpClient(errorManager)

httpClient.applySettings({baseUrl: BASE_URL, responseAs: 'json'})

describe('Response as JSON', () => {
  test('GET User as json', async () => {
    const { data, error } = await httpClient.get<string>(
      `/user`,
    )

    expect(data).toEqual(staticData.USER);
  });

  test('POST User as json', async () => {
    const body = staticData.USER
    const { data, error } = await httpClient.post<string>(
      `/user`,
      { body },
    )

    expect(data).toEqual(staticData.USER);
  })

  test('PUT User as json', async () => {
    const body = staticData.USER
    const { data, error } = await httpClient.put<string>(
      `/user`,
      { body },
    )

    expect(data).toEqual(staticData.USER);
  })

  test('DELETE User as json', async () => {
    const body = staticData.USER
    const { data, error } = await httpClient.delete<string>(
      `/user`,
      { body },
    )

    expect(data).toEqual(staticData.USER);
  })

  test('PATCH User as json', async () => {
    const body = staticData.USER
    const { data, error } = await httpClient.patch<string>(
      `/user`,
      { body },
    )

    expect(data).toEqual(staticData.USER);
  })
})
