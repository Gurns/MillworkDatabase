import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, logAdminAction } from '@/lib/admin/require-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { data, error: dbError } = await supabase
    .from('site_settings')
    .select('*')
    .order('key');

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ settings: data || [] });
}

export async function PATCH(request: NextRequest) {
  const { error, user, supabase } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  // body is { key: value, key2: value2, ... }

  const updates = Object.entries(body).map(([key, value]) => ({
    key,
    value: JSON.stringify(value),
    updated_by: user!.id,
    updated_at: new Date().toISOString(),
  }));

  for (const update of updates) {
    const { error: dbError } = await supabase
      .from('site_settings')
      .upsert(update, { onConflict: 'key' });

    if (dbError) {
      return NextResponse.json({ error: `Failed to update ${update.key}: ${dbError.message}` }, { status: 500 });
    }
  }

  await logAdminAction(supabase, user!.id, 'update_settings', 'setting', undefined, body);

  return NextResponse.json({ success: true });
}
