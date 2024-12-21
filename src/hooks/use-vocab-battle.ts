import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './use-auth'
import { BATTLE_CONFIG, prepareBattleWord } from '@/lib/utils/battle'
import { 
  calculateScore,
  calculateFragmentReward,
  handleCorrectAnswer,
  handleWrongAnswer,
  generateAIScore
} from '@/lib/utils/battle-scoring'
import { saveBattleHistory } from '@/lib/services/battle'
import { addKnowledgeFragments } from '@/lib/services/fragments'
import { PracticeSettings, VocabularyWord } from '@/lib/types/practice'
import { getRandomVocabularyWords } from '@/lib/services/vocabulary/word-selection'
import { User } from '@supabase/supabase-js'

interface BattleWord extends VocabularyWord {
  options: string[]
}

export function useVocabBattle(settings: PracticeSettings) {
  const { user } = useAuth() as { user: User | null }
  const [words, setWords] = useState<BattleWord[]>([])
  const [round, setRound] = useState(1)
  const [playerScore, setPlayerScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number>(BATTLE_CONFIG.TIME_PER_ROUND)
  const [currentWord, setCurrentWord] = useState<BattleWord | null>(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [startTime, setStartTime] = useState(Date.now())
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const handleGameOver = useCallback(async () => {
    if (!user?.id) return;
    console.log('Handling game over:', { playerScore, opponentScore, correctAnswers });
    
    setIsGameOver(true);
    const totalRounds = settings.battleSettings?.wordCount || BATTLE_CONFIG.TOTAL_ROUNDS;

    try {
      await saveBattleHistory({
        user_id: user.id,
        score: playerScore,
        opponent_score: opponentScore,
        accuracy: Math.round((correctAnswers / totalRounds) * 100),
        max_streak: maxStreak,
        time_taken: Math.round((Date.now() - startTime) / 1000)
      });
      console.log('Battle results saved successfully');
    } catch (error) {
      console.error('Error saving battle results:', error);
    }
  }, [user, playerScore, opponentScore, correctAnswers, maxStreak, startTime, settings]);

  const advanceRound = useCallback(() => {
    const totalRounds = settings.battleSettings?.wordCount || BATTLE_CONFIG.TOTAL_ROUNDS;
    console.log('Advancing round:', { round, totalRounds });

    if (round >= totalRounds) {
      console.log('Game over condition met');
      handleGameOver();
      return;
    }

    setRound(prev => prev + 1);
    setTimeLeft(BATTLE_CONFIG.TIME_PER_ROUND);
    setCurrentWord(words[round]);
  }, [round, words, settings, handleGameOver]);

  const handleTimeOut = useCallback(() => {
    if (!isGameOver) {
      handleWrongAnswer();
      setStreak(0);
      setTimeout(advanceRound, BATTLE_CONFIG.ANSWER_DELAY);
    }
  }, [isGameOver, advanceRound]);

  // Timer effect
  useEffect(() => {
    if (isGameOver || !currentWord) return;

    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentWord, isGameOver]);

  // Handle time running out
  useEffect(() => {
    if (timeLeft === 0) {
      handleTimeOut();
    }
  }, [timeLeft, handleTimeOut]);

  const checkAnswer = useCallback(async (answer: string) => {
    if (!currentWord || !user?.id) return;

    const isCorrect = answer === currentWord.definition;
    const roundScore = calculateScore(isCorrect, timeLeft);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(prev => Math.max(prev, newStreak));
      setPlayerScore(prev => prev + roundScore);
      setCorrectAnswers(prev => prev + 1);
      handleCorrectAnswer(newStreak);

      // Award fragments based on streak
      const fragmentReward = calculateFragmentReward(newStreak);
      await addKnowledgeFragments(user.id, fragmentReward, 'battle');
    } else {
      setStreak(0);
      handleWrongAnswer();
    }

    // Simulate opponent
    const aiScore = generateAIScore();
    setOpponentScore(prev => prev + aiScore);

    setTimeout(advanceRound, BATTLE_CONFIG.ANSWER_DELAY);
  }, [currentWord, user, streak, timeLeft, advanceRound]);

  const initBattle = useCallback(async () => {
    setLoading(true);
    try {
      const battleSettings = settings.battleSettings || {
        wordCount: BATTLE_CONFIG.TOTAL_ROUNDS
      };

      const vocabWords = await getRandomVocabularyWords({
        count: battleSettings.wordCount,
        level: battleSettings.level,
        difficultyLevel: battleSettings.difficultyLevel,
        minFrequencyRank: battleSettings.frequencyRankRange?.min,
        maxFrequencyRank: battleSettings.frequencyRankRange?.max,
        createdAfter: battleSettings.dateRange?.start,
        createdBefore: battleSettings.dateRange?.end,
        randomize: true
      });

      const battleWords = vocabWords.map((word: VocabularyWord) => 
        prepareBattleWord(word, vocabWords)
      );

      setWords(battleWords);
      setCurrentWord(battleWords[0]);
      setRound(1);
      setPlayerScore(0);
      setOpponentScore(0);
      setTimeLeft(BATTLE_CONFIG.TIME_PER_ROUND);
      setIsGameOver(false);
      setStreak(0);
      setMaxStreak(0);
      setStartTime(Date.now());
      setCorrectAnswers(0);
    } catch (error) {
      console.error('Error initializing battle:', error);
    } finally {
      setLoading(false);
    }
  }, [settings]);

  // Initial setup
  useEffect(() => {
    initBattle();
  }, [initBattle]);

  return {
    currentWord,
    round,
    totalRounds: settings.battleSettings?.wordCount || BATTLE_CONFIG.TOTAL_ROUNDS,
    playerScore,
    opponentScore,
    timeLeft,
    checkAnswer,
    isGameOver,
    loading,
    streak,
    correctAnswers,
    maxStreak,
    resetBattle: initBattle
  };
}