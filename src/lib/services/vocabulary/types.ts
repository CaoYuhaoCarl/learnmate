export interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  chinese_translation: string;
  level: number;
  frequency_rank: number;
}

export interface WordSelectionOptions {
  count?: number;
  level?: number;
  excludeIds?: string[];
  randomize?: boolean;
}