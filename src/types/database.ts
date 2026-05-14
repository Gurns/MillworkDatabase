// Auto-generated types would come from `supabase gen types typescript`
// Manual equivalent matching our millwork schema

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  millwork: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          is_cnc_provider: boolean;
          role: 'user' | 'moderator' | 'admin';
          is_banned: boolean;
          banned_reason: string | null;
          banned_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          email: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          is_cnc_provider?: boolean;
          role?: 'user' | 'moderator' | 'admin';
        };
        Update: {
          username?: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          is_cnc_provider?: boolean;
        };
      };
      designs: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          slug: string;
          description: string | null;
          long_description: string | null;
          is_free: boolean;
          price_cents: number | null;
          dimensions_json: DimensionsJson | null;
          material: string | null;
          difficulty_level: DifficultyLevel | null;
          estimated_build_hours: number | null;
          primary_image_url: string | null;
          is_remix: boolean;
          forked_from_id: string | null;
          view_count: number;
          download_count: number;
          favorite_count: number;
          comment_count: number;
          status: DesignStatus;
          published_at: string | null;
          license_type: CcLicenseType | null;
          license_url: string | null;
          search_vector: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          slug: string;
          description?: string | null;
          long_description?: string | null;
          is_free?: boolean;
          price_cents?: number | null;
          dimensions_json?: DimensionsJson | null;
          material?: string | null;
          difficulty_level?: DifficultyLevel | null;
          estimated_build_hours?: number | null;
          primary_image_url?: string | null;
          is_remix?: boolean;
          forked_from_id?: string | null;
          status?: DesignStatus;
          license_type?: CcLicenseType | null;
          license_url?: string | null;
        };
        Update: {
          title?: string;
          slug?: string;
          description?: string | null;
          long_description?: string | null;
          is_free?: boolean;
          price_cents?: number | null;
          dimensions_json?: DimensionsJson | null;
          material?: string | null;
          difficulty_level?: DifficultyLevel | null;
          estimated_build_hours?: number | null;
          primary_image_url?: string | null;
          is_remix?: boolean;
          forked_from_id?: string | null;
          status?: DesignStatus;
          license_type?: CcLicenseType | null;
          license_url?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon_name: string | null;
          parent_category_id: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon_name?: string | null;
          parent_category_id?: string | null;
          display_order?: number;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          icon_name?: string | null;
          parent_category_id?: string | null;
          display_order?: number;
        };
      };
      styles: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
        };
      };
      design_categories: {
        Row: { design_id: string; category_id: string; };
        Insert: { design_id: string; category_id: string; };
        Update: never;
      };
      design_styles: {
        Row: { design_id: string; style_id: string; };
        Insert: { design_id: string; style_id: string; };
        Update: never;
      };
      design_images: {
        Row: {
          id: string;
          design_id: string;
          image_url: string;
          thumbnail_url: string | null;
          alt_text: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          design_id: string;
          image_url: string;
          thumbnail_url?: string | null;
          alt_text?: string | null;
          display_order?: number;
        };
        Update: {
          image_url?: string;
          thumbnail_url?: string | null;
          alt_text?: string | null;
          display_order?: number;
        };
      };
      design_files: {
        Row: {
          id: string;
          design_id: string;
          file_name: string;
          file_path: string;
          file_type: FileType;
          file_size_bytes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          design_id: string;
          file_name: string;
          file_path: string;
          file_type: FileType;
          file_size_bytes: number;
        };
        Update: {
          file_name?: string;
          file_path?: string;
          file_type?: FileType;
          file_size_bytes?: number;
        };
      };
      design_tags: {
        Row: {
          design_id: string;
          tag_name: string;
          tag_type: 'auto' | 'manual';
          confidence: number | null;
        };
        Insert: {
          design_id: string;
          tag_name: string;
          tag_type?: 'auto' | 'manual';
          confidence?: number | null;
        };
        Update: never;
      };
      favorites: {
        Row: { id: string; user_id: string; design_id: string; created_at: string; };
        Insert: { id?: string; user_id: string; design_id: string; };
        Update: never;
      };
      collections: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string | null;
          is_public: boolean;
          design_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description?: string | null;
          is_public?: boolean;
        };
        Update: { title?: string; description?: string | null; is_public?: boolean; };
      };
      collection_designs: {
        Row: { collection_id: string; design_id: string; display_order: number; added_at: string; };
        Insert: { collection_id: string; design_id: string; display_order?: number; };
        Update: { display_order?: number; };
      };
      comments: {
        Row: {
          id: string;
          design_id: string;
          author_id: string;
          content: string;
          parent_comment_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          design_id: string;
          author_id: string;
          content: string;
          parent_comment_id?: string | null;
        };
        Update: { content?: string; };
      };
      downloads: {
        Row: { id: string; user_id: string; design_id: string; file_type: string | null; created_at: string; };
        Insert: { id?: string; user_id: string; design_id: string; file_type?: string | null; };
        Update: never;
      };
      purchases: {
        Row: {
          id: string;
          user_id: string;
          design_id: string;
          stripe_payment_intent_id: string | null;
          amount_cents: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          design_id: string;
          stripe_payment_intent_id?: string | null;
          amount_cents: number;
          status?: string;
        };
        Update: never;
      };
      user_stats: {
        Row: {
          user_id: string;
          total_points: number;
          designs_created: number;
          total_downloads_received: number;
          favorites_received: number;
          comments_made: number;
          level: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          total_points?: number;
          designs_created?: number;
          total_downloads_received?: number;
          favorites_received?: number;
          comments_made?: number;
          level?: number;
        };
        Update: {
          total_points?: number;
          designs_created?: number;
          total_downloads_received?: number;
          favorites_received?: number;
          comments_made?: number;
          level?: number;
        };
      };
      badges: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          icon_name: string;
          criteria_type: string;
          criteria_threshold: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          icon_name: string;
          criteria_type: string;
          criteria_threshold: number;
        };
        Update: never;
      };
      user_badges: {
        Row: { user_id: string; badge_id: string; earned_at: string; };
        Insert: { user_id: string; badge_id: string; };
        Update: never;
      };
      cnc_providers: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          description: string | null;
          location: string | null;
          website_url: string | null;
          contact_email: string | null;
          capabilities: CncCapabilities | null;
          average_rating: number;
          total_reviews: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name: string;
          description?: string | null;
          location?: string | null;
          website_url?: string | null;
          contact_email?: string | null;
          capabilities?: CncCapabilities | null;
          is_active?: boolean;
        };
        Update: {
          business_name?: string;
          description?: string | null;
          location?: string | null;
          website_url?: string | null;
          contact_email?: string | null;
          capabilities?: CncCapabilities | null;
          is_active?: boolean;
        };
      };
      cnc_reviews: {
        Row: {
          id: string;
          provider_id: string;
          reviewer_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          reviewer_id: string;
          rating: number;
          comment?: string | null;
        };
        Update: { rating?: number; comment?: string | null; };
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          description: string | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: { key: string; value?: Json; description?: string | null; };
        Update: { value?: Json; description?: string | null; };
      };
      admin_audit_log: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          target_type: string | null;
          target_id: string | null;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          action: string;
          target_type?: string | null;
          target_id?: string | null;
          details?: Json | null;
        };
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_similar_designs: { Args: { p_design_id: string; p_limit?: number }; Returns: any[]; };
      get_trending_designs: { Args: { p_limit?: number; p_days?: number }; Returns: any[]; };
      get_personalized_suggestions: { Args: { p_user_id: string; p_limit?: number }; Returns: any[]; };
      get_popular_by_category: { Args: { p_category_slug: string; p_limit?: number }; Returns: any[]; };
      is_admin: { Args: { p_user_id: string }; Returns: boolean; };
      get_admin_stats: { Args: Record<string, never>; Returns: any[]; };
    };
    Enums: {
      design_status: DesignStatus;
      difficulty_level: DifficultyLevel;
      file_type: FileType;
      cc_license_type: CcLicenseType;
    };
  };
}

// --- Custom Types ---

export type DesignStatus = 'draft' | 'published' | 'archived';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type FileType = 'stl' | 'step' | 'obj' | 'ply' | 'f3d' | 'fusion360' | 'other';
export type CcLicenseType = 'CC0' | 'CC-BY-4.0' | 'CC-BY-SA-4.0' | 'CC-BY-NC-4.0' | 'CC-BY-NC-SA-4.0' | 'CC-BY-ND-4.0' | 'CC-BY-NC-ND-4.0';

export interface DimensionsJson {
  length?: number;
  width?: number;
  height?: number;
  depth?: number;
  unit: 'in' | 'mm' | 'cm';
}

export interface CncCapabilities {
  materials: string[];
  max_width_inches: number;
  max_length_inches: number;
  max_depth_inches: number;
  turnaround_days: number;
}

// --- Convenience aliases ---

export type User = Database['millwork']['Tables']['users']['Row'];
export type Design = Database['millwork']['Tables']['designs']['Row'];
export type Category = Database['millwork']['Tables']['categories']['Row'];
export type Style = Database['millwork']['Tables']['styles']['Row'];
export type DesignImage = Database['millwork']['Tables']['design_images']['Row'];
export type DesignFile = Database['millwork']['Tables']['design_files']['Row'];
export type Comment = Database['millwork']['Tables']['comments']['Row'];
export type Collection = Database['millwork']['Tables']['collections']['Row'];
export type Favorite = Database['millwork']['Tables']['favorites']['Row'];
export type Download = Database['millwork']['Tables']['downloads']['Row'];
export type Purchase = Database['millwork']['Tables']['purchases']['Row'];
export type UserStats = Database['millwork']['Tables']['user_stats']['Row'];
export type Badge = Database['millwork']['Tables']['badges']['Row'];
export type CncProvider = Database['millwork']['Tables']['cnc_providers']['Row'];
export type CncReview = Database['millwork']['Tables']['cnc_reviews']['Row'];
export type SiteSetting = Database['millwork']['Tables']['site_settings']['Row'];

// --- Joined/enriched types for API responses ---

export interface DesignWithCreator extends Design {
  creator: Pick<User, 'id' | 'username' | 'display_name' | 'avatar_url'>;
}

export interface DesignDetail extends DesignWithCreator {
  categories: Category[];
  styles: Style[];
  images: DesignImage[];
  files: DesignFile[];
  tags: string[];
  forked_from?: Pick<Design, 'id' | 'title' | 'slug'> | null;
  is_favorited?: boolean;
  is_purchased?: boolean;
}

export interface UserProfile extends User {
  stats: UserStats;
  badges: Badge[];
  design_count: number;
}

export interface CncProviderDetail extends CncProvider {
  user: Pick<User, 'id' | 'username' | 'display_name' | 'avatar_url'>;
  recent_reviews: (CncReview & {
    reviewer: Pick<User, 'id' | 'username' | 'avatar_url'>;
  })[];
}
