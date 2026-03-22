import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerSupabaseClient();
  const { data: provider } = await supabase
    .from('users')
    .select('display_name, username, bio')
    .eq('id', params.id)
    .eq('is_cnc_provider', true)
    .single();

  if (!provider) {
    return {
      title: 'Provider Not Found',
    };
  }

  return {
    title: `${provider.display_name || provider.username} - CNC Provider`,
    description: provider.bio || `CNC provider profile on MillworkDatabase.`,
  };
}

export default async function CNCProviderDetailPage({ params }: Props) {
  const supabase = createServerSupabaseClient();

  // Fetch provider
  const { data: provider } = await supabase
    .from('users')
    .select('id, username, display_name, avatar_url, bio, email')
    .eq('id', params.id)
    .eq('is_cnc_provider', true)
    .single();

  if (!provider) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back link */}
          <Link href="/cnc-providers" className="text-brand-600 hover:text-brand-700 font-medium text-sm mb-8 inline-flex items-center">
            ← Back to providers
          </Link>

          {/* Provider profile card */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Avatar */}
              {provider.avatar_url && (
                <div className="flex-shrink-0">
                  <img
                    src={provider.avatar_url}
                    alt={provider.display_name || provider.username}
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                </div>
              )}

              {/* Profile info */}
              <div className="flex-1">
                <h1 className="text-3xl font-display font-bold text-gray-900">
                  {provider.display_name || provider.username}
                </h1>
                <p className="text-gray-500 mb-4">
                  @{provider.username}
                </p>

                {provider.bio && (
                  <p className="text-gray-600 mb-6 text-base leading-relaxed">
                    {provider.bio}
                  </p>
                )}

                {/* Contact CTA */}
                <div className="flex gap-3">
                  <a
                    href={`mailto:${provider.email}`}
                    className="inline-block px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
                  >
                    Contact Provider
                  </a>
                  <Link
                    href="/cnc-providers"
                    className="inline-block px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    View Other Providers
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Coming soon sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Services */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-display font-bold text-gray-900 mb-4">
                Services & Specialties
              </h2>
              <div className="bg-gray-50 rounded p-6 text-center">
                <p className="text-gray-500">Coming soon</p>
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-display font-bold text-gray-900 mb-4">
                Portfolio
              </h2>
              <div className="bg-gray-50 rounded p-6 text-center">
                <p className="text-gray-500">Coming soon</p>
              </div>
            </div>
          </div>

          {/* Reviews section - coming soon */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mt-8">
            <h2 className="text-xl font-display font-bold text-gray-900 mb-4">
              Reviews & Testimonials
            </h2>
            <div className="bg-gray-50 rounded p-6 text-center">
              <p className="text-gray-500">Coming soon</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
