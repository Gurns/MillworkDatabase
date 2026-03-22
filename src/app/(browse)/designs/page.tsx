import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DesignGrid } from '@/components/design/DesignGrid';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Designs',
  description: 'Explore thousands of millwork designs — crown molding, baseboards, door casings, stair parts, mantels, and more.',
};

interface Props {
  searchParams: {
    page?: string;
    sort?: string;
    category?: string;
    style?: string;
    price?: string;
    q?: string;
  };
}

export default async function BrowseDesignsPage({ searchParams }: Props) {
  const supabase = createServerSupabaseClient();
  const page = Math.max(1, parseInt(searchParams.page || '1'));
  const perPage = 24;
  const sort = searchParams.sort || 'newest';
  const from = (page - 1) * perPage;

  let query = supabase
    .from('designs')
    .select(
      `*, creator:users!designs_creator_id_fkey(id, username, display_name, avatar_url)`,
      { count: 'exact' }
    )
    .eq('status', 'published');

  if (searchParams.q) {
    query = query.textSearch('search_vector', searchParams.q, { type: 'websearch', config: 'english' });
  }
  if (searchParams.price === 'free') query = query.eq('is_free', true);
  if (searchParams.price === 'paid') query = query.eq('is_free', false);

  switch (sort) {
    case 'popular': query = query.order('favorite_count', { ascending: false }); break;
    case 'most_downloaded': query = query.order('download_count', { ascending: false }); break;
    case 'trending': query = query.order('view_count', { ascending: false }); break;
    default: query = query.order('published_at', { ascending: false });
  }

  const { data: designs, count } = await query.range(from, from + perPage - 1);
  const totalPages = Math.ceil((count || 0) / perPage);

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Liked' },
    { value: 'most_downloaded', label: 'Most Downloaded' },
    { value: 'trending', label: 'Trending' },
  ];

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">
                {searchParams.q ? `Results for "${searchParams.q}"` : 'Browse Designs'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {count || 0} design{count !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort:</span>
              <div className="flex gap-1">
                {sortOptions.map((opt) => (
                  <Link
                    key={opt.value}
                    href={`/designs?sort=${opt.value}${searchParams.q ? `&q=${searchParams.q}` : ''}${searchParams.price ? `&price=${searchParams.price}` : ''}`}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      sort === opt.value
                        ? 'bg-brand-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Price filter pills */}
          <div className="flex gap-2 mb-6">
            {['all', 'free', 'paid'].map((p) => (
              <Link
                key={p}
                href={`/designs?sort=${sort}${p !== 'all' ? `&price=${p}` : ''}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors ${
                  (searchParams.price || 'all') === p
                    ? 'bg-wood-800 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {p}
              </Link>
            ))}
          </div>

          {/* Design grid */}
          <DesignGrid
            designs={designs || []}
            emptyMessage="No designs match your filters. Try a different search or browse by category."
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {page > 1 && (
                <Link
                  href={`/designs?page=${page - 1}&sort=${sort}${searchParams.price ? `&price=${searchParams.price}` : ''}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
                  className="btn-secondary text-sm"
                >
                  Previous
                </Link>
              )}
              <span className="flex items-center px-4 text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/designs?page=${page + 1}&sort=${sort}${searchParams.price ? `&price=${searchParams.price}` : ''}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
                  className="btn-secondary text-sm"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
