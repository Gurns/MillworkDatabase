import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// DELETE /api/favorites/[design_id] — Remove from favorites
export async function DELETE(
  request: NextRequest,
  { params }: { params: { design_id: string } }
) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('design_id', params.design_id);

  if (error) {
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Removed from favorites' });
}
