export interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  chinese_translation: string;
  level: number;
  frequency_rank: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
}

export interface WordSelectionOptions {
  count?: number;
  level?: number;
  excludeIds?: string[];
  randomize?: boolean;
  minFrequencyRank?: number;
  maxFrequencyRank?: number;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface BattleSettings {
  wordCount: number;
  level?: number;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  frequencyRankRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    start?: Date;
    end?: Date;
  };
}

export type PracticeMode = 'guided' | 'speech';
export type DisplayMode = 'en_to_en' | 'zh_to_en' | 'en_to_zh' | 'zh_to_speech' | 'en_to_speech';

export interface PracticeSettings {
  practiceMode: PracticeMode;
  displayMode: DisplayMode;
  battleSettings?: BattleSettings;
}