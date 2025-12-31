import { HttpClient, HttpErrorManager } from '../src'
import { config } from "./setup";
import { data as staticData, User } from "./setup/data";

const BASE_URL = config.BASE_URL

const errorManager = new HttpErrorManager()
const httpClient = new HttpClient(errorManager)

httpClient.applySettings({ baseUrl: BASE_URL, responseAs: 'json' })

const errorStatus = [429, 500, 524]

test('GET User check retry circuit breaker', async () => {
  const { data, error } = await httpClient.get<User>(
    `/user/retry`,
    undefined,
    {
      timeout: {
        retry: {
          errorStatus,
          delays: [600],
          totalWaitTime: 18000,
        },
        circuitBreaker: {
          failureThreshold: 10,
          successThreshold: 1,
          timeout: 10000,
        }
      },
      responseAs: 'json',
    }
  )
  expect(data).toEqual(staticData.USER);
}, 20000);

test('GET User check retry circuit breaker 2', async () => {
  const { data, error } = await httpClient.get<User>(
    `/user/retry`,
    undefined,
    {
      timeout: {
        retry: {
          errorStatus,
          delays: [600],
          totalWaitTime: 30000,
        },
        circuitBreaker: {
          failureThreshold: 5,
          successThreshold: 1,
          timeout: 3000,
        }
      },
      responseAs: 'json',
    }
  )
  expect(data).toEqual(staticData.USER);
}, 30000);