'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface Collection {
  id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  design_count?: number;
}

export default function CollectionsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('design_collections')
          .select(`
            id,
            name,
            description,
            is_public,
            created_at,
            collection_designs (id)
          `)
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) {
          setError('Failed to load collections');
          console.error(fetchError);
        } else {
          const withCounts = (data || []).map((c: any) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            is_public: c.is_public,
            created_at: c.created_at,
            design_count: c.collection_designs?.length || 0,
          }));
          setCollections(withCounts);
        }
      } catch (err) {
        setError('Something went wrong');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, [router, supabase]);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Collections</h1>
        <p className="text-sm text-gray-500 mb-6">Loading your collections...</p>
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
          <h1 className="text-2xl font-display font-bold text-gray-900">Collections</h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize and share your favorite designs. {collections.length} collections.
          </p>
        </div>
        <Link href="/dashboard/collections/new" className="btn-primary text-sm">
          Create Collection
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {collections.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No collections yet</h3>
          <p className="text-gray-500 mb-6">
            Collections help you organize and curate designs. Create your first collection to get started.
          </p>
          <Link href="/dashboard/collections/new" className="btn-primary">
            Create Your First Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/dashboard/collections/${collection.id}`}
              className="card p-6 hover:shadow-lg transition-shadow group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                </div>
                {collection.is_public && (
                  <span className="badge bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex-shrink-0">
                    Public
                  </span>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  {collection.design_count} {collection.design_count === 1 ? 'design' : 'designs'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Created {new Date(collection.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Feature preview section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="bg-gradient-to-r from-brand-50 to-blue-50 rounded-xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Collections Coming Soon</h3>
          <p className="text-gray-600 mb-4">
            We&apos;re building powerful collection features including:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Organize designs by theme or project
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Share collections with the community
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Collaborate on design collections
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
