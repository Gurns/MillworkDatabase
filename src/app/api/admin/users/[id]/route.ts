import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, logAdminAction } from '@/lib/admin/require-admin';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { error, user, supabase } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const allowedFields = ['role', 'is_banned', 'banned_reason', 'display_name', 'bio', 'is_cnc_provider'];
  const updates: Record<string, any> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  if (updates.is_banned === true) {
    updates.banned_at = new Date().toISOString();
  } else if (updates.is_banned === false) {
    updates.banned_at = null;
    updates.banned_reason = null;
  }

  updates.updated_at = new Date().toISOString();

  const { data, error: dbError } = await supabase
    .from('users')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  await logAdminAction(supabase, user!.id, 'update_user', 'user', params.id, updates);

  return NextResponse.json({ user: data });
}
