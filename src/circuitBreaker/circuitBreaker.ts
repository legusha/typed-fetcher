import type { CircuitBreakerOptions, CircuitBreakerState } from './circuitBreaker.types';
import { CircuitBreakerError } from './circuitBreakerError';

export const CIRCUIT_BREAKER_STATE = {
  CLOSED: 'closed',
  OPEN: 'open',
  HALF_OPEN: 'half-open',
} as const;

export class CircuitBreaker {
  public static readonly state = CIRCUIT_BREAKER_STATE;
  protected state: CircuitBreakerState = CIRCUIT_BREAKER_STATE.CLOSED;
  protected nextAttempt = Date.now();

  private failureCount = 0;
  private successCount = 0;

  public constructor(private readonly options: CircuitBreakerOptions) {}

  protected async execute<Data>(action: (...args: unknown[]) => Promise<Data>, ...args: unknown[]): Promise<Data> {
    this.checkStateOpenAndWrite();

    try {
      const result = await action(...args);
      this.checkStateHalfOpenAndWrite();

      return result;
    } catch (error) {
      this.handleErrorAndWrite();
      throw error;
    }
  }

  protected moveToOpen(): void {
    this.state = CIRCUIT_BREAKER_STATE.OPEN;
    this.nextAttempt = Date.now() + this.options.timeout;
  }

  protected moveToHalfOpen(): void {
    this.state = CIRCUIT_BREAKER_STATE.HALF_OPEN;
    this.failureCount = 0;
    this.successCount = 0;
  }

  protected moveToClosed(): void {
    this.state = CIRCUIT_BREAKER_STATE.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
  }

  protected checkStateOpenAndWrite(): void {
    if (this.state === CIRCUIT_BREAKER_STATE.OPEN) {
      const now = Date.now();

      if (now > this.nextAttempt) {
        this.moveToHalfOpen();

        return;
      }
      throw new CircuitBreakerError(CircuitBreakerError.TYPE.open);
    }
  }

  protected checkStateHalfOpenAndWrite(): void {
    if (this.state === CIRCUIT_BREAKER_STATE.HALF_OPEN) {
      this.successCount++;

      if (this.successCount >= this.options.successThreshold) {
        this.moveToClosed();
      }
    }
  }

  protected handleErrorAndWrite(): void {
    this.failureCount++;

    if (this.state === CIRCUIT_BREAKER_STATE.HALF_OPEN || this.failureCount >= this.options.failureThreshold) {
      this.moveToOpen();
    }
  }
}
