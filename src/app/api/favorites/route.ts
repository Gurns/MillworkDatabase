import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/favorites — Get current user's favorites
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const perPage = 24;
  const from = (page - 1) * perPage;

  const { data: favorites, count, error } = await supabase
    .from('favorites')
    .select(
      `
      *,
      design:designs(
        *,
        creator:users!designs_creator_id_fkey(id, username, display_name, avatar_url)
      )
    `,
      { count: 'exact' }
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, from + perPage - 1);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }

  return NextResponse.json({
    data: favorites?.map((f: any) => f.design) || [],
    total: count || 0,
    page,
    per_page: perPage,
  });
}

// POST /api/favorites — Add to favorites
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { design_id } = await request.json();

  if (!design_id) {
    return NextResponse.json({ error: 'design_id is required' }, { status: 400 });
  }

  const { error } = await supabase.from('favorites').insert({
    user_id: user.id,
    design_id,
  });

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Already favorited' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Added to favorites' }, { status: 201 });
}
