export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  age: number | null;
  gender: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  fitness_goal: string | null;
  fitness_level: string | null;
  workout_location: string | null;
  dietary_preference: string | null;
  medical_history: string | null;
  stress_level: string | null;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  description: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
  duration: string;
}

export interface WorkoutPlan {
  weekly_schedule: WorkoutDay[];
  warm_up: string[];
  cool_down: string[];
}

export interface FoodItem {
  name: string;
  portion: string;
  calories: number;
}

export interface Meal {
  meal: string;
  time: string;
  foods: FoodItem[];
}

export interface DietPlan {
  daily_calories: number;
  macros: {
    protein: string;
    carbs: string;
    fats: string;
  };
  meals: Meal[];
  hydration: string;
}

export interface FitnessPlan {
  id?: string;
  user_id?: string;
  profile_id?: string;
  workout_plan: WorkoutPlan;
  diet_plan: DietPlan;
  ai_tips: string;
  motivation_quote: string;
  created_at?: string;
}

export interface FitnessProfile {
  id: string;
  user_id: string;
  profile_name: string;
  avatar_url?: string;
  full_name?: string;
  age?: number;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  fitness_goal?: string;
  fitness_level?: string;
  workout_location?: string;
  dietary_preference?: string;
  medical_history?: string;
  stress_level?: string;
  created_at: string;
  updated_at: string;
}
