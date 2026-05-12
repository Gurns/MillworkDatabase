import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/require-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { data, error: rpcError } = await supabase.rpc('get_admin_stats');
  if (rpcError) {
    console.error('Admin stats fetch error:', rpcError);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }

  return NextResponse.json(data?.[0] || {});
}
