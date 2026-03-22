import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateCollectionSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  is_public: z.boolean().optional(),
});

// GET /api/collections/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();

  const { data: collection, error } = await supabase
    .from('collections')
    .select(`
      *,
      creator:users!collections_creator_id_fkey(id, username, display_name, avatar_url),
      designs:collection_designs(
        display_order,
        design:designs(
          *,
          creator:users!designs_creator_id_fkey(id, username, display_name, avatar_url)
        )
      )
    `)
    .eq('id', params.id)
    .single();

  if (error || !collection) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  // Check visibility
  const { data: { user } } = await supabase.auth.getUser();
  if (!collection.is_public && collection.creator_id !== user?.id) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...collection,
    designs: collection.designs
      ?.sort((a: any, b: any) => a.display_order - b.display_order)
      .map((cd: any) => cd.design)
      .filter(Boolean) || [],
  });
}

// PATCH /api/collections/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const validated = updateCollectionSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json({ error: 'Validation failed', details: validated.error.flatten().fieldErrors }, { status: 400 });
  }

  const { error } = await supabase
    .from('collections')
    .update(validated.data)
    .eq('id', params.id)
    .eq('creator_id', user.id);

  if (error) return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
  return NextResponse.json({ message: 'Collection updated' });
}

// DELETE /api/collections/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', params.id)
    .eq('creator_id', user.id);

  if (error) return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
  return NextResponse.json({ message: 'Collection deleted' });
}
