import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { createDesignSchema } from '@/lib/validators/design';
import { uniqueSlug } from '@/lib/utils';
import { ITEMS_PER_PAGE, MAX_ITEMS_PER_PAGE } from '@/lib/utils/constants';

// GET /api/designs — List/search designs
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const perPage = Math.min(
    MAX_ITEMS_PER_PAGE,
    Math.max(1, parseInt(searchParams.get('per_page') || String(ITEMS_PER_PAGE)))
  );
  const sort = searchParams.get('sort') || 'newest';
  const category = searchParams.get('category');
  const style = searchParams.get('style');
  const priceFilter = searchParams.get('price');
  const difficulty = searchParams.get('difficulty');
  const q = searchParams.get('q');

  const supabase = createServerSupabaseClient();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from('designs')
    .select(
      `
      *,
      creator:users!designs_creator_id_fkey(id, username, display_name, avatar_url)
    `,
      { count: 'exact' }
    )
    .eq('status', 'published');

  // Full-text search
  if (q) {
    query = query.textSearch('search_vector', q, { type: 'websearch', config: 'english' });
  }

  // Filters
  if (priceFilter === 'free') query = query.eq('is_free', true);
  if (priceFilter === 'paid') query = query.eq('is_free', false);
  if (difficulty) query = query.eq('difficulty_level', difficulty);

  // Sorting
  switch (sort) {
    case 'popular':
      query = query.order('favorite_count', { ascending: false });
      break;
    case 'most_downloaded':
      query = query.order('download_count', { ascending: false });
      break;
    case 'trending':
      query = query.order('view_count', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('published_at', { ascending: false });
  }

  query = query.range(from, to);

  const { data: designs, count, error } = await query;

  if (error) {
    console.error('Failed to fetch designs:', error);
    return NextResponse.json({ error: 'Failed to fetch designs' }, { status: 500 });
  }

  return NextResponse.json({
    data: designs || [],
    total: count || 0,
    page,
    per_page: perPage,
    total_pages: Math.ceil((count || 0) / perPage),
  });
}

// POST /api/designs — Create a new design
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createDesignSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { category_ids, style_ids, tags, ...designData } = validated.data;

    // Create the design
    const slug = uniqueSlug(designData.title);
    const { data: design, error: createError } = await supabase
      .from('designs')
      .insert({
        ...designData,
        slug,
        creator_id: user.id,
        status: 'draft',
      })
      .select()
      .single();

    if (createError) {
      console.error('Failed to create design:', createError);
      return NextResponse.json({ error: 'Failed to create design' }, { status: 500 });
    }

    // Add categories
    if (category_ids.length > 0) {
      await supabase.from('design_categories').insert(
        category_ids.map((category_id) => ({
          design_id: design.id,
          category_id,
        }))
      );
    }

    // Add styles
    if (style_ids.length > 0) {
      await supabase.from('design_styles').insert(
        style_ids.map((style_id) => ({
          design_id: design.id,
          style_id,
        }))
      );
    }

    // Add manual tags
    if (tags && tags.length > 0) {
      await supabase.from('design_tags').insert(
        tags.map((tag_name) => ({
          design_id: design.id,
          tag_name,
          tag_type: 'manual' as const,
        }))
      );
    }

    return NextResponse.json({ design }, { status: 201 });
  } catch (error) {
    console.error('Create design error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
