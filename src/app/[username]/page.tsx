import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DesignGrid } from '@/components/design/DesignGrid';
import { getLevelForPoints } from '@/lib/utils/constants';
import type { Metadata } from 'next';

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `@${params.username}`,
    description: `View designs by ${params.username} on MillworkDatabase`,
  };
}

export default async function UserProfilePage({ params }: Props) {
  const supabase = createServerSupabaseClient();

  // Fetch user by username
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('username', params.username)
    .single();

  if (!profile) notFound();

  // Fetch stats
  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', profile.id)
    .single();

  // Fetch badges
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('badge:badges(name, slug, description, icon_name), earned_at')
    .eq('user_id', profile.id)
    .order('earned_at', { ascending: false })
    .limit(10);

  // Fetch published designs
  const { data: designs } = await supabase
    .from('designs')
    .select(`*, creator:users!designs_creator_id_fkey(id, username, display_name, avatar_url)`)
    .eq('creator_id', profile.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(24);

  // Fetch public collections
  const { data: collections } = await supabase
    .from('collections')
    .select('id, title, description, design_count, created_at')
    .eq('creator_id', profile.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(6);

  const level = getLevelForPoints(stats?.total_points || 0);

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile header */}
          <div className="card p-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-2xl font-bold shrink-0">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  (profile.display_name?.[0] || profile.username[0]).toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-display font-bold text-gray-900">
                  {profile.display_name || profile.username}
                </h1>
                <p className="text-sm text-gray-500 mb-2">@{profile.username}</p>
                {profile.bio && <p className="text-sm text-gray-700 mb-3">{profile.bio}</p>}

                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900">{stats?.designs_created || 0}</span>
                    <span className="text-gray-500 ml-1">designs</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{stats?.total_downloads_received || 0}</span>
                    <span className="text-gray-500 ml-1">downloads</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{stats?.total_points || 0}</span>
                    <span className="text-gray-500 ml-1">points</span>
                  </div>
                  <div className="badge bg-brand-100 text-brand-700">
                    Lvl {level.level} · {level.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            {userBadges && userBadges.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Badges</p>
                <div className="flex flex-wrap gap-2">
                  {userBadges.map((ub: any) => (
                    <span key={ub.badge.slug} className="badge bg-yellow-50 text-yellow-700 border border-yellow-200" title={ub.badge.description}>
                      {ub.badge.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Designs */}
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Designs</h2>
          <DesignGrid
            designs={designs || []}
            emptyMessage="This user hasn't published any designs yet."
          />

          {/* Collections */}
          {collections && collections.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Collections</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {collections.map((collection: any) => (
                  <div key={collection.id} className="card p-4">
                    <h3 className="font-medium text-gray-900">{collection.title}</h3>
                    {collection.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{collection.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">{collection.design_count} designs</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
