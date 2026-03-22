'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Design } from '@/types';

interface FavoriteDesign extends Design {
  favorite_id?: string;
}

export default function FavoritesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [designs, setDesigns] = useState<FavoriteDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('design_favorites')
          .select(`
            id as favorite_id,
            designs (
              id,
              title,
              slug,
              description,
              status,
              view_count,
              download_count,
              favorite_count,
              primary_image_url,
              is_free,
              price_cents,
              created_at
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) {
          setError('Failed to load favorites');
          console.error(fetchError);
        } else {
          // Flatten the nested structure
          const designList = (data || [])
            .map((fav: any) => ({
              ...fav.designs,
              favorite_id: fav.favorite_id,
            }))
            .filter((d: any) => d.id); // Ensure we have valid designs
          setDesigns(designList);
        }
      } catch (err) {
        setError('Something went wrong');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [router, supabase]);

  async function handleRemoveFavorite(designId: string, favoriteId?: string) {
    if (!favoriteId) return;
    try {
      const { error } = await supabase
        .from('design_favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) {
        setError('Failed to remove favorite');
      } else {
        setDesigns((prev) => prev.filter((d) => d.id !== designId));
      }
    } catch (err) {
      setError('Something went wrong');
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Favorites</h1>
        <p className="text-sm text-gray-500 mb-6">Loading your favorites...</p>
        <div className="card p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Favorites</h1>
        <p className="text-sm text-gray-500 mt-1">
          Designs you&apos;ve bookmarked. {designs.length} saved.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {designs.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-6">
            No favorites yet. Browse designs to find ones you like!
          </p>
          <Link href="/designs" className="btn-primary">
            Browse Designs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => (
            <div key={design.id} className="card overflow-hidden hover:shadow-lg transition-shadow group">
              {/* Thumbnail */}
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                {design.primary_image_url ? (
                  <>
                    <img
                      src={design.primary_image_url}
                      alt={design.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Link
                    href={`/designs/${design.slug || design.id}`}
                    className="font-semibold text-gray-900 hover:text-brand-600 truncate flex-1"
                  >
                    {design.title}
                  </Link>
                  <button
                    onClick={() => handleRemoveFavorite(design.id, design.favorite_id)}
                    className="text-red-600 hover:text-red-700 flex-shrink-0"
                    title="Remove from favorites"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.172 15.828a.5.5 0 11.707-.707L4.879 10.55a2 2 0 01.707-3.243l5.914-1.18a1 1 0 00.894-1.79l-5.914 1.18a4 4 0 00-1.414 6.487l4.879 4.879z" />
                    </svg>
                  </button>
                </div>

                {design.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {design.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-t border-gray-100">
                  <span className="mt-3">{design.view_count} views</span>
                  <span className="mt-3">{design.download_count} downloads</span>
                  <span className="mt-3">{design.favorite_count} likes</span>
                </div>

                {/* Status and price */}
                <div className="flex items-center justify-between">
                  <span className={`badge text-xs px-2 py-0.5 rounded-full ${
                    design.status === 'published' ? 'bg-green-100 text-green-700' :
                    design.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {design.status}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {design.is_free ? 'Free' : `$${(design.price_cents / 100).toFixed(2)}`}
                  </span>
                </div>

                {/* View button */}
                <Link
                  href={`/designs/${design.slug || design.id}`}
                  className="mt-4 block w-full text-center px-3 py-2 text-sm font-medium text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors"
                >
                  View Design
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
