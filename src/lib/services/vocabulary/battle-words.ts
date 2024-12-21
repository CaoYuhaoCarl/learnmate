import { VocabularyWord } from './types';
import { getRandomVocabularyWords } from './word-selection';

export async function getBattleWords(count: number): Promise<VocabularyWord[]> {
  // Get random words for the battle
  const words = await getRandomVocabularyWords({
    count,
    randomize: true
  });

  // Ensure we have enough words
  if (words.length < count) {
    throw new Error(`Not enough vocabulary words available. Needed ${count}, got ${words.length}`);
  }

  return words;
}

export function generateWordOptions(
  word: VocabularyWord,
  allWords: VocabularyWord[],
  optionCount: number = 4
): string[] {
  const correctAnswer = word.definition;
  const otherWords = allWords.filter(w => w.id !== word.id);
  const options = new Set<string>([correctAnswer]);
  
  // Add random incorrect options
  while (options.size < optionCount && otherWords.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherWords.length);
    options.add(otherWords[randomIndex].definition);
    otherWords.splice(randomIndex, 1);
  }
  
  // Shuffle options
  return Array.from(options).sort(() => Math.random() - 0.5);
}

export function prepareBattleWord(
  word: VocabularyWord,
  allWords: VocabularyWord[]
): VocabularyWord & { options: string[] } {
  return {
    ...word,
    options: generateWordOptions(word, allWords)
  };
}