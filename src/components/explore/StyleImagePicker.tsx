'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

// ─── Style regions mapped to the two-row street scene image ───
// The image has two rows of houses stacked vertically.
// Top row (~50% height): Craftsman, Colonial, Victorian, Art Deco, Georgian, Federal, Greek Revival, Gothic Revival
// Bottom row (~50% height): Queen Anne, Tudor, Mission, Prairie, Mid-Century Modern, Contemporary, Rustic, Traditional

interface StyleRegion {
  style: string;
  slug: string;
  top: number;     // % from top
  left: number;    // % from left
  width: number;   // % width
  height: number;  // % height
}

const STYLE_REGIONS: StyleRegion[] = [
  // Top row — each house roughly 12.5% wide, top 48% of image
  { style: 'Craftsman',      slug: 'craftsman',      top: 0,  left: 0,    width: 12.5, height: 48 },
  { style: 'Colonial',       slug: 'colonial',       top: 0,  left: 12.5, width: 12.5, height: 48 },
  { style: 'Victorian',      slug: 'victorian',      top: 0,  left: 25,   width: 12.5, height: 48 },
  { style: 'Art Deco',       slug: 'art-deco',       top: 0,  left: 37.5, width: 12.5, height: 48 },
  { style: 'Georgian',       slug: 'georgian',       top: 0,  left: 50,   width: 12.5, height: 48 },
  { style: 'Federal',        slug: 'federal',        top: 0,  left: 62.5, width: 12.5, height: 48 },
  { style: 'Greek Revival',  slug: 'greek-revival',  top: 0,  left: 75,   width: 12.5, height: 48 },
  { style: 'Gothic Revival', slug: 'gothic-revival', top: 0,  left: 87.5, width: 12.5, height: 48 },
  // Bottom row — 8 houses, each 12.5% wide, bottom 50% of image
  { style: 'Queen Anne',         slug: 'queen-anne',         top: 50, left: 0,    width: 12.5, height: 50 },
  { style: 'Tudor',              slug: 'tudor',              top: 50, left: 12.5, width: 12.5, height: 50 },
  { style: 'Mission',            slug: 'mission',            top: 50, left: 25,   width: 12.5, height: 50 },
  { style: 'Prairie',            slug: 'prairie',            top: 50, left: 37.5, width: 12.5, height: 50 },
  { style: 'Mid-Century Modern', slug: 'mid-century-modern', top: 50, left: 50,   width: 12.5, height: 50 },
  { style: 'Contemporary',       slug: 'contemporary',       top: 50, left: 62.5, width: 12.5, height: 50 },
  { style: 'Rustic',             slug: 'rustic',             top: 50, left: 75,   width: 12.5, height: 50 },
  { style: 'Traditional',        slug: 'traditional',        top: 50, left: 87.5, width: 12.5, height: 50 },
];

interface StyleImagePickerProps {
  /** Currently active / selected style slug, if any */
  activeStyle?: string;
  /**
   * When true, clicking a style adds/replaces ?style=slug on the current path
   * instead of navigating to /styles/{slug}. Used on sub-pages to narrow results.
   */
  filterMode?: boolean;
  /** Compact display for embedding in sub-pages */
  compact?: boolean;
}

export function StyleImagePicker({ activeStyle, filterMode = false, compact = false }: StyleImagePickerProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /** Build the href for a region: either navigate or filter */
  function buildHref(slug: string): string {
    if (!filterMode) {
      return `/styles/${slug}`;
    }
    // Filter mode: toggle style param on the current path
    const params = new URLSearchParams(searchParams.toString());
    if (params.get('style') === slug) {
      // clicking the same style again clears the filter
      params.delete('style');
    } else {
      params.set('style', slug);
    }
    // Reset to page 1 when changing style filter
    params.delete('page');
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  return (
    <div className={`relative select-none rounded-xl overflow-hidden shadow-md ${compact ? 'max-w-xl' : ''}`}>
      {/* The actual image */}
      <img
        src="/images/architectural-styles-street.png"
        alt="A street scene showing homes in 16 different architectural styles"
        className="w-full block"
        draggable={false}
      />

      {/* Clickable overlay regions */}
      {STYLE_REGIONS.map((region) => {
        const isHovered = hoveredSlug === region.slug;
        const isActive = activeStyle === region.slug;

        return (
          <Link
            key={region.slug}
            href={buildHref(region.slug)}
            scroll={false}
            className="absolute block"
            style={{
              top: `${region.top}%`,
              left: `${region.left}%`,
              width: `${region.width}%`,
              height: `${region.height}%`,
            }}
            onMouseEnter={() => setHoveredSlug(region.slug)}
            onMouseLeave={() => setHoveredSlug(null)}
          >
            {/* Hover vignette + highlight */}
            <div
              className={`absolute inset-0 transition-all duration-300 ease-out ${
                isActive
                  ? 'ring-3 ring-inset ring-amber-400'
                  : isHovered
                  ? 'ring-2 ring-inset ring-white/80'
                  : ''
              }`}
              style={{
                background: isActive
                  ? 'radial-gradient(ellipse at center, rgba(251,191,36,0.1) 0%, rgba(251,191,36,0.15) 60%, rgba(0,0,0,0.12) 100%)'
                  : isHovered
                  ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.18) 100%)'
                  : 'transparent',
              }}
            />

            {/* Slight brightness on hover */}
            {isHovered && !isActive && (
              <div
                className="absolute inset-0 pointer-events-none mix-blend-soft-light"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              />
            )}

            {/* Active selection badge */}
            {isActive && (
              <div className="absolute top-1 left-1/2 -translate-x-1/2 z-10">
                <div className={`bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap ${compact ? 'text-[7px]' : 'text-[9px]'}`}>
                  {region.style}
                </div>
              </div>
            )}

            {/* Hover tooltip */}
            {isHovered && !isActive && (
              <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
                <div className={`bg-gradient-to-t from-black/50 to-transparent px-1 ${compact ? 'pt-3 pb-0.5' : 'pt-6 pb-1.5'}`}>
                  <p className={`text-white font-semibold text-center drop-shadow-lg leading-tight ${compact ? 'text-[8px]' : 'text-[10px]'}`}>
                    {region.style}
                  </p>
                </div>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
