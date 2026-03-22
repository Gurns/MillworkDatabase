import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { updateDesignSchema } from '@/lib/validators/design';

// GET /api/designs/[id] — Get design detail
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: design, error } = await supabase
    .from('designs')
    .select(`
      *,
      creator:users!designs_creator_id_fkey(id, username, display_name, avatar_url, bio),
      images:design_images(id, image_url, thumbnail_url, alt_text, display_order),
      files:design_files(id, file_name, file_type, file_size_bytes),
      categories:design_categories(category:categories(id, name, slug)),
      styles:design_styles(style:styles(id, name, slug)),
      tags:design_tags(tag_name, tag_type)
    `)
    .eq('id', params.id)
    .single();

  if (error || !design) {
    return NextResponse.json({ error: 'Design not found' }, { status: 404 });
  }

  // Only allow viewing published designs or own drafts
  if (design.status !== 'published' && design.creator_id !== user?.id) {
    return NextResponse.json({ error: 'Design not found' }, { status: 404 });
  }

  // Check if user has favorited this design
  let is_favorited = false;
  if (user) {
    const { data: fav } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('design_id', params.id)
      .single();
    is_favorited = !!fav;
  }

  // Increment view count (fire and forget)
  supabase
    .from('designs')
    .update({ view_count: design.view_count + 1 })
    .eq('id', params.id)
    .then(() => {});

  // Flatten the nested joins
  const response = {
    ...design,
    categories: design.categories?.map((dc: any) => dc.category) || [],
    styles: design.styles?.map((ds: any) => ds.style) || [],
    tags: design.tags?.map((t: any) => t.tag_name) || [],
    is_favorited,
  };

  return NextResponse.json(response);
}

// PATCH /api/designs/[id] — Update design
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from('designs')
    .select('creator_id')
    .eq('id', params.id)
    .single();

  if (!existing || existing.creator_id !== user.id) {
    return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
  }

  const body = await request.json();
  const validated = updateDesignSchema.safeParse(body);

  if (!validated.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { category_ids, style_ids, tags, ...designData } = validated.data;

  // Update design fields
  if (Object.keys(designData).length > 0) {
    const { error: updateError } = await supabase
      .from('designs')
      .update(designData)
      .eq('id', params.id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update design' }, { status: 500 });
    }
  }

  // Update categories if provided
  if (category_ids !== undefined) {
    await supabase.from('design_categories').delete().eq('design_id', params.id);
    if (category_ids.length > 0) {
      await supabase.from('design_categories').insert(
        category_ids.map((category_id) => ({ design_id: params.id, category_id }))
      );
    }
  }

  // Update styles if provided
  if (style_ids !== undefined) {
    await supabase.from('design_styles').delete().eq('design_id', params.id);
    if (style_ids.length > 0) {
      await supabase.from('design_styles').insert(
        style_ids.map((style_id) => ({ design_id: params.id, style_id }))
      );
    }
  }

  // Update tags if provided
  if (tags !== undefined) {
    await supabase.from('design_tags').delete().eq('design_id', params.id).eq('tag_type', 'manual');
    if (tags.length > 0) {
      await supabase.from('design_tags').insert(
        tags.map((tag_name) => ({ design_id: params.id, tag_name, tag_type: 'manual' as const }))
      );
    }
  }

  return NextResponse.json({ message: 'Design updated' });
}

// DELETE /api/designs/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('designs')
    .delete()
    .eq('id', params.id)
    .eq('creator_id', user.id);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete design' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Design deleted' });
}
