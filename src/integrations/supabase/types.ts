export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      fitness_plans: {
        Row: {
          ai_tips: string | null
          created_at: string
          diet_plan: Json | null
          id: string
          motivation_quote: string | null
          profile_id: string | null
          user_id: string
          workout_plan: Json | null
        }
        Insert: {
          ai_tips?: string | null
          created_at?: string
          diet_plan?: Json | null
          id?: string
          motivation_quote?: string | null
          profile_id?: string | null
          user_id: string
          workout_plan?: Json | null
        }
        Update: {
          ai_tips?: string | null
          created_at?: string
          diet_plan?: Json | null
          id?: string
          motivation_quote?: string | null
          profile_id?: string | null
          user_id?: string
          workout_plan?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "fitness_plans_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "fitness_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fitness_profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string
          dietary_preference: string | null
          fitness_goal: string | null
          fitness_level: string | null
          full_name: string | null
          gender: string | null
          height_cm: number | null
          id: string
          medical_history: string | null
          profile_name: string
          stress_level: string | null
          updated_at: string
          user_id: string
          weight_kg: number | null
          workout_location: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          dietary_preference?: string | null
          fitness_goal?: string | null
          fitness_level?: string | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          medical_history?: string | null
          profile_name: string
          stress_level?: string | null
          updated_at?: string
          user_id: string
          weight_kg?: number | null
          workout_location?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          dietary_preference?: string | null
          fitness_goal?: string | null
          fitness_level?: string | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          medical_history?: string | null
          profile_name?: string
          stress_level?: string | null
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
          workout_location?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string
          dietary_preference: string | null
          fitness_goal: string | null
          fitness_level: string | null
          full_name: string | null
          gender: string | null
          height_cm: number | null
          id: string
          medical_history: string | null
          stress_level: string | null
          updated_at: string
          user_id: string
          weight_kg: number | null
          workout_location: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          dietary_preference?: string | null
          fitness_goal?: string | null
          fitness_level?: string | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          medical_history?: string | null
          stress_level?: string | null
          updated_at?: string
          user_id: string
          weight_kg?: number | null
          workout_location?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string
          dietary_preference?: string | null
          fitness_goal?: string | null
          fitness_level?: string | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          medical_history?: string | null
          stress_level?: string | null
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
          workout_location?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
