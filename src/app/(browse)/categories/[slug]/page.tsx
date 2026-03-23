import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DesignGrid } from '@/components/design/DesignGrid';
import { StyleImagePicker } from '@/components/explore/StyleImagePicker';
import { ArchitecturalExplorer } from '@/components/explore/ArchitecturalExplorer';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    sort?: string;
    price?: string;
    style?: string;
    element?: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerSupabaseClient();
  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', params.slug)
    .single();

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} - Browse Designs`,
    description: category.description || `Browse millwork designs in the ${category.name} category.`,
  };
}

export default async function CategoryBrowsePage({ params, searchParams }: Props) {
  const supabase = createServerSupabaseClient();

  // Fetch category
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .eq('slug', params.slug)
    .single();

  if (!category) {
    notFound();
  }

  const page = Math.max(1, parseInt(searchParams.page || '1'));
  const perPage = 24;
  const sort = searchParams.sort || 'newest';
  const from = (page - 1) * perPage;

  // Get design IDs for this category
  const { data: categoryDesigns } = await supabase
    .from('design_categories')
    .select('design_id')
    .eq('category_id', category.id);

  const designIds = categoryDesigns?.map((dc) => dc.design_id) || [];

  let query = supabase
    .from('designs')
    .select(
      `*, creator:users!designs_creator_id_fkey(id, username, display_name, avatar_url)`,
      { count: 'exact' }
    )
    .eq('status', 'published')
    .in('id', designIds.length > 0 ? designIds : ['00000000-0000-0000-0000-000000000000']);

  if (searchParams.price === 'free') query = query.eq('is_free', true);
  if (searchParams.price === 'paid') query = query.eq('is_free', false);

  // Narrow by architectural style if ?style= is set
  if (searchParams.style) {
    const { data: styleRow } = await supabase
      .from('styles')
      .select('id')
      .eq('slug', searchParams.style)
      .single();
    if (styleRow) {
      const { data: styleDesigns } = await supabase
        .from('design_styles')
        .select('design_id')
        .eq('style_id', styleRow.id);
      const styleDesignIds = new Set(styleDesigns?.map((sd) => sd.design_id) || []);
      // Intersect with category design IDs
      const intersected = designIds.filter((id) => styleDesignIds.has(id));
      query = supabase
        .from('designs')
        .select(
          `*, creator:users!designs_creator_id_fkey(id, username, display_name, avatar_url)`,
          { count: 'exact' }
        )
        .eq('status', 'published')
        .in('id', intersected.length > 0 ? intersected : ['00000000-0000-0000-0000-000000000000']);

      if (searchParams.price === 'free') query = query.eq('is_free', true);
      if (searchParams.price === 'paid') query = query.eq('is_free', false);
    }
  }

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
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold text-gray-900">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-gray-600 mt-2 max-w-2xl">
                {category.description}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {count || 0} design{count !== 1 ? 's' : ''} found
              {searchParams.style && (
                <span className="ml-2 inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-xs font-medium">
                  Style: {searchParams.style.replace(/-/g, ' ')}
                  <a href={`/categories/${category.slug}?sort=${sort}${searchParams.price ? `&price=${searchParams.price}` : ''}`} className="ml-1 text-amber-500 hover:text-amber-700">&times;</a>
                </span>
              )}
            </p>
          </div>

          {/* Narrow by Style & Architectural Element — compact, side-by-side on lg */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <div>
              <h2 className="text-sm font-display font-bold text-gray-900 mb-1.5">
                Narrow by Style
              </h2>
              <StyleImagePicker compact filterMode activeStyle={searchParams.style} />
            </div>
            <div>
              <ArchitecturalExplorer compact filterMode />
            </div>
          </div>

          {/* Sort and filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort:</span>
              <div className="flex gap-1">
                {sortOptions.map((opt) => (
                  <Link
                    key={opt.value}
                    href={`/categories/${category.slug}?sort=${opt.value}${searchParams.price ? `&price=${searchParams.price}` : ''}`}
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
                href={`/categories/${category.slug}?sort=${sort}${p !== 'all' ? `&price=${p}` : ''}`}
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
            emptyMessage={`No designs in ${category.name} yet. Check back soon!`}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {page > 1 && (
                <Link
                  href={`/categories/${category.slug}?page=${page - 1}&sort=${sort}${searchParams.price ? `&price=${searchParams.price}` : ''}`}
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
                  href={`/categories/${category.slug}?page=${page + 1}&sort=${sort}${searchParams.price ? `&price=${searchParams.price}` : ''}`}
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
