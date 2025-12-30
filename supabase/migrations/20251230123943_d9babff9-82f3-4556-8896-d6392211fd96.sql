-- Add is_grand_prize column to prizes table
ALTER TABLE public.prizes ADD COLUMN is_grand_prize boolean DEFAULT false;