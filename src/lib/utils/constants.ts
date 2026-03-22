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

export const MATERIAL_GROUPS = [
  {
    label: 'Hardwoods',
    options: ['Oak', 'Maple', 'Cherry', 'Walnut', 'Mahogany', 'Poplar', 'Ash', 'Birch', 'Hickory', 'Alder'],
  },
  {
    label: 'Softwoods',
    options: ['Pine', 'Cedar', 'Fir', 'Spruce', 'Redwood', 'Cypress'],
  },
  {
    label: 'Engineered & Synthetic',
    options: ['MDF', 'PVC', 'Composite', 'Plywood', 'LVL', 'Polyurethane'],
  },
  {
    label: 'Other',
    options: ['Other Hardwood', 'Other Softwood', 'Other'],
  },
] as const;

// Flat array for backward compatibility
export const MATERIALS = MATERIAL_GROUPS.flatMap((group) => group.options) as const;

// ─── Creative Commons Licensing ───
export const CC_LICENSES = [
  {
    code: 'CC0',
    name: 'CC0 — Public Domain',
    shortName: 'Public Domain',
    description: 'No rights reserved. Anyone can use this design for any purpose without attribution.',
    allows_commercial: true,
    allows_derivatives: true,
    requires_attribution: false,
    requires_sharealike: false,
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    badge: 'https://licensebuttons.net/p/zero/1.0/88x31.png',
    icons: ['zero'],
  },
  {
    code: 'CC-BY-4.0',
    name: 'CC BY 4.0 — Attribution',
    shortName: 'Attribution',
    description: 'Others can use, modify, and sell works based on your design, as long as they credit you.',
    allows_commercial: true,
    allows_derivatives: true,
    requires_attribution: true,
    requires_sharealike: false,
    url: 'https://creativecommons.org/licenses/by/4.0/',
    badge: 'https://licensebuttons.net/l/by/4.0/88x31.png',
    icons: ['by'],
  },
  {
    code: 'CC-BY-SA-4.0',
    name: 'CC BY-SA 4.0 — Attribution-ShareAlike',
    shortName: 'Attribution-ShareAlike',
    description: 'Others can use and modify your design (including commercially), but must credit you and share their modifications under the same license.',
    allows_commercial: true,
    allows_derivatives: true,
    requires_attribution: true,
    requires_sharealike: true,
    url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    badge: 'https://licensebuttons.net/l/by-sa/4.0/88x31.png',
    icons: ['by', 'sa'],
  },
  {
    code: 'CC-BY-NC-4.0',
    name: 'CC BY-NC 4.0 — Attribution-NonCommercial',
    shortName: 'Attribution-NonCommercial',
    description: 'Others can use and modify your design for non-commercial purposes, as long as they credit you.',
    allows_commercial: false,
    allows_derivatives: true,
    requires_attribution: true,
    requires_sharealike: false,
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
    badge: 'https://licensebuttons.net/l/by-nc/4.0/88x31.png',
    icons: ['by', 'nc'],
  },
  {
    code: 'CC-BY-NC-SA-4.0',
    name: 'CC BY-NC-SA 4.0 — Attribution-NonCommercial-ShareAlike',
    shortName: 'NonCommercial-ShareAlike',
    description: 'Others can modify your design for non-commercial purposes, must credit you, and must share modifications under the same license.',
    allows_commercial: false,
    allows_derivatives: true,
    requires_attribution: true,
    requires_sharealike: true,
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    badge: 'https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png',
    icons: ['by', 'nc', 'sa'],
  },
  {
    code: 'CC-BY-ND-4.0',
    name: 'CC BY-ND 4.0 — Attribution-NoDerivatives',
    shortName: 'Attribution-NoDerivatives',
    description: 'Others can download and share your design (including commercially), but cannot modify it. Must credit you.',
    allows_commercial: true,
    allows_derivatives: false,
    requires_attribution: true,
    requires_sharealike: false,
    url: 'https://creativecommons.org/licenses/by-nd/4.0/',
    badge: 'https://licensebuttons.net/l/by-nd/4.0/88x31.png',
    icons: ['by', 'nd'],
  },
  {
    code: 'CC-BY-NC-ND-4.0',
    name: 'CC BY-NC-ND 4.0 — Attribution-NonCommercial-NoDerivatives',
    shortName: 'NonCommercial-NoDerivatives',
    description: 'Most restrictive. Others can download and share your design, but cannot modify it or use it commercially. Must credit you.',
    allows_commercial: false,
    allows_derivatives: false,
    requires_attribution: true,
    requires_sharealike: false,
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    badge: 'https://licensebuttons.net/l/by-nc-nd/4.0/88x31.png',
    icons: ['by', 'nc', 'nd'],
  },
] as const;

export type CCLicenseCode = typeof CC_LICENSES[number]['code'];

export function getLicenseByCode(code: string) {
  return CC_LICENSES.find((l) => l.code === code) || null;
}
