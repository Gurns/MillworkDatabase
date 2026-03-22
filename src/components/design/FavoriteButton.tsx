'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  designId: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
}

export function FavoriteButton({ designId, initialFavorited, isLoggedIn }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function toggle() {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/designs/${designId}`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (favorited) {
        const res = await fetch(`/api/favorites/${designId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to remove favorite');
        setFavorited(false);
      } else {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ design_id: designId }),
        });
        if (!res.ok) throw new Error('Failed to add favorite');
        setFavorited(true);
      }
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
    {error && <p className="text-red-500 text-xs mb-1 text-center">{error}</p>}
    <button
      onClick={toggle}
      disabled={loading}
      className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
        favorited
          ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
          : 'bg-brand-600 text-white hover:bg-brand-700'
      } disabled:opacity-50`}
    >
      <svg
        className="w-4 h-4"
        fill={favorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {favorited ? 'Saved to Favorites' : 'Add to Favorites'}
    </button>
    </div>
  );
}
