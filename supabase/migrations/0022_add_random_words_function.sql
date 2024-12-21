-- Create function to get random words
CREATE OR REPLACE FUNCTION get_random_words(
  p_count integer,
  p_level integer DEFAULT NULL,
  p_exclude_ids uuid[] DEFAULT '{}'::uuid[]
)
RETURNS SETOF vocabulary_words
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH random_words AS (
    SELECT *
    FROM vocabulary_words
    WHERE (p_level IS NULL OR level = p_level)
      AND (p_exclude_ids = '{}'::uuid[] OR id != ALL(p_exclude_ids))
    ORDER BY random()
    LIMIT p_count
  )
  SELECT * FROM random_words;
END;
$$; 