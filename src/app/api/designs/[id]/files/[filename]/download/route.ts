import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';

// GET /api/designs/[id]/files/[filename]/download — Generate signed download URL
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; filename: string } }
) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Please sign in to download files' }, { status: 401 });
  }

  // Validate filename to prevent path traversal
  const decodedFilename = decodeURIComponent(params.filename);
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._\- ]*$/.test(decodedFilename) || decodedFilename.includes('..')) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }

  // Get design details
  const { data: design } = await supabase
    .from('designs')
    .select('id, creator_id, is_free, status')
    .eq('id', params.id)
    .single();

  if (!design || design.status !== 'published') {
    return NextResponse.json({ error: 'Design not found' }, { status: 404 });
  }

  // Authorization: free designs are open, paid designs require purchase
  if (!design.is_free && design.creator_id !== user.id) {
    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('design_id', params.id)
      .single();

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase required to download this file' }, { status: 403 });
    }
  }

  // Get file record
  const { data: file } = await supabase
    .from('design_files')
    .select('file_path, file_name')
    .eq('design_id', params.id)
    .eq('file_name', decodedFilename)
    .single();

  if (!file) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  // Generate signed URL using service role (bypasses RLS on private bucket)
  const serviceClient = createServiceRoleClient();
  const { data: signedUrl, error } = await serviceClient.storage
    .from('design-models')
    .createSignedUrl(file.file_path, 3600); // 1 hour expiry

  if (error || !signedUrl) {
    return NextResponse.json({ error: 'Failed to generate download link' }, { status: 500 });
  }

  // Record the download
  await supabase.from('downloads').insert({
    user_id: user.id,
    design_id: params.id,
    file_type: file.file_name.split('.').pop() || null,
  });

  return NextResponse.json({ url: signedUrl.signedUrl });
}
