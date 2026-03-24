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
      achievements: {
        Row: {
          created_at: string | null
          criteria: Json | null
          description_en: string | null
          description_hi: string | null
          icon: string | null
          id: string
          name_en: string
          name_hi: string | null
          points_reward: number | null
        }
        Insert: {
          created_at?: string | null
          criteria?: Json | null
          description_en?: string | null
          description_hi?: string | null
          icon?: string | null
          id?: string
          name_en: string
          name_hi?: string | null
          points_reward?: number | null
        }
        Update: {
          created_at?: string | null
          criteria?: Json | null
          description_en?: string | null
          description_hi?: string | null
          icon?: string | null
          id?: string
          name_en?: string
          name_hi?: string | null
          points_reward?: number | null
        }
        Relationships: []
      }
      game_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          current_scene: number | null
          game_id: string
          id: string
          score: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_scene?: number | null
          game_id: string
          id?: string
          score?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_scene?: number | null
          game_id?: string
          id?: string
          score?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_progress_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_scenarios: {
        Row: {
          choices: Json
          correct_choice: number
          created_at: string | null
          explanation_en: string | null
          explanation_hi: string | null
          game_id: string | null
          id: string
          image_url: string | null
          points: number | null
          scene_en: string
          scene_hi: string | null
          scene_number: number
        }
        Insert: {
          choices?: Json
          correct_choice?: number
          created_at?: string | null
          explanation_en?: string | null
          explanation_hi?: string | null
          game_id?: string | null
          id?: string
          image_url?: string | null
          points?: number | null
          scene_en: string
          scene_hi?: string | null
          scene_number: number
        }
        Update: {
          choices?: Json
          correct_choice?: number
          created_at?: string | null
          explanation_en?: string | null
          explanation_hi?: string | null
          game_id?: string | null
          id?: string
          image_url?: string | null
          points?: number | null
          scene_en?: string
          scene_hi?: string | null
          scene_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_scenarios_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          created_at: string | null
          description_en: string | null
          description_hi: string | null
          difficulty: string | null
          game_type: string
          id: string
          is_active: boolean | null
          points_reward: number | null
          thumbnail_url: string | null
          title_en: string
          title_hi: string | null
        }
        Insert: {
          created_at?: string | null
          description_en?: string | null
          description_hi?: string | null
          difficulty?: string | null
          game_type: string
          id?: string
          is_active?: boolean | null
          points_reward?: number | null
          thumbnail_url?: string | null
          title_en: string
          title_hi?: string | null
        }
        Update: {
          created_at?: string | null
          description_en?: string | null
          description_hi?: string | null
          difficulty?: string | null
          game_type?: string
          id?: string
          is_active?: boolean | null
          points_reward?: number | null
          thumbnail_url?: string | null
          title_en?: string
          title_hi?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_body: string | null
          created_at: string
          current_streak: number
          display_name: string
          id: string
          last_activity_date: string | null
          level: number
          longest_streak: number
          points: number
          updated_at: string
        }
        Insert: {
          avatar_body?: string | null
          created_at?: string
          current_streak?: number
          display_name?: string
          id: string
          last_activity_date?: string | null
          level?: number
          longest_streak?: number
          points?: number
          updated_at?: string
        }
        Update: {
          avatar_body?: string | null
          created_at?: string
          current_streak?: number
          display_name?: string
          id?: string
          last_activity_date?: string | null
          level?: number
          longest_streak?: number
          points?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
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
