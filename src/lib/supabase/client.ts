import { createClient } from '@supabase/supabase-js';
import { withRetry } from './retry-handler';
import { handleSupabaseError } from './error-handler';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'x-client-info': 'learnmate-web'
    }
  }
});

// Helper for safer database operations
export async function safeQuery<T>(
  operation: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  try {
    const { data, error } = await withRetry(() => operation());
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned');
    }
    
    return data;
  } catch (error) {
    handleSupabaseError(error);
  }
}