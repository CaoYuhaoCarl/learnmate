import { supabase, safeQuery } from '@/lib/supabase/client';

export interface UserSettings {
  avatar_style: string;
  nickname: string;
}

export async function getUserSettings(userId: string): Promise<UserSettings> {
  return safeQuery(() =>
    supabase
      .from('user_avatar_settings')
      .select('avatar_style, nickname')
      .eq('user_id', userId)
      .single()
  );
}

export async function updateUserSettings(
  userId: string,
  updates: Partial<UserSettings>
): Promise<void> {
  await safeQuery(() =>
    supabase
      .from('user_avatar_settings')
      .update(updates)
      .eq('user_id', userId)
  );
}