-- Add unique constraint to assessment_results table to allow upserts
ALTER TABLE public.assessment_results 
ADD CONSTRAINT unique_user_test_type UNIQUE (user_id, test_type);