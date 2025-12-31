export class CircuitBreakerError extends Error {
  public static readonly TYPE = {
    open: 'Circuit is open',
  };
}
