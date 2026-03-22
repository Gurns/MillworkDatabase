import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, logAdminAction } from '@/lib/admin/require-admin';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { error, user, supabase } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const allowedFields = ['title', 'description', 'long_description', 'status', 'is_free', 'price_cents', 'material', 'difficulty_level'];
  const updates: Record<string, any> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  if (body.status === 'published' && !updates.published_at) {
    updates.published_at = new Date().toISOString();
  }

  updates.updated_at = new Date().toISOString();

  const { data, error: dbError } = await supabase
    .from('designs')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  await logAdminAction(supabase, user!.id, 'update_design', 'design', params.id, updates);

  return NextResponse.json({ design: data });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { error, user, supabase } = await requireAdmin();
  if (error) return error;

  // Archive instead of hard delete
  const { error: dbError } = await supabase
    .from('designs')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', params.id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  await logAdminAction(supabase, user!.id, 'archive_design', 'design', params.id);

  return NextResponse.json({ success: true });
}
