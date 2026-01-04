import {wait} from "../../../src/utils";

describe('Utils timeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('resolves after given delay', async () => {
    const promise = wait(1000);

    let resolved = false;
    promise.then(() => {
      resolved = true;
    });

    jest.advanceTimersByTime(999);
    await Promise.resolve();
    expect(resolved).toBe(false);

    jest.advanceTimersByTime(1);
    await promise;

    expect(resolved).toBe(true);
  }, 20000);

  test('wait resolves after delay', async () => {
    jest.useRealTimers();

    await expect(wait(10)).resolves.toBeUndefined();
  });
})