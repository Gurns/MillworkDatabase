'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

interface Purchase {
  id: string;
  design_id: string;
  amount_cents: number;
  created_at: string;
  design: {
    title: string;
    slug: string;
    primary_image_url: string | null;
  } | null;
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadPurchases() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('purchases')
          .select(`
            id,
            design_id,
            amount_cents,
            created_at,
            design:designs(title, slug, primary_image_url)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setPurchases(data as unknown as Purchase[]);
        }
      } catch (err) {
        console.error('Error loading purchases:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPurchases();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Purchases</h1>

      {purchases.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h2>
          <p className="text-gray-500 mb-4">When you purchase premium designs, they&apos;ll appear here.</p>
          <Link
            href="/designs"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Designs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                {purchase.design?.primary_image_url ? (
                  <img
                    src={purchase.design.primary_image_url}
                    alt={purchase.design?.title || 'Design'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/designs/${purchase.design?.slug || purchase.design_id}`}
                  className="font-medium text-gray-900 hover:text-blue-600 truncate block"
                >
                  {purchase.design?.title || 'Design'}
                </Link>
                <p className="text-sm text-gray-500">
                  Purchased {new Date(purchase.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <span className="font-medium text-gray-900">
                  ${(purchase.amount_cents / 100).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
