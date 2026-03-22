'use client';

import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Setting {
  key: string;
  label: string;
  value: string | boolean | number;
  type: 'text' | 'textarea' | 'number' | 'boolean';
  section: 'homepage' | 'browse' | 'system';
  description?: string;
}

const settingsSections: Record<string, string> = {
  homepage: 'Homepage',
  browse: 'Browse Page',
  system: 'System',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [changes, setChanges] = useState<Record<string, Setting['value']>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setSettings(data.settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: Setting['value']) => {
    setChanges((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (Object.keys(changes).length === 0) {
      setError('No changes to save');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      });

      if (!res.ok) throw new Error('Failed to save settings');
      await fetchSettings();
      setChanges({});
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  const groupedSettings = settings.reduce(
    (acc, setting) => {
      if (!acc[setting.section]) {
        acc[setting.section] = [];
      }
      acc[setting.section].push(setting);
      return acc;
    },
    {} as Record<string, Setting[]>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-600 mt-2">Configure application settings and options.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 mb-6">
          <p className="font-semibold">Success</p>
          <p className="text-sm">{success}</p>
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(groupedSettings).map(([section, sectionSettings]) => (
          <div key={section} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                {settingsSections[section] || section}
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {sectionSettings.map((setting) => (
                <div key={setting.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {setting.label}
                  </label>
                  {setting.description && (
                    <p className="text-xs text-gray-600 mb-2">{setting.description}</p>
                  )}
                  {setting.type === 'boolean' ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          changes[setting.key] !== undefined
                            ? (changes[setting.key] as boolean)
                            : (setting.value as boolean)
                        }
                        onChange={(e) =>
                          handleSettingChange(setting.key, e.target.checked)
                        }
                        className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm text-gray-700">
                        {(changes[setting.key] !== undefined
                          ? (changes[setting.key] as boolean)
                          : (setting.value as boolean))
                          ? 'Enabled'
                          : 'Disabled'}
                      </span>
                    </label>
                  ) : setting.type === 'textarea' ? (
                    <textarea
                      value={
                        changes[setting.key] !== undefined
                          ? (changes[setting.key] as string)
                          : (setting.value as string)
                      }
                      onChange={(e) =>
                        handleSettingChange(setting.key, e.target.value)
                      }
                      rows={4}
                      className="input-field w-full"
                      placeholder={`Enter ${setting.label.toLowerCase()}`}
                    />
                  ) : setting.type === 'number' ? (
                    <input
                      type="number"
                      value={
                        changes[setting.key] !== undefined
                          ? (changes[setting.key] as number)
                          : (setting.value as number)
                      }
                      onChange={(e) =>
                        handleSettingChange(setting.key, parseInt(e.target.value))
                      }
                      className="input-field w-full"
                      placeholder={`Enter ${setting.label.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={
                        changes[setting.key] !== undefined
                          ? (changes[setting.key] as string)
                          : (setting.value as string)
                      }
                      onChange={(e) =>
                        handleSettingChange(setting.key, e.target.value)
                      }
                      className="input-field w-full"
                      placeholder={`Enter ${setting.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={() => setChanges({})}
          disabled={Object.keys(changes).length === 0 || saving}
          className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={Object.keys(changes).length === 0 || saving}
          className="btn-primary"
        >
          {saving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}
