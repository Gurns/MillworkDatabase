import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/designs/search — Full-text search with filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ error: 'Search query must be at least 2 characters' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const perPage = 24;
  const from = (page - 1) * perPage;

  const { data, count, error } = await supabase
    .from('designs')
    .select(
      `*, creator:users!designs_creator_id_fkey(id, username, display_name, avatar_url)`,
      { count: 'exact' }
    )
    .eq('status', 'published')
    .textSearch('search_vector', q, { type: 'websearch', config: 'english' })
    .order('published_at', { ascending: false })
    .range(from, from + perPage - 1);

  if (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }

  return NextResponse.json({
    data: data || [],
    total: count || 0,
    page,
    per_page: perPage,
    total_pages: Math.ceil((count || 0) / perPage),
  });
}
