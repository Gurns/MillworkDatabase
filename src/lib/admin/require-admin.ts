import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/database';

type AdminRole = Pick<Database['millwork']['Tables']['users']['Row'], 'role'>;

export async function requireAdmin() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), user: null, supabase };
  }

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  const profile = data as AdminRole | null;

  if (!profile || profile.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 }), user: null, supabase };
  }

  return { error: null, user, supabase };
}

export async function logAdminAction(
  supabase: any,
  adminId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  details?: Record<string, any>
) {
  await supabase.from('admin_audit_log').insert({
    admin_id: adminId,
    action,
    target_type: targetType,
    target_id: targetId,
    details,
  });
}
