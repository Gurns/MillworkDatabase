import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, logAdminAction } from '@/lib/admin/require-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
  const search = searchParams.get('search') || '';
  const role = searchParams.get('role') || '';
  const offset = (page - 1) * limit;

  let query = supabase
    .from('users')
    .select('*, user_stats(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%,display_name.ilike.%${search}%`);
  }
  if (role) {
    query = query.eq('role', role);
  }

  const { data, count, error: dbError } = await query;
  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ users: data || [], total: count || 0, page, limit });
}
