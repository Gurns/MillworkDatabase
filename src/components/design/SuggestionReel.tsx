'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface RecommendedDesign {
  id: string;
  title: string;
  slug: string;
  description: string;
  creator_username: string;
  creator_display_name: string;
  thumbnail_url: string | null;
  view_count: number;
  download_count: number;
  favorite_count: number;
  is_free: boolean;
  price: number | null;
}

interface SuggestionReelProps {
  title: string;
  subtitle?: string;
  type: 'trending' | 'similar' | 'personalized' | 'category';
  designId?: string;     // for 'similar'
  category?: string;     // for 'category'
  limit?: number;
}

export function SuggestionReel({
  title,
  subtitle,
  type,
  designId,
  category,
  limit = 8,
}: SuggestionReelProps) {
  const [designs, setDesigns] = useState<RecommendedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const params = new URLSearchParams({ type, limit: String(limit) });
        if (designId) params.set('design_id', designId);
        if (category) params.set('category', category);

        const res = await fetch(`/api/recommendations?${params}`);
        if (!res.ok) return;

        const data = await res.json();
        setDesigns(data.designs || []);
        if (data.fallback) setFallback(data.fallback);
      } catch {
        // Silently fail — suggestions are non-critical
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [type, designId, category, limit]);

  function scrollLeft() {
    scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  }

  function scrollRight() {
    scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  }

  // Don't render if no results and not loading
  if (!loading && designs.length === 0) return null;

  const displayTitle = fallback === 'trending' && type === 'personalized'
    ? 'Trending Designs'
    : title;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-900">{displayTitle}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex gap-1">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-72 animate-pulse">
              <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {designs.map((design) => (
            <Link
              key={design.id}
              href={`/designs/${design.id}`}
              className="flex-shrink-0 w-72 group snap-start"
            >
              <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
                {design.thumbnail_url ? (
                  <img
                    src={design.thumbnail_url}
                    alt={design.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {design.is_free ? (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    Free
                  </span>
                ) : design.price ? (
                  <span className="absolute top-2 right-2 bg-brand-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    ${design.price}
                  </span>
                ) : null}
              </div>
              <h3 className="font-medium text-gray-900 text-sm group-hover:text-brand-600 transition-colors line-clamp-1">
                {design.title}
              </h3>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">
                  by {design.creator_display_name || design.creator_username}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="flex items-center gap-0.5">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {design.favorite_count}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {design.download_count}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
