export class SupabaseError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

export function handleSupabaseError(error: any): never {
  // Network errors
  if (error.message === 'Failed to fetch') {
    throw new SupabaseError(
      'Network error - please check your connection',
      'NETWORK_ERROR'
    );
  }

  // Authentication errors
  if (error.code?.startsWith('auth/')) {
    throw new SupabaseError(
      'Authentication error - please sign in again',
      error.code
    );
  }

  // Database errors
  if (error.code?.startsWith('PGRST')) {
    throw new SupabaseError(
      'Database error - please try again',
      error.code,
      error.details
    );
  }

  // Generic error
  throw new SupabaseError(
    'An unexpected error occurred',
    'UNKNOWN',
    error
  );
}