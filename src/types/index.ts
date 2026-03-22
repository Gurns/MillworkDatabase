export type * from './database';

// --- API Request/Response types ---

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
}

export interface DesignFilters {
  category?: string;
  style?: string;
  price?: 'free' | 'paid' | 'all';
  difficulty?: string;
  material?: string;
  sort?: 'newest' | 'popular' | 'trending' | 'most_downloaded';
  q?: string;
  page?: number;
  per_page?: number;
}

export interface CreateDesignInput {
  title: string;
  description?: string;
  long_description?: string;
  is_free: boolean;
  price_cents?: number;
  material?: string;
  difficulty_level?: string;
  dimensions_json?: {
    length?: number;
    width?: number;
    height?: number;
    depth?: number;
    unit: 'in' | 'mm' | 'cm';
  };
  category_ids: string[];
  style_ids: string[];
  tags?: string[];
}

export interface UpdateDesignInput {
  title?: string;
  description?: string;
  long_description?: string;
  is_free?: boolean;
  price_cents?: number;
  material?: string;
  difficulty_level?: string;
  dimensions_json?: {
    length?: number;
    width?: number;
    height?: number;
    depth?: number;
    unit: 'in' | 'mm' | 'cm';
  };
  category_ids?: string[];
  style_ids?: string[];
  tags?: string[];
}

// --- Navigation ---

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

// --- Search ---

export interface SearchSuggestion {
  value: string;
  type: 'design' | 'category' | 'style' | 'tag' | 'user';
}
