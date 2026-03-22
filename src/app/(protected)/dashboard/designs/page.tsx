'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Design } from '@/types';

export default function MyDesignsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDesigns() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('designs')
          .select('id, title, slug, status, view_count, download_count, favorite_count, published_at, created_at, primary_image_url')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) {
          setError('Failed to load designs');
          console.error(fetchError);
        } else {
          setDesigns(data || []);
        }
      } catch (err) {
        setError('Something went wrong');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDesigns();
  }, [router, supabase]);

  async function handleDelete(designId: string) {
    try {
      setDeleting(designId);
      const { error } = await supabase
        .from('designs')
        .delete()
        .eq('id', designId);

      if (error) {
        setError('Failed to delete design');
        console.error(error);
      } else {
        setDesigns((prev) => prev.filter((d) => d.id !== designId));
        setDeleteConfirm(null);
      }
    } finally {
      setDeleting(null);
    }
  }

  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-700',
    published: 'bg-green-100 text-green-700',
    archived: 'bg-gray-100 text-gray-700',
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">My Designs</h1>
        <p className="text-sm text-gray-500 mb-6">Loading your designs...</p>
        <div className="card p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">My Designs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all your designs. {designs.length} total.
          </p>
        </div>
        <Link href="/dashboard/designs/new" className="btn-primary text-sm">
          Upload New Design
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {designs.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6v6m0-6H6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No designs yet</h3>
          <p className="text-gray-500 mb-6">
            Start by uploading your first millwork design to the community.
          </p>
          <Link href="/dashboard/designs/new" className="btn-primary">
            Upload Your First Design
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {designs.map((design) => (
            <div key={design.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                {/* Thumbnail */}
                {design.primary_image_url && (
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
                    <img
                      src={design.primary_image_url}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 truncate">{design.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`badge text-xs px-2 py-0.5 rounded-full ${
                          statusColors[design.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-600'
                        }`}>
                          {design.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(design.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{design.view_count} views</span>
                    <span>{design.download_count} downloads</span>
                    <span>{design.favorite_count} likes</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/designs/${design.id}`}
                    className="px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                  >
                    Edit
                  </Link>
                  {design.status === 'published' && (
                    <Link
                      href={`/designs/${design.slug || design.id}`}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      View
                    </Link>
                  )}
                  <button
                    onClick={() => setDeleteConfirm(design.id)}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Delete confirmation */}
              {deleteConfirm === design.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    Are you sure? This action cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(design.id)}
                      disabled={deleting === design.id}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors"
                    >
                      {deleting === design.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
