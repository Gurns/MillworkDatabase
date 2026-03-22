import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/recommendations?type=trending|similar|personalized|category
// &design_id=xxx (for similar)
// &category=xxx (for category)
// &limit=12
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'trending';
  const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '12')), 24);

  const supabase = createServerSupabaseClient();

  try {
    switch (type) {
      case 'similar': {
        const designId = searchParams.get('design_id');
        if (!designId) {
          return NextResponse.json({ error: 'design_id required for similar recommendations' }, { status: 400 });
        }
        const { data, error } = await supabase.rpc('get_similar_designs', {
          p_design_id: designId,
          p_limit: limit,
        });
        if (error) throw error;
        return NextResponse.json({ designs: data || [] });
      }

      case 'personalized': {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // Fall back to trending for anonymous users
          const { data, error } = await supabase.rpc('get_trending_designs', {
            p_limit: limit,
            p_days: 30,
          });
          if (error) throw error;
          return NextResponse.json({ designs: data || [], fallback: 'trending' });
        }
        const { data, error } = await supabase.rpc('get_personalized_suggestions', {
          p_user_id: user.id,
          p_limit: limit,
        });
        if (error) throw error;
        // If no personalized results yet, fall back to trending
        if (!data || data.length === 0) {
          const { data: trending, error: tErr } = await supabase.rpc('get_trending_designs', {
            p_limit: limit,
            p_days: 30,
          });
          if (tErr) throw tErr;
          return NextResponse.json({ designs: trending || [], fallback: 'trending' });
        }
        return NextResponse.json({ designs: data });
      }

      case 'category': {
        const categorySlug = searchParams.get('category');
        if (!categorySlug) {
          return NextResponse.json({ error: 'category required for category recommendations' }, { status: 400 });
        }
        const { data, error } = await supabase.rpc('get_popular_by_category', {
          p_category_slug: categorySlug,
          p_limit: limit,
        });
        if (error) throw error;
        return NextResponse.json({ designs: data || [] });
      }

      case 'trending':
      default: {
        const days = Math.min(Math.max(1, parseInt(searchParams.get('days') || '30')), 90);
        const { data, error } = await supabase.rpc('get_trending_designs', {
          p_limit: limit,
          p_days: days,
        });
        if (error) throw error;
        return NextResponse.json({ designs: data || [] });
      }
    }
  } catch (err) {
    console.error('Recommendation error:', err);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}
