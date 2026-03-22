import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/users/[id] — Get public user profile
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();

  // Support lookup by ID or username
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id);

  let userQuery = supabase.from('users').select('*');
  if (isUuid) {
    userQuery = userQuery.eq('id', params.id);
  } else {
    userQuery = userQuery.eq('username', params.id);
  }

  const { data: user, error } = await userQuery.single();

  if (error || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Get stats
  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Get badges
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('badge:badges(*), earned_at')
    .eq('user_id', user.id)
    .order('earned_at', { ascending: false });

  // Get design count
  const { count: designCount } = await supabase
    .from('designs')
    .select('id', { count: 'exact', head: true })
    .eq('creator_id', user.id)
    .eq('status', 'published');

  return NextResponse.json({
    ...user,
    stats: stats || { total_points: 0, designs_created: 0, total_downloads_received: 0, favorites_received: 0, comments_made: 0, level: 1 },
    badges: userBadges?.map((ub: any) => ({ ...ub.badge, earned_at: ub.earned_at })) || [],
    design_count: designCount || 0,
  });
}
