// Retry configuration
export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 5000,
  backoffFactor: 2
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let attempt = 0;
  let delay = finalConfig.initialDelay;

  while (attempt < finalConfig.maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      
      if (attempt === finalConfig.maxAttempts) {
        throw error;
      }

      // Calculate next delay with exponential backoff
      delay = Math.min(
        delay * finalConfig.backoffFactor,
        finalConfig.maxDelay
      );

      // Add jitter to prevent thundering herd
      const jitter = delay * (0.5 + Math.random() * 0.5);
      
      await new Promise(resolve => setTimeout(resolve, jitter));
    }
  }

  throw new Error('Retry failed');
}