import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/categories — List all categories (with subcategories)
export async function GET() {
  const supabase = createServerSupabaseClient();

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }

  // Build tree structure
  const topLevel = categories?.filter((c) => !c.parent_category_id) || [];
  const tree = topLevel.map((parent) => ({
    ...parent,
    children: categories?.filter((c) => c.parent_category_id === parent.id) || [],
  }));

  return NextResponse.json(tree);
}
