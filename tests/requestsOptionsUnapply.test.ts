import { HttpClient, HttpErrorManager } from '../src'
import { config } from "./setup";
import { data as staticData, User } from "./setup/data";

const BASE_URL = config.BASE_URL

const errorManager = new HttpErrorManager()
const httpClient = new HttpClient(errorManager)

httpClient.applySettings({ baseUrl: BASE_URL, responseAs: 'json' })
httpClient.applyOptions({ headers: staticData.HEADERS })
httpClient.unapplyOptions()

describe('Unapply options', () => {
  test('GET User check unapply options', async () => {
    const { data, error } = await httpClient.get<User>(
      `/user`,
      undefined,
    )

    expect(data).toEqual(staticData.USER);
  });

  test('POST User check unapply options', async () => {
    const body = staticData.USER
    const { data, error } = await httpClient.post<User>(
      `/user`,
      { body },
    )

    expect(data).toEqual(staticData.USER);
  })

  test('PUT User check unapply options', async () => {
    const body = staticData.USER
    const { data, error } = await httpClient.put<User>(
      `/user`,
      { body },
    )

    expect(data).toEqual(staticData.USER);
  })

  test('DELETE User check unapply options', async () => {
    const body = staticData.USER
    const { data, error } = await httpClient.delete<User>(
      `/user`,
      { body },
    )

    expect(data).toEqual(staticData.USER);
  })

  test('PATCH User check unapply options', async () => {
    const body = staticData.USER
    const { data, error } = await httpClient.patch<User>(
      `/user`,
      { body },
    )

    expect(data).toEqual(staticData.USER);
  })
})
