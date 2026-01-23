import { CircuitBreaker } from '../circuitBreaker';
import type { CircuitBreakerOptions } from '../circuitBreaker/circuitBreaker.types';
import { CircuitBreakerError } from '../circuitBreaker/circuitBreakerError';
import { ErrorJSON } from '../error';
import type { HttpError } from '../error/errorBase';
import { ErrorManager } from '../errorManager';
import type { HttpResponseFull } from '../httpClient';
import { wait } from '../utils';

export interface HttpClientRetryOptions {
  errorStatus: number[];
  delays: number[];
  totalWaitTime: number;
}

export interface HttpClientTimeoutConfig {
  retry: HttpClientRetryOptions;
  circuitBreaker?: CircuitBreakerOptions;
}

export class HttpClientRetry extends CircuitBreaker {
  public static defaultConfig: HttpClientTimeoutConfig = {
    retry: {
      errorStatus: [429, 500, 524],
      delays: [600, 3000, 6000, 9000],
      totalWaitTime: 60000,
    },
    circuitBreaker: {
      failureThreshold: 10,
      successThreshold: 1,
      timeout: 3000,
    },
  };
  private readonly delayDefault = 9000;

  public constructor(private readonly config: HttpClientTimeoutConfig = HttpClientRetry.defaultConfig) {
    super(config.circuitBreaker || HttpClientRetry.defaultConfig.circuitBreaker!);
  }

  protected async execute<Data>(action: (...args: unknown[]) => Promise<Data>, ...args: unknown[]): Promise<Data>;
  protected override async execute<Data extends HttpResponseFull<Data>>(
    action: (...args: unknown[]) => Promise<Data>,
    ...args: unknown[]
  ): Promise<Data> {
    this.checkStateOpenAndWrite();

    try {
      const result = await action(...args);

      if (result.error) {
        throw result.error;
      }
      this.checkStateHalfOpenAndWrite();

      return result;
    } catch (error) {
      this.handleErrorAndWrite();
      throw error;
    }
  }

  public async fetch<Data>(
    fn: (...args: any) => Promise<HttpResponseFull<Data>>,
    ...args: any
  ): Promise<HttpResponseFull<Data>> {
    const thatTotalWaitTime = this.config.retry.totalWaitTime;
    let attempt = 0;
    let totalWaitTime = 0;
    let resultData: HttpResponseFull<Data> = {
      data: null,
      error: new ErrorJSON('Unknown error', 0, null),
      original: null,
    };

    while (totalWaitTime < thatTotalWaitTime) {
      try {
        const executor = (): Promise<HttpResponseFull<Data>> => fn(...args);
        let result;

        if (this.config.circuitBreaker) {
          result = await this.execute(executor);
        } else {
          result = await executor();
        }

        resultData = result;

        if (result.error) {
          throw result.error;
        }

        return result;
      } catch (error) {
        if (this.isKnownRetryError(error) || this.isKnownErrorCircuitBreaker(error)) {
          console.error(error);
          const retryDelay = this.config.retry.delays[attempt] ?? this.config.retry.delays.at(-1) ?? this.delayDefault;

          totalWaitTime += retryDelay;
          attempt += 1;
          await wait(retryDelay);
          continue;
        }

        if (ErrorManager.isKnownError(error)) {
          return {
            data: null,
            error,
            original: null,
          };
        }

        return resultData;
      }
    }

    return resultData;
  }

  private isErrorCircuitBreaker(error: unknown): error is CircuitBreakerError {
    return error instanceof CircuitBreakerError;
  }

  private isKnownRetryError(error: unknown): error is HttpError {
    const isHttpError = ErrorManager.isKnownError(error);
    const retryBy = this.config.retry.errorStatus;

    return isHttpError && retryBy.includes(error.status);
  }

  private isKnownErrorCircuitBreaker(error: unknown): error is CircuitBreakerError {
    const isErrorCircuitBreaker = this.isErrorCircuitBreaker(error);
    const circuitBreakerMessage = CircuitBreakerError.TYPE.open;

    return isErrorCircuitBreaker && error.message === circuitBreakerMessage;
  }
}
