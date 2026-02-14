import { HttpClient, HttpErrorManager } from '../src'
import { config } from "./setup";
import { User } from "./setup";
import { wait } from '../src/utils';
import { HttpFetchProvider, RequestParams } from '../src/httpClient/httpClient.types';
import { FetchProvider } from '../src';

jest.mock('../src/utils', () => ({
    wait: jest.fn(),
}));

const BASE_URL = config.BASE_URL

class SpyFetchProvider implements HttpFetchProvider {
    public callCount = 0;
    private readonly realProvider = new FetchProvider();

    async fetch(params: RequestParams): Promise<Response> {
        this.callCount++;
        return this.realProvider.fetch(params);
    }
}

const errorManager = new HttpErrorManager()

const errorStatus = [429, 500, 524]

describe.skip('Circuit Breaker State Integration (Per Request)', () => {
    let spyProvider: SpyFetchProvider;
    let httpClient: HttpClient;

    beforeEach(() => {
        jest.clearAllMocks();
        spyProvider = new SpyFetchProvider();
        httpClient = new HttpClient(errorManager, spyProvider);
        httpClient.applySettings({ baseUrl: BASE_URL, responseAs: 'json' });
    });

    test('Fail Fast: Should stop network calls during retries when open', async () => {
        const circuitConfig = {
            retry: {
                errorStatus,
                delays: [1000, 1000, 1000, 1000, 1000],
                totalWaitTime: 5000,
            },
            circuitBreaker: {
                failureThreshold: 2,
                successThreshold: 1,
                timeout: 10000,
            }
        };

        // Make request that always fails (e.g. /user/retry fails 10 times)
        // We expect:
        // 1 call (fail)
        // 2 calls (fail) -> Circuit Trips
        // Remaining retry attempts should be blocked by CB.
        // So total calls should be 2.
        // (Maybe +1 depending on when check happens, let's say <= 3)

        // We need to ensure the mocked `wait` actually advances time logic if `HttpClientRetry` relies on Time check?
        // `CircuitBreaker` uses `Date.now()`.
        // `HttpClientRetry` wait just waits. 
        // If we mock `wait` to do nothing, strictly, the loop runs fast.

        // Since we want to prove it STOPS calling fetch:
        // If CB was disabled, it would call retry.delays.length + initial = 11 times.
        // With CB, it should call 2 times.

        try {
            await httpClient.get<User>(`/user/retry`, undefined, { timeout: circuitConfig, responseAs: 'json' });
        } catch { }

        // Check call count
        // It should be 2 (threshold).
        // Allow small margin if implementation tries one more.
        expect(spyProvider.callCount).toBeLessThanOrEqual(2);
        expect(spyProvider.callCount).toBeGreaterThan(0);
    });



    // Let's stick to "Fail Fast" first as it's the critical safety feature. 
    // "Recovery" relying on internal loop timing is complex to test cleanly without refactoring code for testability.

    // Actually, I can implement a simpler test for "Recovery" utilizing the fact that "Fail Fast" worked.
    // If I set retryDelay > CB Timeout.
    // And I mock `wait` to manualy advance system time?
    // `jest.setSystemTime`

    test('Recovery: Should resume calls if retry delay exceeds CB timeout', async () => {
        jest.useFakeTimers();
        jest.setSystemTime(1000); // Start at 1000

        // Setup:
        // Trip at 1.
        // Retry Delay 500ms.
        // CB Timeout 200ms.
        const circuitConfig = {
            retry: {
                errorStatus,
                delays: [500, 500, 500],
                totalWaitTime: 2000,
            },
            circuitBreaker: {
                failureThreshold: 1,
                successThreshold: 1,
                timeout: 200,
            }
        };

        (wait as jest.Mock).mockImplementation(async (ms: number) => {
            jest.setSystemTime(Date.now() + ms);
        });

        // 1 call fails. Trips.
        // error caught.
        // wait(500). -> System time + 500.
        // loop.
        // execute(). CB check. Time passed (500) > timeout (200).
        // Should be Half-Open.
        // Should call network.

        // So, total calls:
        // 1 (Initial) -> Fail. Trip.
        // 2 (Retry 1) -> Fail. Open again? (If fail again)
        // ...
        // Expected calls: multiple (not stopped by CB).
        // Theoretical max calls = 1 (init) + 3 (retries) = 4.

        // Here retryDelay (500) > CB Timeout (200). Calls should go through.

        try {
            await httpClient.get<User>(`/user/retry`, undefined, { timeout: circuitConfig, responseAs: 'json' });
        } catch { }

        expect(spyProvider.callCount).toBeGreaterThan(2);

        jest.useRealTimers();
    });
});
