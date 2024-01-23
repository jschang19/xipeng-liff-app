export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      booth: {
        Row: {
          description: string | null
          id: string
          image_url: string | null
          is_for_speaker: boolean
          link: string | null
          name: string
          particapant_num: number
          points: number
          type: Database["public"]["Enums"]["booth_type"] | null
        }
        Insert: {
          description?: string | null
          id?: string
          image_url?: string | null
          is_for_speaker?: boolean
          link?: string | null
          name: string
          particapant_num?: number
          points?: number
          type?: Database["public"]["Enums"]["booth_type"] | null
        }
        Update: {
          description?: string | null
          id?: string
          image_url?: string | null
          is_for_speaker?: boolean
          link?: string | null
          name?: string
          particapant_num?: number
          points?: number
          type?: Database["public"]["Enums"]["booth_type"] | null
        }
        Relationships: []
      }
      booth_staff: {
        Row: {
          booth_id: string
          user_id: string
        }
        Insert: {
          booth_id: string
          user_id: string
        }
        Update: {
          booth_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booth_staff_booth_id_fkey"
            columns: ["booth_id"]
            isOneToOne: false
            referencedRelation: "booth"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booth_staff_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      coupon: {
        Row: {
          created_at: string
          default_num: number
          description: string
          expire_at: string
          id: string
          issued_num: number
          quantity: number
          store_id: string
        }
        Insert: {
          created_at?: string
          default_num?: number
          description: string
          expire_at: string
          id?: string
          issued_num?: number
          quantity?: number
          store_id: string
        }
        Update: {
          created_at?: string
          default_num?: number
          description?: string
          expire_at?: string
          id?: string
          issued_num?: number
          quantity?: number
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store"
            referencedColumns: ["id"]
          }
        ]
      }
      event: {
        Row: {
          created_at: string
          description: string
          end_at: string
          id: string
          place: string
          start_at: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          end_at: string
          id?: string
          place: string
          start_at: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          end_at?: string
          id?: string
          place?: string
          start_at?: string
          title?: string
        }
        Relationships: []
      }
      event_speaker: {
        Row: {
          created_at: string
          event_id: string
          speaker_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          speaker_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          speaker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_speaker_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_speaker_speaker_id_fkey"
            columns: ["speaker_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      google_form_speaker: {
        Row: {
          email: string
          id: number
          major: string
          name: string
          phone: string
          registered_at: string | null
          university: string
        }
        Insert: {
          email: string
          id?: number
          major: string
          name: string
          phone: string
          registered_at?: string | null
          university: string
        }
        Update: {
          email?: string
          id?: number
          major?: string
          name?: string
          phone?: string
          registered_at?: string | null
          university?: string
        }
        Relationships: []
      }
      speaker_profile: {
        Row: {
          bio: string | null
          display_name: string | null
          grade: string | null
          major_name: string | null
          university_name: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          display_name?: string | null
          grade?: string | null
          major_name?: string | null
          university_name?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          display_name?: string | null
          grade?: string | null
          major_name?: string | null
          university_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "speaker_profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      stamp: {
        Row: {
          booth_id: string
          created_at: string
          id: number
          scanned_by: string | null
          type: Database["public"]["Enums"]["stamp_type"]
          user_id: string
        }
        Insert: {
          booth_id: string
          created_at?: string
          id?: number
          scanned_by?: string | null
          type: Database["public"]["Enums"]["stamp_type"]
          user_id: string
        }
        Update: {
          booth_id?: string
          created_at?: string
          id?: number
          scanned_by?: string | null
          type?: Database["public"]["Enums"]["stamp_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stamp_booth_id_fkey"
            columns: ["booth_id"]
            isOneToOne: false
            referencedRelation: "booth"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stamp_scanned_by_fkey"
            columns: ["scanned_by"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stamp_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      store: {
        Row: {
          address: string | null
          created_at: string
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
      user: {
        Row: {
          created_at: string
          display_name: string
          email: string | null
          id: string
          line_id: string
          picture_url: string | null
        }
        Insert: {
          created_at?: string
          display_name: string
          email?: string | null
          id?: string
          line_id: string
          picture_url?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string | null
          id?: string
          line_id?: string
          picture_url?: string | null
        }
        Relationships: []
      }
      user_coupon: {
        Row: {
          coupon_id: string
          created_at: string
          id: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          coupon_id: string
          created_at?: string
          id?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          coupon_id?: string
          created_at?: string
          id?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_coupon_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupon"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_coupon_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
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
      booth_type: "internal" | "external"
      stamp_type: "booth" | "speaker"
      user_access: "1" | "49" | "99"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
