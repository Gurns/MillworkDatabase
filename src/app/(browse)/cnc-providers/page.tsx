import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CNC Providers',
  description: 'Find experienced CNC machining providers who can bring your millwork designs to life.',
};

export default async function CNCProvidersPage() {
  const supabase = createServerSupabaseClient();

  // Fetch CNC providers
  const { data: providers } = await supabase
    .from('users')
    .select('id, username, display_name, avatar_url, bio')
    .eq('is_cnc_provider', true)
    .order('display_name', { ascending: true });

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page header */}
          <div className="mb-12">
            <h1 className="text-3xl font-display font-bold text-gray-900">
              CNC Providers
            </h1>
            <p className="text-lg text-gray-600 mt-2 max-w-2xl">
              Connect with skilled CNC machining professionals who can manufacture millwork designs.
            </p>
          </div>

          {/* Coming soon message if no providers */}
          {!providers || providers.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">
                  Coming Soon
                </h2>
                <p className="text-gray-600 mb-6">
                  We're building a network of professional CNC providers. Be among the first to join our community.
                </p>
                <Link
                  href="/dashboard/cnc-profile"
                  className="inline-block px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Register as CNC Provider
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Providers grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {providers.map((provider) => (
                  <Link
                    key={provider.id}
                    href={`/cnc-providers/${provider.id}`}
                    className="bg-white rounded-lg border border-gray-200 hover:border-brand-300 hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Avatar */}
                      {provider.avatar_url && (
                        <div className="mb-4">
                          <img
                            src={provider.avatar_url}
                            alt={provider.display_name || provider.username}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        </div>
                      )}

                      {/* Name */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {provider.display_name || provider.username}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        @{provider.username}
                      </p>

                      {/* Bio */}
                      {provider.bio && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {provider.bio}
                        </p>
                      )}

                      {/* CTA */}
                      <div className="inline-flex items-center text-brand-600 font-medium text-sm">
                        View Profile →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Registration CTA */}
              <div className="bg-brand-50 border border-brand-200 rounded-lg p-8 text-center">
                <h2 className="text-xl font-display font-bold text-gray-900 mb-2">
                  Are you a CNC provider?
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Join our network and connect with designers and manufacturers looking for your expertise.
                </p>
                <Link
                  href="/dashboard/cnc-profile"
                  className="inline-block px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Create Your Provider Profile
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
