'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  bio?: string;
  website?: string;
  location?: string;
  avatar_url?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    website: '',
    location: '',
    avatar_url: '',
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('users')
          .select('id, username, display_name, bio, website, location, avatar_url')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          setError('Failed to load profile');
          console.error(fetchError);
        } else if (data) {
          setProfile(data);
          setFormData({
            display_name: data.display_name || '',
            bio: data.bio || '',
            website: data.website || '',
            location: data.location || '',
            avatar_url: data.avatar_url || '',
          });
        }
      } catch (err) {
        setError('Something went wrong');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Not authenticated');
        return;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          display_name: formData.display_name,
          bio: formData.bio || null,
          website: formData.website || null,
          location: formData.location || null,
          avatar_url: formData.avatar_url || null,
        })
        .eq('id', user.id);

      if (updateError) {
        setError('Failed to save profile');
        console.error(updateError);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        if (profile) {
          setProfile({
            ...profile,
            ...formData,
          });
        }
      }
    } catch (err) {
      setError('Something went wrong');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-sm text-gray-500 mb-6">Loading your profile...</p>
        <div className="card p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Profile Settings</h1>
        <div className="card p-8 text-center">
          <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Profile Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your public profile information</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
          Profile updated successfully
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {/* Avatar */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Profile Picture</h2>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {formData.avatar_url ? (
                <img
                  src={formData.avatar_url}
                  alt={profile.display_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                className="input-field"
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter the URL of your profile picture (JPG, PNG, WebP)
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                disabled
                value={profile.username}
                className="input-field bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">
                Username cannot be changed
              </p>
            </div>

            <div>
              <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                id="display_name"
                type="text"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                className="input-field"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="input-field"
                placeholder="Tell the community about yourself"
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.bio.length}/200 characters
              </p>
            </div>
          </div>
        </div>

        {/* Location & Web */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Location & Web</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input-field"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="input-field"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Additional Info */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="card p-6 bg-blue-50">
          <h3 className="font-semibold text-gray-900 mb-2">Account Information</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium">User ID:</span> {profile.id}
            </p>
            <p>
              <span className="font-medium">Username:</span> @{profile.username}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
