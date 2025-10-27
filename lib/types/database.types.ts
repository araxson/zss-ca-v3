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
      audit_log: {
        Row: {
          action: string
          actor_profile_id: string | null
          change_summary: Json
          created_at: string
          id: number
          ip_address: unknown
          profile_id: string | null
          resource_id: string | null
          resource_table: string
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_profile_id?: string | null
          change_summary?: Json
          created_at?: string
          id?: number
          ip_address?: unknown
          profile_id?: string | null
          resource_id?: string | null
          resource_table: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_profile_id?: string | null
          change_summary?: Json
          created_at?: string
          id?: number
          ip_address?: unknown
          profile_id?: string | null
          resource_id?: string | null
          resource_table?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_fk"
            columns: ["actor_profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_profile_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      client_site: {
        Row: {
          created_at: string
          custom_domain: string | null
          deleted_at: string | null
          deployed_at: string | null
          deployment_notes: string | null
          deployment_url: string | null
          design_brief: Json
          id: string
          last_revision_at: string | null
          plan_id: string | null
          profile_id: string
          site_name: string
          slug: string | null
          status: Database["public"]["Enums"]["site_status"]
          subscription_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_domain?: string | null
          deleted_at?: string | null
          deployed_at?: string | null
          deployment_notes?: string | null
          deployment_url?: string | null
          design_brief?: Json
          id?: string
          last_revision_at?: string | null
          plan_id?: string | null
          profile_id: string
          site_name: string
          slug?: string | null
          status?: Database["public"]["Enums"]["site_status"]
          subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_domain?: string | null
          deleted_at?: string | null
          deployed_at?: string | null
          deployment_notes?: string | null
          deployment_url?: string | null
          design_brief?: Json
          id?: string
          last_revision_at?: string | null
          plan_id?: string | null
          profile_id?: string
          site_name?: string
          slug?: string | null
          status?: Database["public"]["Enums"]["site_status"]
          subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_site_plan_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_site_profile_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_site_subscription_fk"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscription"
            referencedColumns: ["id"]
          },
        ]
      }
      notification: {
        Row: {
          action_url: string | null
          body: string | null
          created_at: string
          expires_at: string | null
          id: string
          metadata: Json
          notification_type: Database["public"]["Enums"]["notification_type"]
          profile_id: string
          read_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          action_url?: string | null
          body?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          metadata?: Json
          notification_type: Database["public"]["Enums"]["notification_type"]
          profile_id: string
          read_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          action_url?: string | null
          body?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          metadata?: Json
          notification_type?: Database["public"]["Enums"]["notification_type"]
          profile_id?: string
          read_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_profile_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_verification: {
        Row: {
          attempts: number | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          otp_code: string
          profile_id: string | null
          updated_at: string | null
          verification_type: string
          verified_at: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          otp_code: string
          profile_id?: string | null
          updated_at?: string | null
          verification_type: string
          verified_at?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          otp_code?: string
          profile_id?: string | null
          updated_at?: string | null
          verification_type?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "otp_verification_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      plan: {
        Row: {
          created_at: string
          currency_code: string
          description: string | null
          features: Json
          id: string
          is_active: boolean
          name: string
          page_limit: number | null
          revision_limit: number | null
          setup_fee_cents: number | null
          slug: string
          sort_order: number
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          name: string
          page_limit?: number | null
          revision_limit?: number | null
          setup_fee_cents?: number | null
          slug: string
          sort_order?: number
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          name?: string
          page_limit?: number | null
          revision_limit?: number | null
          setup_fee_cents?: number | null
          slug?: string
          sort_order?: number
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          company_name: string | null
          company_website: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          country: string | null
          created_at: string
          deleted_at: string | null
          id: string
          marketing_opt_in: boolean
          onboarding_notes: string | null
          postal_code: string | null
          region: string | null
          role: Database["public"]["Enums"]["user_role"]
          stripe_customer_id: string | null
          updated_at: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name?: string | null
          company_website?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          id: string
          marketing_opt_in?: boolean
          onboarding_notes?: string | null
          postal_code?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name?: string | null
          company_website?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          marketing_opt_in?: boolean
          onboarding_notes?: string | null
          postal_code?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_analytics: {
        Row: {
          client_site_id: string
          conversions: number
          created_at: string
          id: number
          metadata: Json
          metric_date: string
          page_views: number
          unique_visitors: number
          updated_at: string
        }
        Insert: {
          client_site_id: string
          conversions?: number
          created_at?: string
          id?: number
          metadata?: Json
          metric_date: string
          page_views?: number
          unique_visitors?: number
          updated_at?: string
        }
        Update: {
          client_site_id?: string
          conversions?: number
          created_at?: string
          id?: number
          metadata?: Json
          metric_date?: string
          page_views?: number
          unique_visitors?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_analytics_site_fk"
            columns: ["client_site_id"]
            isOneToOne: false
            referencedRelation: "client_site"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription: {
        Row: {
          billing_reason: string | null
          cancel_at: string | null
          cancel_at_period_end: boolean
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          deleted_at: string | null
          id: string
          metadata: Json
          plan_id: string
          profile_id: string
          renewal_behavior: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id: string | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string
        }
        Insert: {
          billing_reason?: string | null
          cancel_at?: string | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          deleted_at?: string | null
          id?: string
          metadata?: Json
          plan_id: string
          profile_id: string
          renewal_behavior?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
        }
        Update: {
          billing_reason?: string | null
          cancel_at?: string | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          deleted_at?: string | null
          id?: string
          metadata?: Json
          plan_id?: string
          profile_id?: string
          renewal_behavior?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_plan_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_profile_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      support_ticket: {
        Row: {
          assigned_to_profile_id: string | null
          category: Database["public"]["Enums"]["ticket_category"]
          client_site_id: string | null
          closed_at: string | null
          created_at: string
          created_by_profile_id: string
          id: string
          last_reply_at: string | null
          message: string
          metadata: Json
          priority: Database["public"]["Enums"]["ticket_priority"]
          profile_id: string
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          subscription_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_to_profile_id?: string | null
          category?: Database["public"]["Enums"]["ticket_category"]
          client_site_id?: string | null
          closed_at?: string | null
          created_at?: string
          created_by_profile_id: string
          id?: string
          last_reply_at?: string | null
          message: string
          metadata?: Json
          priority?: Database["public"]["Enums"]["ticket_priority"]
          profile_id: string
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to_profile_id?: string | null
          category?: Database["public"]["Enums"]["ticket_category"]
          client_site_id?: string | null
          closed_at?: string | null
          created_at?: string
          created_by_profile_id?: string
          id?: string
          last_reply_at?: string | null
          message?: string
          metadata?: Json
          priority?: Database["public"]["Enums"]["ticket_priority"]
          profile_id?: string
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_assignee_fk"
            columns: ["assigned_to_profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_ticket_creator_fk"
            columns: ["created_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_ticket_profile_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_ticket_site_fk"
            columns: ["client_site_id"]
            isOneToOne: false
            referencedRelation: "client_site"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_ticket_subscription_fk"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscription"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_reply: {
        Row: {
          author_profile_id: string
          created_at: string
          id: string
          is_internal: boolean
          message: string
          support_ticket_id: string
          updated_at: string
        }
        Insert: {
          author_profile_id: string
          created_at?: string
          id?: string
          is_internal?: boolean
          message: string
          support_ticket_id: string
          updated_at?: string
        }
        Update: {
          author_profile_id?: string
          created_at?: string
          id?: string
          is_internal?: boolean
          message?: string
          support_ticket_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_reply_author_fk"
            columns: ["author_profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_reply_ticket_fk"
            columns: ["support_ticket_id"]
            isOneToOne: false
            referencedRelation: "support_ticket"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vw_database_health: {
        Row: {
          category: string | null
          value: string | null
        }
        Relationships: []
      }
      vw_foreign_keys: {
        Row: {
          delete_rule: string | null
          from_column: unknown
          from_table: unknown
          table_schema: unknown
          to_column: unknown
          to_table: unknown
          update_rule: string | null
        }
        Relationships: []
      }
      vw_index_usage: {
        Row: {
          index_size: string | null
          indexname: unknown
          scans: number | null
          schemaname: unknown
          tablename: unknown
          tuples_fetched: number | null
          tuples_read: number | null
          usage_category: string | null
        }
        Relationships: []
      }
      vw_rls_coverage: {
        Row: {
          policies: unknown[] | null
          policy_count: number | null
          rls_enabled: boolean | null
          status: string | null
          tablename: unknown
        }
        Relationships: []
      }
      vw_table_stats: {
        Row: {
          dead_row_percent: number | null
          dead_rows: number | null
          indexes_size: string | null
          last_analyze: string | null
          last_autoanalyze: string | null
          last_autovacuum: string | null
          last_vacuum: string | null
          live_rows: number | null
          schemaname: unknown
          table_size: string | null
          tablename: unknown
          total_size: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_otp_codes: { Args: Record<string, never>; Returns: undefined }
      generate_otp_code: { Args: { length?: number }; Returns: string }
      verify_otp: {
        Args: {
          p_email: string
          p_otp_code: string
          p_verification_type: string
        }
        Returns: Json
      }
    }
    Enums: {
      notification_type:
        | "subscription"
        | "billing"
        | "support"
        | "site_status"
        | "system"
        | "onboarding"
      site_status:
        | "pending"
        | "in_production"
        | "awaiting_client_content"
        | "ready_for_review"
        | "live"
        | "paused"
        | "archived"
      subscription_status:
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "incomplete"
        | "unpaid"
      ticket_category:
        | "technical"
        | "content_change"
        | "general_inquiry"
        | "billing"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status:
        | "open"
        | "in_progress"
        | "awaiting_client"
        | "resolved"
        | "closed"
      user_role: "admin" | "client"
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
      notification_type: [
        "subscription",
        "billing",
        "support",
        "site_status",
        "system",
        "onboarding",
      ],
      site_status: [
        "pending",
        "in_production",
        "awaiting_client_content",
        "ready_for_review",
        "live",
        "paused",
        "archived",
      ],
      subscription_status: [
        "trialing",
        "active",
        "past_due",
        "canceled",
        "incomplete",
        "unpaid",
      ],
      ticket_category: [
        "technical",
        "content_change",
        "general_inquiry",
        "billing",
      ],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: [
        "open",
        "in_progress",
        "awaiting_client",
        "resolved",
        "closed",
      ],
      user_role: ["admin", "client"],
    },
  },
} as const