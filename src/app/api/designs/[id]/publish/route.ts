import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// POST /api/designs/[id]/publish — Publish a draft design
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify ownership and check current status
  const { data: design } = await supabase
    .from('designs')
    .select('creator_id, status, title')
    .eq('id', params.id)
    .single();

  if (!design || design.creator_id !== user.id) {
    return NextResponse.json({ error: 'Design not found' }, { status: 404 });
  }

  if (design.status === 'published') {
    return NextResponse.json({ error: 'Design is already published' }, { status: 400 });
  }

  // Check minimum requirements for publishing
  const { data: images } = await supabase
    .from('design_images')
    .select('id')
    .eq('design_id', params.id)
    .limit(1);

  const { data: categories } = await supabase
    .from('design_categories')
    .select('category_id')
    .eq('design_id', params.id)
    .limit(1);

  if (!images || images.length === 0) {
    return NextResponse.json(
      { error: 'Please upload at least one image before publishing' },
      { status: 400 }
    );
  }

  if (!categories || categories.length === 0) {
    return NextResponse.json(
      { error: 'Please select at least one category before publishing' },
      { status: 400 }
    );
  }

  // Publish
  const { error } = await supabase
    .from('designs')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: 'Failed to publish design' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Design published successfully' });
}
