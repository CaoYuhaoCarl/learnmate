import { supabase } from '@/lib/supabase'
import { VocabularyWord } from '@/lib/types/practice'

export async function getVocabularyWords(
  limit: number = 10,
  level?: number
): Promise<VocabularyWord[]> {
  let query = supabase
    .from('vocabulary_words')
    .select('id, word, definition, chinese_translation, level, frequency_rank')
    .order('frequency_rank', { ascending: true })

  if (level) {
    query = query.eq('level', level)
  }

  const { data, error } = await query.limit(limit)

  if (error) {
    console.error('Error fetching vocabulary words:', error)
    return []
  }

  return data || []
}

export async function addVocabularyWord(word: Omit<VocabularyWord, 'id'>) {
  const { error } = await supabase
    .from('vocabulary_words')
    .insert(word)

  if (error) {
    console.error('Error adding vocabulary word:', error)
    throw error
  }
}

export async function updateVocabularyWord(
  id: string,
  updates: Partial<VocabularyWord>
) {
  const { error } = await supabase
    .from('vocabulary_words')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating vocabulary word:', error)
    throw error
  }
}