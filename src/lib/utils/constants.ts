export const APP_NAME = 'MillworkDatabase';
export const APP_DESCRIPTION =
  'Share, discover, and download millwork designs for CNC cutting. Door casings, crown molding, stair parts, mantels, and more.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://millworkdatabase.com';

export const ITEMS_PER_PAGE = 24;
export const MAX_ITEMS_PER_PAGE = 100;

// Gamification point values
export const POINTS = {
  DESIGN_UPLOADED: 50,
  DESIGN_DOWNLOADED: 10,
  DESIGN_FAVORITED: 5,
  COMMENT_RECEIVED: 2,
  COLLECTION_CREATED: 20,
  PROFILE_COMPLETED: 25,
} as const;

// Level thresholds
export const LEVELS = [
  { level: 1, name: 'Apprentice', min_points: 0 },
  { level: 2, name: 'Journeyman', min_points: 100 },
  { level: 3, name: 'Craftsman', min_points: 500 },
  { level: 4, name: 'Artisan', min_points: 1500 },
  { level: 5, name: 'Master', min_points: 5000 },
  { level: 6, name: 'Grand Master', min_points: 15000 },
] as const;

export function getLevelForPoints(points: number) {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (points >= level.min_points) {
      current = level;
    } else {
      break;
    }
  }
  return current;
}

// Navigation categories for browsing
export const MAIN_CATEGORIES = [
  { name: 'Trim & Molding', slug: 'trim-and-molding', icon: 'Ruler' },
  { name: 'Stair Parts', slug: 'stair-parts', icon: 'Stairs' },
  { name: 'Mantels', slug: 'mantels', icon: 'Flame' },
  { name: 'Built-ins', slug: 'built-ins', icon: 'LayoutGrid' },
] as const;

export const ARCHITECTURAL_STYLES = [
  'Craftsman',
  'Colonial',
  'Victorian',
  'Art Deco',
  'Georgian',
  'Federal',
  'Greek Revival',
  'Gothic Revival',
  'Queen Anne',
  'Tudor',
  'Mission',
  'Prairie',
  'Mid-Century Modern',
  'Contemporary',
  'Rustic',
  'Traditional',
] as const;

export const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'Simple profiles, basic CNC setup' },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'Multi-pass cuts, some handwork needed',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Complex profiles, multi-axis machining',
  },
] as const;

export const MATERIALS = [
  'Poplar',
  'Pine',
  'Oak',
  'Maple',
  'Cherry',
  'Walnut',
  'Mahogany',
  'MDF',
  'PVC',
  'Composite',
  'Other Hardwood',
  'Other Softwood',
] as const;
