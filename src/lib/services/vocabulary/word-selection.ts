import { supabase } from '@/lib/supabase/client';
import { VocabularyWord, WordSelectionOptions } from '@/lib/types/practice';

export async function getRandomVocabularyWords(
  options: WordSelectionOptions = {}
): Promise<VocabularyWord[]> {
  const {
    count = 10,
    level,
    excludeIds = [],
    randomize = true,
    minFrequencyRank,
    maxFrequencyRank,
    difficultyLevel,
    createdAfter,
    createdBefore
  } = options;

  try {
    let query = supabase
      .from('vocabulary_words')
      .select('id, word, definition, chinese_translation, level, frequency_rank, difficulty_level');

    // Apply filters
    if (level) {
      query = query.eq('level', level);
    }

    if (excludeIds.length > 0) {
      query = query.not('id', 'in', excludeIds);
    }

    if (difficultyLevel) {
      query = query.eq('difficulty_level', difficultyLevel);
    }

    if (minFrequencyRank !== undefined) {
      query = query.gte('frequency_rank', minFrequencyRank);
    }

    if (maxFrequencyRank !== undefined) {
      query = query.lte('frequency_rank', maxFrequencyRank);
    }

    if (createdAfter) {
      query = query.gte('created_at', createdAfter.toISOString());
    }

    if (createdBefore) {
      query = query.lte('created_at', createdBefore.toISOString());
    }

    if (!randomize) {
      const { data, error } = await query
        .order('frequency_rank', { ascending: true })
        .limit(count);

      if (error) {
        console.error('Database query error:', error);
        throw error;
      }
      
      if (!data || !Array.isArray(data)) {
        console.error('Invalid data format received');
        return [];
      }

      return data;
    }

    // For random selection, get a larger pool of words
    const { data, error } = await query.limit(1000);

    if (error) {
      console.error('Database query error:', error);
      throw error;
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error('No vocabulary words found or invalid data format');
      return [];
    }

    // Shuffle the array using Fisher-Yates algorithm
    const shuffled = [...data];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Return the first 'count' words
    return shuffled.slice(0, Math.min(count, shuffled.length));
  } catch (error) {
    console.error('Error fetching vocabulary words:', error);
    throw error;
  }
}

export async function getWordsByLevel(level: number): Promise<VocabularyWord[]> {
  try {
    const { data, error } = await supabase
      .from('vocabulary_words')
      .select('id, word, definition, chinese_translation, level, frequency_rank, difficulty_level')
      .eq('level', level)
      .order('frequency_rank', { ascending: true });

    if (error) {
      console.error('Database query error:', error);
      throw error;
    }

    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format received');
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching words by level:', error);
    throw error;
  }
}

export async function getWordsByFrequencyRange(
  minRank: number,
  maxRank: number
): Promise<VocabularyWord[]> {
  try {
    const { data, error } = await supabase
      .from('vocabulary_words')
      .select('id, word, definition, chinese_translation, level, frequency_rank, difficulty_level')
      .gte('frequency_rank', minRank)
      .lte('frequency_rank', maxRank)
      .order('frequency_rank', { ascending: true });

    if (error) {
      console.error('Database query error:', error);
      throw error;
    }

    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format received');
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching words by frequency range:', error);
    throw error;
  }
}