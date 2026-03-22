import Link from 'next/link';
import type { DesignWithCreator } from '@/types';

interface DesignCardProps {
  design: DesignWithCreator;
}

export function DesignCard({ design }: DesignCardProps) {
  return (
    <Link href={`/designs/${design.id}`} className="card group overflow-hidden">
      {/* Image */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {design.primary_image_url ? (
          <img
            src={design.primary_image_url}
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

        {/* Price badge */}
        {design.is_free ? (
          <span className="absolute top-2 right-2 badge bg-green-100 text-green-700">
            Free
          </span>
        ) : design.price_cents ? (
          <span className="absolute top-2 right-2 badge bg-brand-100 text-brand-700">
            ${(design.price_cents / 100).toFixed(2)}
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 text-sm line-clamp-1 group-hover:text-brand-600 transition-colors">
          {design.title}
        </h3>

        {design.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{design.description}</p>
        )}

        <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-5 h-5 rounded-full bg-gray-200 inline-flex items-center justify-center text-[10px] font-medium text-gray-600">
              {design.creator?.display_name?.[0] || design.creator?.username?.[0] || '?'}
            </span>
            <span className="truncate max-w-[80px]">
              {design.creator?.display_name || design.creator?.username}
            </span>
          </span>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-0.5" title="Downloads">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {design.download_count}
            </span>
            <span className="flex items-center gap-0.5" title="Favorites">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {design.favorite_count}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
