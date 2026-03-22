import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1).max(5000),
  parent_comment_id: z.string().uuid().optional(),
});

// GET /api/designs/[id]/comments
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const perPage = 20;
  const from = (page - 1) * perPage;

  const { data: comments, count, error } = await supabase
    .from('comments')
    .select(
      `
      *,
      author:users!comments_author_id_fkey(id, username, display_name, avatar_url)
    `,
      { count: 'exact' }
    )
    .eq('design_id', params.id)
    .is('parent_comment_id', null) // Only top-level comments
    .order('created_at', { ascending: false })
    .range(from, from + perPage - 1);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }

  // Fetch replies for each top-level comment
  const commentsWithReplies = await Promise.all(
    (comments || []).map(async (comment) => {
      const { data: replies } = await supabase
        .from('comments')
        .select(
          `
          *,
          author:users!comments_author_id_fkey(id, username, display_name, avatar_url)
        `
        )
        .eq('parent_comment_id', comment.id)
        .order('created_at', { ascending: true });

      return { ...comment, replies: replies || [] };
    })
  );

  return NextResponse.json({
    data: commentsWithReplies,
    total: count || 0,
    page,
    per_page: perPage,
  });
}

// POST /api/designs/[id]/comments
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validated = commentSchema.safeParse(body);

  if (!validated.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { data: comment, error } = await supabase
    .from('comments')
    .insert({
      design_id: params.id,
      author_id: user.id,
      content: validated.data.content,
      parent_comment_id: validated.data.parent_comment_id || null,
    })
    .select(
      `
      *,
      author:users!comments_author_id_fkey(id, username, display_name, avatar_url)
    `
    )
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }

  return NextResponse.json(comment, { status: 201 });
}
