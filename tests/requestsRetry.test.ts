import { HttpClient, HttpErrorManager } from '../src';
import { config } from './setup';
import type { User } from './setup/data';
import { data as staticData } from './setup/data';

const BASE_URL = config.BASE_URL;

const errorManager = new HttpErrorManager();
const httpClient = new HttpClient(errorManager);

httpClient.applySettings({ baseUrl: BASE_URL, responseAs: 'json' });

const errorStatus = [429, 500, 524];

describe('Requests with retry', () => {
  test('GET User check retry', async () => {
    const { data, error } = await httpClient.get<User>(`/user/retry`, undefined, {
      timeout: {
        retry: {
          errorStatus,
          delays: [600, 3000, 300],
          totalWaitTime: 9000,
        },
      },
      responseAs: 'json',
    });
    expect(data).toEqual(staticData.USER);
  }, 10000);

  test('GET User check retry total wait time', async () => {
    const { data, error } = await httpClient.get<User>(`/user/retry`, undefined, {
      timeout: {
        retry: {
          errorStatus,
          delays: [600, 1000, 1000],
          totalWaitTime: 3000,
        },
      },
      responseAs: 'json',
    });
    expect(error?.status).toEqual(500);
  }, 10000);

  test('GET User check not correct status', async () => {
    const { data, error } = await httpClient.get<User>(`/user/retry`, undefined, {
      timeout: {
        retry: {
          errorStatus: [429, 524],
          delays: [600, 3000, 300],
          totalWaitTime: 12000,
        },
      },
      responseAs: 'json',
    });
    expect(error?.status).toEqual(500);
  });
});
