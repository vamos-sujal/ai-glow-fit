-- Create fitness_profiles table for multiple profiles per user
CREATE TABLE public.fitness_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_name TEXT NOT NULL,
  avatar_url TEXT,
  full_name TEXT,
  age INTEGER,
  gender TEXT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  fitness_goal TEXT,
  fitness_level TEXT,
  workout_location TEXT,
  dietary_preference TEXT,
  medical_history TEXT,
  stress_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fitness_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own fitness profiles"
  ON public.fitness_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own fitness profiles"
  ON public.fitness_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fitness profiles"
  ON public.fitness_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fitness profiles"
  ON public.fitness_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Add profile_id to fitness_plans to link plans to specific profiles
ALTER TABLE public.fitness_plans ADD COLUMN profile_id UUID REFERENCES public.fitness_profiles(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX idx_fitness_profiles_user_id ON public.fitness_profiles(user_id);
CREATE INDEX idx_fitness_plans_profile_id ON public.fitness_plans(profile_id);

-- Update trigger for fitness_profiles
CREATE TRIGGER update_fitness_profiles_updated_at
  BEFORE UPDATE ON public.fitness_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();