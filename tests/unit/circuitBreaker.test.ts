import { CircuitBreaker } from '../../src/circuitBreaker';
import { CircuitBreakerError } from '../../src/circuitBreaker/circuitBreakerError';

jest.mock('../../src/utils', () => ({
    wait: jest.fn(),
}));

class TestCircuitBreaker extends CircuitBreaker {
    public async executeTest<T>(action: () => Promise<T>): Promise<T> {
        return this.execute(action);
    }
}

describe('CircuitBreaker', () => {
    let circuitBreaker: TestCircuitBreaker;
    const config = {
        failureThreshold: 3,
        successThreshold: 2,
        timeout: 1000,
    };

    beforeEach(() => {
        circuitBreaker = new TestCircuitBreaker(config);
        jest.clearAllMocks();
    });

    describe('Closed State', () => {
        it('should execute action successfully', async () => {
            const action = jest.fn().mockResolvedValue('success');
            const result = await circuitBreaker.executeTest(action);
            expect(result).toBe('success');
            expect(action).toHaveBeenCalled();
        });

        it('should stay closed on success', async () => {
            const action = jest.fn().mockResolvedValue('success');
            await circuitBreaker.executeTest(action);
            // Access private state if possible or infer from behavior
            // We'll infer by tripping it and checking counts
        });

        it('should count failures but stay closed before threshold', async () => {
            const error = new Error('fail');
            const action = jest.fn().mockRejectedValue(error);

            await expect(circuitBreaker.executeTest(action)).rejects.toThrow(error);
            await expect(circuitBreaker.executeTest(action)).rejects.toThrow(error);

            expect(action).toHaveBeenCalledTimes(2);
        });

        it('should open after failure threshold is reached', async () => {
            const error = new Error('fail');
            const action = jest.fn().mockRejectedValue(error);

            // Fail 3 times (threshold)
            await expect(circuitBreaker.executeTest(action)).rejects.toThrow(error);
            await expect(circuitBreaker.executeTest(action)).rejects.toThrow(error);
            await expect(circuitBreaker.executeTest(action)).rejects.toThrow(error);

            // Next attempt should fail fast
            await expect(circuitBreaker.executeTest(action)).rejects.toThrow(CircuitBreakerError);
        });
    });

    describe('Open State', () => {
        beforeEach(async () => {
            const error = new Error('fail');
            const action = jest.fn().mockRejectedValue(error);
            for (let i = 0; i < config.failureThreshold; i++) {
                try {
                    await circuitBreaker.executeTest(action);
                } catch { }
            }
        });

        it('should fail fast with CircuitBreakerError', async () => {
            const action = jest.fn();
            await expect(circuitBreaker.executeTest(action)).rejects.toThrow(CircuitBreakerError);
            expect(action).not.toHaveBeenCalled();
        });

        it('should transition to Half-Open after timeout', async () => {
            const action = jest.fn().mockResolvedValue('success');

            // Simulate timeout passing by making Date.now() return larger value?
            // CircuitBreaker likely uses Date.now(). We might need to mock Date.

            jest.useFakeTimers();
            jest.setSystemTime(Date.now() + config.timeout + 100);

            // This should now run the action
            await circuitBreaker.executeTest(action);
            expect(action).toHaveBeenCalled();

            jest.useRealTimers();
        });
    });

    describe('Half-Open State', () => {
        beforeEach(async () => {
            const error = new Error('fail');
            const action = jest.fn().mockRejectedValue(error);
            for (let i = 0; i < config.failureThreshold; i++) {
                try {
                    await circuitBreaker.executeTest(action);
                } catch { }
            }

            jest.useFakeTimers();
            jest.setSystemTime(Date.now() + config.timeout + 100);
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should succeed and close after success threshold reached', async () => {
            const action = jest.fn().mockResolvedValue('success');

            // successThreshold is 2
            await circuitBreaker.executeTest(action); // 1st success
            await circuitBreaker.executeTest(action); // 2nd success -> Closed

            // Should now be closed and allow more requests
            await circuitBreaker.executeTest(action);
            expect(action).toHaveBeenCalledTimes(3);
        });

        it('should reopen immediately on failure', async () => {
            const successAction = jest.fn().mockResolvedValue('success');
            const failAction = jest.fn().mockRejectedValue(new Error('fail'));

            await circuitBreaker.executeTest(successAction);

            // Failure -> Open immediately
            await expect(circuitBreaker.executeTest(failAction)).rejects.toThrow('fail');

            // Should be Open again
            await expect(circuitBreaker.executeTest(successAction)).rejects.toThrow(CircuitBreakerError);
        });
    });
});
