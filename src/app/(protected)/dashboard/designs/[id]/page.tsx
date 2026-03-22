'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Design } from '@/types';

export default function EditDesignPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const designId = params.id as string;

  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDesign() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('designs')
          .select('*')
          .eq('id', designId)
          .eq('creator_id', user.id)
          .single();

        if (fetchError || !data) {
          setError('Design not found or you do not have permission to edit it.');
          console.error(fetchError);
        } else {
          setDesign(data);
        }
      } catch (err) {
        setError('Something went wrong');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (designId) {
      fetchDesign();
    }
  }, [router, supabase, designId]);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Edit Design</h1>
        <p className="text-sm text-gray-500 mb-6">Loading...</p>
        <div className="card p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      </div>
    );
  }

  if (error || !design) {
    return (
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Edit Design</h1>
        <div className="card p-8 text-center">
          <p className="text-red-600 mb-4">{error || 'Design not found'}</p>
          <Link href="/dashboard/designs" className="btn-primary">
            Back to My Designs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/designs" className="text-brand-600 hover:text-brand-700 text-sm mb-4 inline-block">
          ← Back to My Designs
        </Link>
        <h1 className="text-2xl font-display font-bold text-gray-900">Edit Design</h1>
        <p className="text-sm text-gray-500 mt-1">{design.title}</p>
      </div>

      <div className="card p-8">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit functionality coming soon</h2>
          <p className="text-gray-600 mb-6">
            Full design editing capabilities are being developed. For now, you can view your design details below.
          </p>
          <Link
            href={`/dashboard/designs/new?edit=${design.id}`}
            className="btn-primary inline-block"
          >
            Edit via Upload Page
          </Link>
        </div>

        {/* Design preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Title</h3>
            <p className="text-gray-700">{design.title}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
            <span className={`badge px-3 py-1 rounded-full text-sm ${
              design.status === 'published' ? 'bg-green-100 text-green-700' :
              design.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {design.status}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Created</h3>
            <p className="text-gray-700">{new Date(design.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {design.description && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{design.description}</p>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-gray-200 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Views</p>
            <p className="text-2xl font-bold text-gray-900">{design.view_count}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Downloads</p>
            <p className="text-2xl font-bold text-gray-900">{design.download_count}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Likes</p>
            <p className="text-2xl font-bold text-gray-900">{design.favorite_count}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Price</p>
            <p className="text-2xl font-bold text-gray-900">
              {design.is_free ? 'Free' : `$${(design.price_cents / 100).toFixed(2)}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
