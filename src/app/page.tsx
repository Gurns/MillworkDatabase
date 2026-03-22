import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SuggestionReel } from '@/components/design/SuggestionReel';
import { MAIN_CATEGORIES, ARCHITECTURAL_STYLES } from '@/lib/utils/constants';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-wood-900 via-wood-800 to-wood-950 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                Architectural Millwork,{' '}
                <span className="text-brand-400">Shared by the Community</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-wood-200 leading-relaxed">
                Browse thousands of millwork profiles — crown molding, baseboards, door casings,
                stair parts, mantels, and more. Download 3D files, CNC-cut your own, or find a
                provider to make them for you.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/designs"
                  className="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-500 transition-colors text-lg"
                >
                  Browse Designs
                </Link>
                <Link
                  href="/register"
                  className="bg-white/10 backdrop-blur text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-colors text-lg border border-white/20"
                >
                  Join the Community
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-wood-300">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free to use
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  STL, STEP, OBJ files
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  CNC-ready
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-8">
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MAIN_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="group card p-6 text-center hover:border-brand-300"
                >
                  <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-100 transition-colors">
                    <CategoryIcon name={category.icon} />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {category.slug === 'trim-and-molding' && 'Crown, baseboards, casings & more'}
                    {category.slug === 'stair-parts' && 'Newels, balusters & handrails'}
                    {category.slug === 'mantels' && 'Surrounds, shelves & legs'}
                    {category.slug === 'built-ins' && 'Paneling, shelving & doors'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Styles Section */}
        <section className="py-16 bg-wood-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
              Browse by Architectural Style
            </h2>
            <p className="text-gray-600 mb-8">
              Find millwork that matches your home&apos;s character.
            </p>
            <div className="flex flex-wrap gap-3">
              {ARCHITECTURAL_STYLES.map((style) => (
                <Link
                  key={style}
                  href={`/styles/${style.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                >
                  {style}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Suggestion Reels */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SuggestionReel
              title="Trending Designs"
              subtitle="Popular in the community this month"
              type="trending"
              limit={12}
            />
            <SuggestionReel
              title="Recommended for You"
              subtitle="Based on your favorites and downloads"
              type="personalized"
              limit={12}
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Find a Design</h3>
                <p className="text-gray-600 text-sm">
                  Browse by category, style, or search for exactly the millwork profile you need.
                  From Victorian crown to Craftsman baseboards.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Download the Files</h3>
                <p className="text-gray-600 text-sm">
                  Get STL, STEP, or raw 3D scan files ready for your CNC router. Free designs available with every account.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Cut or Order</h3>
                <p className="text-gray-600 text-sm">
                  Mill it yourself on your CNC router, or connect with a CNC service provider right here on the platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-brand-600">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Share your millwork designs with the world
            </h2>
            <p className="text-brand-100 mb-8">
              Upload your profiles, earn recognition in the community, and help preserve
              architectural history one design at a time.
            </p>
            <Link
              href="/register"
              className="inline-block bg-white text-brand-700 px-8 py-3 rounded-lg font-semibold hover:bg-brand-50 transition-colors"
            >
              Create a Free Account
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Simple icon component for categories
function CategoryIcon({ name }: { name: string }) {
  const iconClass = 'w-7 h-7 text-brand-600';
  switch (name) {
    case 'Ruler':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6h.01M6 10h.01M6 14h.01M6 18h.01M10 6h.01M14 6h.01M18 6h.01" />
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.5} />
        </svg>
      );
    case 'Stairs':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h4V17h4v-4h4V9h4V5h2" />
        </svg>
      );
    case 'Flame':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      );
    case 'LayoutGrid':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
          <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
          <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
          <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
        </svg>
      );
    default:
      return <div className={iconClass} />;
  }
}
