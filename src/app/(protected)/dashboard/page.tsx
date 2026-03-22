import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getLevelForPoints, LEVELS } from '@/lib/utils/constants';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch user profile + stats
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Fetch recent designs
  const { data: recentDesigns, count: designCount } = await supabase
    .from('designs')
    .select('id, title, slug, status, view_count, download_count, favorite_count, published_at, created_at', { count: 'exact' })
    .eq('creator_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch recent favorites count
  const { count: favCount } = await supabase
    .from('favorites')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const level = getLevelForPoints(stats?.total_points || 0);
  const nextLevel = LEVELS.find((l) => l.min_points > (stats?.total_points || 0));
  const progressToNext = nextLevel
    ? ((stats?.total_points || 0) - level.min_points) / (nextLevel.min_points - level.min_points) * 100
    : 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Welcome back, {profile?.display_name || profile?.username || 'there'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here&apos;s what&apos;s happening with your designs.</p>
        </div>
        <Link href="/dashboard/designs/new" className="btn-primary text-sm">
          Upload Design
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Designs" value={designCount || 0} icon="layers" />
        <StatCard label="Total Downloads" value={stats?.total_downloads_received || 0} icon="download" />
        <StatCard label="Favorites Received" value={stats?.favorites_received || 0} icon="heart" />
        <StatCard label="Points" value={stats?.total_points || 0} icon="star" />
      </div>

      {/* Level progress */}
      <div className="card p-5 mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-sm font-medium text-gray-900">Level {level.level}: {level.name}</span>
            {nextLevel && (
              <span className="text-xs text-gray-500 ml-2">
                {nextLevel.min_points - (stats?.total_points || 0)} points to {nextLevel.name}
              </span>
            )}
          </div>
          <span className="text-sm font-semibold text-brand-600">{stats?.total_points || 0} pts</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-brand-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressToNext, 100)}%` }}
          />
        </div>
      </div>

      {/* Recent designs */}
      <div className="card">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Designs</h2>
            <Link href="/dashboard/designs" className="text-sm text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>
        </div>
        {recentDesigns && recentDesigns.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentDesigns.map((design) => (
              <Link
                key={design.id}
                href={`/dashboard/designs/${design.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900">{design.title}</span>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className={`badge text-xs ${
                      design.status === 'published' ? 'bg-green-100 text-green-700' :
                      design.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {design.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(design.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{design.view_count} views</span>
                  <span>{design.download_count} downloads</span>
                  <span>{design.favorite_count} likes</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-3">You haven&apos;t uploaded any designs yet.</p>
            <Link href="/dashboard/designs/new" className="btn-primary text-sm">
              Upload Your First Design
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
    </div>
  );
}
