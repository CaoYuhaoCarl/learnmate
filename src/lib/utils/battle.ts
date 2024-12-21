import { VocabularyWord } from '@/lib/types/practice'

// Battle game constants
export const BATTLE_CONFIG = {
  TOTAL_ROUNDS: 10,
  TIME_PER_ROUND: 10,
  STREAK_THRESHOLD: 3,
  ANSWER_DELAY: 1000,
  FRAGMENTS: {
    BASE_REWARD: 1,
    STREAK_3_BONUS: 2,
    STREAK_5_BONUS: 5,
    STREAK_10_BONUS: 10
  }
} as const

// Generate options for a word
export function generateWordOptions(
  word: VocabularyWord,
  allWords: VocabularyWord[]
): string[] {
  const correctAnswer = word.definition
  const otherWords = allWords.filter(w => w.id !== word.id)
  const options = new Set<string>([correctAnswer])
  
  // Add random incorrect options
  while (options.size < 4 && otherWords.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherWords.length)
    options.add(otherWords[randomIndex].definition)
    otherWords.splice(randomIndex, 1)
  }
  
  // Shuffle options
  return Array.from(options).sort(() => Math.random() - 0.5)
}

// Prepare word for battle with options
export function prepareBattleWord(
  word: VocabularyWord,
  allWords: VocabularyWord[]
) {
  return {
    ...word,
    options: generateWordOptions(word, allWords)
  }
}