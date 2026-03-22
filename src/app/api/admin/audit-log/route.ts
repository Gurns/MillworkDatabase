import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/require-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
  const page = parseInt(searchParams.get('page') || '1');
  const offset = (page - 1) * limit;

  const { data, count, error: dbError } = await supabase
    .from('admin_audit_log')
    .select('*, admin:users!admin_audit_log_admin_id_fkey(username, display_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ entries: data || [], total: count || 0, page, limit });
}
