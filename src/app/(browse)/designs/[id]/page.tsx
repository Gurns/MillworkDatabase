import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CommentSection } from '@/components/design/CommentSection';
import { FavoriteButton } from '@/components/design/FavoriteButton';
import { DesignFileList } from '@/components/design/DesignFileList';
import { SuggestionReel } from '@/components/design/SuggestionReel';
import Link from 'next/link';
import { formatFileSize } from '@/lib/utils/file-validation';
import { LicenseBadge } from '@/components/design/LicenseBadge';
import type { Metadata } from 'next';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerSupabaseClient();
  const { data: design } = await supabase
    .from('designs')
    .select('title, description, primary_image_url')
    .eq('id', params.id)
    .eq('status', 'published')
    .single();

  if (!design) return { title: 'Design Not Found' };

  return {
    title: design.title,
    description: design.description || `View ${design.title} on MillworkDatabase`,
    openGraph: {
      title: design.title,
      description: design.description || undefined,
      images: design.primary_image_url ? [design.primary_image_url] : undefined,
    },
  };
}

export default async function DesignDetailPage({ params }: Props) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: design } = await supabase
    .from('designs')
    .select(`
      *,
      creator:users!designs_creator_id_fkey(id, username, display_name, avatar_url, bio),
      images:design_images(id, image_url, thumbnail_url, alt_text, display_order),
      files:design_files(id, file_name, file_type, file_size_bytes),
      categories:design_categories(category:categories(id, name, slug)),
      styles:design_styles(style:styles(id, name, slug)),
      tags:design_tags(tag_name, tag_type)
    `)
    .eq('id', params.id)
    .single();

  if (!design || (design.status !== 'published' && design.creator_id !== user?.id)) {
    notFound();
  }

  let isFavorited = false;
  if (user) {
    const { data: fav } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('design_id', params.id)
      .single();
    isFavorited = !!fav;
  }

  const categories = design.categories?.map((dc: any) => dc.category).filter(Boolean) || [];
  const styles = design.styles?.map((ds: any) => ds.style).filter(Boolean) || [];
  const tags = design.tags?.map((t: any) => t.tag_name) || [];
  const images = design.images || [];
  const files = design.files || [];

  // Check for forked_from
  let forkedFrom = null;
  if (design.forked_from_id) {
    const { data } = await supabase
      .from('designs')
      .select('id, title, slug')
      .eq('id', design.forked_from_id)
      .single();
    forkedFrom = data;
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column — images */}
            <div className="lg:col-span-2 space-y-4">
              {/* Primary image */}
              <div className="card overflow-hidden">
                {images.length > 0 ? (
                  <div className="aspect-[16/10] bg-gray-100">
                    <img
                      src={images.sort((a: any, b: any) => a.display_order - b.display_order)[0]?.image_url}
                      alt={design.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-gray-100 flex items-center justify-center text-gray-400">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Image gallery thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {images.sort((a: any, b: any) => a.display_order - b.display_order).map((img: any) => (
                    <div key={img.id} className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent hover:border-brand-400 cursor-pointer">
                      <img src={img.thumbnail_url || img.image_url} alt={img.alt_text || ''} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* 3D Viewer placeholder */}
              {files.length > 0 && (
                <div className="card p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">3D Preview</h3>
                  <div className="aspect-[16/10] bg-gray-900 rounded-lg flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                      </svg>
                      <p className="text-sm">Interactive 3D viewer — coming soon</p>
                      <p className="text-xs text-gray-600 mt-1">Download the files below to view in your preferred 3D software</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              {design.long_description && (
                <div className="card p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                  <div className="prose prose-sm text-gray-700 whitespace-pre-wrap">
                    {design.long_description}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="card p-6">
                <CommentSection designId={params.id} />
              </div>
            </div>

            {/* Right column — metadata & actions */}
            <div className="space-y-4">
              {/* Title & actions */}
              <div className="card p-6">
                <h1 className="text-xl font-display font-bold text-gray-900 mb-2">{design.title}</h1>
                {design.description && (
                  <p className="text-sm text-gray-600 mb-4">{design.description}</p>
                )}

                {forkedFrom && (
                  <p className="text-xs text-gray-500 mb-3">
                    Remixed from{' '}
                    <Link href={`/designs/${forkedFrom.id}`} className="text-brand-600 hover:underline">
                      {forkedFrom.title}
                    </Link>
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>{design.view_count.toLocaleString()} views</span>
                  <span>{design.download_count.toLocaleString()} downloads</span>
                  <span>{design.favorite_count.toLocaleString()} likes</span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  {design.is_free ? (
                    <span className="badge bg-green-100 text-green-700 text-sm">Free</span>
                  ) : (
                    <span className="text-xl font-bold text-gray-900">
                      ${((design.price_cents || 0) / 100).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <FavoriteButton designId={params.id} initialFavorited={isFavorited} isLoggedIn={!!user} />

                  <Link
                    href={`/designs/${params.id}?remix=true`}
                    className="w-full btn-secondary text-sm text-center block"
                  >
                    Remix This Design
                  </Link>
                </div>
              </div>

              {/* Creator */}
              <div className="card p-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Designer</h3>
                <Link href={`/${design.creator.username}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-medium">
                    {design.creator.avatar_url ? (
                      <img src={design.creator.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      design.creator.display_name?.[0] || design.creator.username[0]
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors">
                      {design.creator.display_name || design.creator.username}
                    </p>
                    <p className="text-xs text-gray-500">@{design.creator.username}</p>
                  </div>
                </Link>
              </div>

              {/* Files */}
              {files.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Files</h3>
                  <DesignFileList files={files} designId={params.id} isLoggedIn={!!user} isFree={design.is_free} />
                </div>
              )}

              {/* Metadata */}
              <div className="card p-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Details</h3>
                <dl className="space-y-2 text-sm">
                  {design.material && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Material</dt>
                      <dd className="text-gray-900 font-medium">{design.material}</dd>
                    </div>
                  )}
                  {design.difficulty_level && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Difficulty</dt>
                      <dd className="text-gray-900 font-medium capitalize">{design.difficulty_level}</dd>
                    </div>
                  )}
                  {design.estimated_build_hours && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Est. Build Time</dt>
                      <dd className="text-gray-900 font-medium">{design.estimated_build_hours}h</dd>
                    </div>
                  )}
                  {design.dimensions_json && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Dimensions</dt>
                      <dd className="text-gray-900 font-medium text-right">
                        {[
                          design.dimensions_json.length && `${design.dimensions_json.length}`,
                          design.dimensions_json.width && `${design.dimensions_json.width}`,
                          design.dimensions_json.height && `${design.dimensions_json.height}`,
                        ]
                          .filter(Boolean)
                          .join(' × ')}{' '}
                        {design.dimensions_json.unit}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Published</dt>
                    <dd className="text-gray-900 font-medium">
                      {design.published_at ? new Date(design.published_at).toLocaleDateString() : 'Draft'}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Categories & styles */}
              {/* License */}
              <div className="card p-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">License</h3>
                <LicenseBadge
                  licenseType={design.license_type}
                  creatorName={design.creator.display_name || design.creator.username}
                  designTitle={design.title}
                  variant="full"
                />
              </div>

              {(categories.length > 0 || styles.length > 0 || tags.length > 0) && (
                <div className="card p-6">
                  {categories.length > 0 && (
                    <div className="mb-3">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Categories</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {categories.map((cat: any) => (
                          <Link
                            key={cat.id}
                            href={`/categories/${cat.slug}`}
                            className="badge bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {styles.length > 0 && (
                    <div className="mb-3">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Styles</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {styles.map((style: any) => (
                          <Link
                            key={style.id}
                            href={`/styles/${style.slug}`}
                            className="badge bg-wood-100 text-wood-700 hover:bg-wood-200 transition-colors"
                          >
                            {style.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {tags.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag: string) => (
                          <span key={tag} className="badge bg-gray-100 text-gray-600">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

          {/* Similar Designs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SuggestionReel
              title="You Might Also Like"
              subtitle="Designs similar to this one"
              type="similar"
              designId={params.id}
              limit={8}
            />
            {categories.length > 0 && (
              <SuggestionReel
                title={`More in ${categories[0].name}`}
                type="category"
                category={categories[0].slug}
                limit={8}
              />
            )}
          </div>
      </main>
      <Footer />
    </>
  );
}
