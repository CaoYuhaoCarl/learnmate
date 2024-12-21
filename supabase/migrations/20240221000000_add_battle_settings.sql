-- Add battle_settings column to user_practice_settings table
ALTER TABLE user_practice_settings
ADD COLUMN IF NOT EXISTS battle_settings JSONB DEFAULT NULL;

-- Update existing rows with default battle settings
UPDATE user_practice_settings
SET battle_settings = jsonb_build_object(
  'wordCount', 10,
  'level', NULL,
  'difficultyLevel', NULL,
  'frequencyRankRange', jsonb_build_object(
    'min', NULL,
    'max', NULL
  ),
  'dateRange', jsonb_build_object(
    'start', NULL,
    'end', NULL
  )
)
WHERE battle_settings IS NULL; 