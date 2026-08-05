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
      ask_me_history: {
        Row: {
          answer: string
          created_at: string
          id: string
          question: string
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question: string
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question?: string
          user_id?: string
        }
        Relationships: []
      }
      community_bans: {
        Row: {
          banned_by: string
          created_at: string
          id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          banned_by: string
          created_at?: string
          id?: string
          reason?: string | null
          user_id: string
        }
        Update: {
          banned_by?: string
          created_at?: string
          id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      community_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_notifications: {
        Row: {
          actor_id: string
          created_at: string
          id: string
          is_read: boolean
          post_id: string
          reply_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          actor_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          post_id: string
          reply_id?: string | null
          type?: string
          user_id: string
        }
        Update: {
          actor_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          post_id?: string
          reply_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_notifications_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_notifications_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          category: string
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          parent_id: string | null
          updated_at: string
          user_id: string
          voice_url: string | null
        }
        Insert: {
          category: string
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          parent_id?: string | null
          updated_at?: string
          user_id: string
          voice_url?: string | null
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          parent_id?: string | null
          updated_at?: string
          user_id?: string
          voice_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_reports: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reason: string
          reporter_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reason: string
          reporter_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reason?: string
          reporter_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          doctor_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors_public"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_ratings: {
        Row: {
          created_at: string
          doctor_id: string
          id: string
          rating: number
          review: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          id?: string
          rating: number
          review?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          id?: string
          rating?: number
          review?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_ratings_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doctor_ratings_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors_public"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          ai_cv_review: string | null
          bio: string | null
          created_at: string
          cv_url: string | null
          id: string
          is_verified: boolean | null
          portfolio_url: string | null
          rating: number | null
          rating_count: number | null
          specialty: string
          updated_at: string
          user_id: string
          verification_status: string | null
        }
        Insert: {
          ai_cv_review?: string | null
          bio?: string | null
          created_at?: string
          cv_url?: string | null
          id?: string
          is_verified?: boolean | null
          portfolio_url?: string | null
          rating?: number | null
          rating_count?: number | null
          specialty: string
          updated_at?: string
          user_id: string
          verification_status?: string | null
        }
        Update: {
          ai_cv_review?: string | null
          bio?: string | null
          created_at?: string
          cv_url?: string | null
          id?: string
          is_verified?: boolean | null
          portfolio_url?: string | null
          rating?: number | null
          rating_count?: number | null
          specialty?: string
          updated_at?: string
          user_id?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      gym_food_logs: {
        Row: {
          ai_notes: string | null
          calories: number | null
          carbs: number | null
          created_at: string
          fats: number | null
          id: string
          ingredients: string | null
          name: string
          protein: number | null
          quantity_grams: number | null
          risk_level: string | null
          risk_reason: string | null
          source: string
          user_id: string
        }
        Insert: {
          ai_notes?: string | null
          calories?: number | null
          carbs?: number | null
          created_at?: string
          fats?: number | null
          id?: string
          ingredients?: string | null
          name: string
          protein?: number | null
          quantity_grams?: number | null
          risk_level?: string | null
          risk_reason?: string | null
          source?: string
          user_id: string
        }
        Update: {
          ai_notes?: string | null
          calories?: number | null
          carbs?: number | null
          created_at?: string
          fats?: number | null
          id?: string
          ingredients?: string | null
          name?: string
          protein?: number | null
          quantity_grams?: number | null
          risk_level?: string | null
          risk_reason?: string | null
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      gym_nutrition_goals: {
        Row: {
          calories: number | null
          carbs: number | null
          created_at: string
          fats: number | null
          goal: string | null
          id: string
          protein: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          created_at?: string
          fats?: number | null
          goal?: string | null
          id?: string
          protein?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          created_at?: string
          fats?: number | null
          goal?: string | null
          id?: string
          protein?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gym_user_program: {
        Row: {
          created_at: string
          id: string
          program_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          program_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          program_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gym_video_analyses: {
        Row: {
          analysis: string | null
          created_at: string
          exercise_name: string
          id: string
          user_id: string
          video_path: string | null
        }
        Insert: {
          analysis?: string | null
          created_at?: string
          exercise_name: string
          id?: string
          user_id: string
          video_path?: string | null
        }
        Update: {
          analysis?: string | null
          created_at?: string
          exercise_name?: string
          id?: string
          user_id?: string
          video_path?: string | null
        }
        Relationships: []
      }
      gym_workout_logs: {
        Row: {
          completed: boolean
          created_at: string
          day_key: string
          exercise_name: string
          id: string
          log_date: string
          program_key: string
          reps: number | null
          sets: number | null
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          completed?: boolean
          created_at?: string
          day_key: string
          exercise_name: string
          id?: string
          log_date?: string
          program_key: string
          reps?: number | null
          sets?: number | null
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          completed?: boolean
          created_at?: string
          day_key?: string
          exercise_name?: string
          id?: string
          log_date?: string
          program_key?: string
          reps?: number | null
          sets?: number | null
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string
          file_type: string | null
          file_url: string | null
          flag_reason: string | null
          id: string
          is_flagged: boolean | null
          sender_id: string
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string
          file_type?: string | null
          file_url?: string | null
          flag_reason?: string | null
          id?: string
          is_flagged?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string
          file_type?: string | null
          file_url?: string | null
          flag_reason?: string | null
          id?: string
          is_flagged?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_visits: {
        Row: {
          id: string
          visited_at: string
          visitor_hash: string | null
        }
        Insert: {
          id?: string
          visited_at?: string
          visitor_hash?: string | null
        }
        Update: {
          id?: string
          visited_at?: string
          visitor_hash?: string | null
        }
        Relationships: []
      }
      user_diet_plans: {
        Row: {
          activity_level: string
          age: number
          bmi: number | null
          bmr: number | null
          calories: number | null
          carbs: number | null
          created_at: string
          diet_plan: Json | null
          fats: number | null
          gender: string
          goal: string
          height: number
          id: string
          predicted_weight: number | null
          protein: number | null
          user_id: string
          weight: number
        }
        Insert: {
          activity_level: string
          age: number
          bmi?: number | null
          bmr?: number | null
          calories?: number | null
          carbs?: number | null
          created_at?: string
          diet_plan?: Json | null
          fats?: number | null
          gender: string
          goal: string
          height: number
          id?: string
          predicted_weight?: number | null
          protein?: number | null
          user_id: string
          weight: number
        }
        Update: {
          activity_level?: string
          age?: number
          bmi?: number | null
          bmr?: number | null
          calories?: number | null
          carbs?: number | null
          created_at?: string
          diet_plan?: Json | null
          fats?: number | null
          gender?: string
          goal?: string
          height?: number
          id?: string
          predicted_weight?: number | null
          protein?: number | null
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      user_diseases: {
        Row: {
          created_at: string
          diagnosed_at: string | null
          id: string
          name: string
          notes: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          diagnosed_at?: string | null
          id?: string
          name: string
          notes?: string | null
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          diagnosed_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_medications: {
        Row: {
          created_at: string
          disease_id: string | null
          dosage: string
          frequency: string
          id: string
          name: string
          reminder_enabled: boolean | null
          time: string
          user_id: string
        }
        Insert: {
          created_at?: string
          disease_id?: string | null
          dosage: string
          frequency: string
          id?: string
          name: string
          reminder_enabled?: boolean | null
          time: string
          user_id: string
        }
        Update: {
          created_at?: string
          disease_id?: string | null
          dosage?: string
          frequency?: string
          id?: string
          name?: string
          reminder_enabled?: boolean | null
          time?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_medications_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "user_diseases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_personality_results: {
        Row: {
          ai_analysis: string | null
          category_scores: Json | null
          created_at: string
          id: string
          level: string
          score: number
          suggested_diseases: Json | null
          user_id: string
        }
        Insert: {
          ai_analysis?: string | null
          category_scores?: Json | null
          created_at?: string
          id?: string
          level: string
          score: number
          suggested_diseases?: Json | null
          user_id: string
        }
        Update: {
          ai_analysis?: string | null
          category_scores?: Json | null
          created_at?: string
          id?: string
          level?: string
          score?: number
          suggested_diseases?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      doctors_public: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string | null
          is_verified: boolean | null
          rating: number | null
          rating_count: number | null
          specialty: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string | null
          is_verified?: boolean | null
          rating?: number | null
          rating_count?: number | null
          specialty?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string | null
          is_verified?: boolean | null
          rating?: number | null
          rating_count?: number | null
          specialty?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles_public: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_community_stats: { Args: never; Returns: Json }
      get_doctors_public: {
        Args: never
        Returns: {
          bio: string
          created_at: string
          id: string
          is_verified: boolean
          rating: number
          rating_count: number
          specialty: string
          updated_at: string
          user_id: string
        }[]
      }
      get_profile_public: {
        Args: { profile_user_id: string }
        Returns: {
          avatar_url: string
          created_at: string
          full_name: string
          id: string
          updated_at: string
          user_id: string
        }[]
      }
      get_registered_users: {
        Args: never
        Returns: {
          created_at: string
          email: string
          full_name: string
          last_sign_in_at: string
          roles: string[]
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_user_banned: { Args: { _user_id: string }; Returns: boolean }
      request_doctor_role: { Args: { p_user_id: string }; Returns: boolean }
    }
    Enums: {
      user_role: "user" | "doctor" | "admin"
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
    Enums: {
      user_role: ["user", "doctor", "admin"],
    },
  },
} as const
