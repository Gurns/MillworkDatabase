'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

// ─── Carving Types Data ───

interface CarvingType {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
}

const CARVING_TYPES: CarvingType[] = [
  {
    id: 'window-carvings',
    name: 'Window Carvings',
    slug: 'window-carvings',
    image: '/images/draw things ext window carving.png',
    description: 'Decorative carvings around window openings',
  },
  {
    id: 'geometric-carvings',
    name: 'Geometric',
    slug: 'geometric-carvings',
    image: '/images/entablature/classical.png',
    description: 'Symmetrical patterns and shapes',
  },
  {
    id: 'floral-carvings',
    name: 'Floral',
    slug: 'floral-carvings',
    image: '/images/entablature/victorian.png',
    description: 'Flower and plant motifs',
  },
  {
    id: 'figurative',
    name: 'Figurative',
    slug: 'figurative',
    image: '/images/entablature/craftsman.png',
    description: 'Human and animal figures',
  },
  {
    id: 'tracery',
    name: 'Tracery',
    slug: 'tracery',
    image: '/images/entablature/gothic.png',
    description: 'Openwork stone or wood patterns',
  },
  {
    id: 'ornate-scrollwork',
    name: 'Scrollwork',
    slug: 'ornate-scrollwork',
    image: '/images/entablature/contemporary.png',
    description: 'Curving decorative lines',
  },
];

interface CarvingTypesCarouselProps {
  filterMode?: boolean;
  activeCarvingType?: string;
}

export function CarvingTypesCarousel(props: CarvingTypesCarouselProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | undefined>(props.activeCarvingType);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Sync activeId with props
  useEffect(() => {
    setActiveId(props.activeCarvingType);
  }, [props.activeCarvingType]);

  // Sanitize input - only allow alphanumeric, hyphens, and underscores
  function sanitizeSlug(slug: string): string {
    return slug.replace(/[^a-zA-Z0-9-_]/g, '');
  }

  function buildHref(slug: string): string {
    const sanitizedSlug = sanitizeSlug(slug);
    
    if (!props.filterMode) {
      return `/categories/carvings?element=${encodeURIComponent(sanitizedSlug)}`;
    }
    const params = new URLSearchParams(searchParams.toString());
    if (params.get('element') === sanitizedSlug) {
      params.delete('element');
    } else {
      params.set('element', sanitizedSlug);
    }
    params.delete('page');
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-display font-bold text-gray-900">Carving Types</h3>
      </div>
      
      {/* Horizontal scrollable carousel */}
      <div className="relative">
        <div className="flex overflow-x-auto gap-3 px-4 py-4 scrollbar-hide">
          {CARVING_TYPES.map((carving) => {
            const isHovered = hoveredId === carving.id;
            const isActive = activeId === carving.id;

            return (
              <Link
                key={carving.id}
                href={buildHref(carving.slug)}
                scroll={false}
                className="flex-shrink-0 w-48 group"
                onMouseEnter={() => setHoveredId(carving.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  className={`relative rounded-lg overflow-hidden shadow-sm transition-all duration-300 ${
                    isActive
                      ? 'ring-2 ring-inset ring-amber-400 shadow-md'
                      : isHovered
                      ? 'ring-2 ring-inset ring-brand-500 shadow-md transform scale-105'
                      : 'hover:shadow-md hover:transform hover:scale-105'
                  }`}
                >
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={carving.image}
                      alt={carving.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      draggable={false}
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        (e.target as HTMLImageElement).src = '/images/entablature/classical.png';
                      }}
                    />
                  </div>
                  
                  {/* Active badge */}
                  {isActive && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className="bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full shadow-md text-xs">
                        Active
                      </div>
                    </div>
                  )}
                  
                  {/* Hover overlay */}
                  {isHovered && !isActive && (
                    <div className="absolute inset-0 bg-black/20 transition-colors duration-200" />
                  )}
                </div>
                
                <div className="mt-2.5">
                  <h4 className={`text-sm font-semibold transition-colors ${
                    isActive ? 'text-amber-700' : isHovered ? 'text-brand-600' : 'text-gray-900'
                  }`}>
                    {carving.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {carving.description || 'Decorative architectural carvings'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        
        {/* Scroll hints */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
}