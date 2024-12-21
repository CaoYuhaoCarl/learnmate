import { supabase } from '@/lib/supabase'
import { retryWithBackoff } from '@/lib/supabase/retry'

export async function addKnowledgeFragments(
  userId: string,
  amount: number,
  source: string
): Promise<void> {
  if (!userId || amount <= 0) return

  try {
    // Ensure amount is an integer
    const intAmount = Math.round(amount)
    
    const { error } = await retryWithBackoff(() => 
      supabase
        .from('knowledge_fragments')
        .insert({
          user_id: userId,
          amount: intAmount,
          source
        })
    )

    if (error) throw error
  } catch (error) {
    console.error('Error adding knowledge fragments:', error)
  }
}

export async function getTotalFragments(userId: string): Promise<number> {
  if (!userId) return 0
  
  try {
    const { data, error } = await retryWithBackoff(() =>
      supabase
        .from('user_total_fragments')
        .select('total_fragments')
        .eq('user_id', userId)
        .maybeSingle()
    )

    if (error) throw error
    
    // Ensure we return an integer
    return Math.round(data?.total_fragments || 0)
  } catch (error) {
    console.error('Error getting total fragments:', error)
    throw error // Let the hook handle the error
  }
}