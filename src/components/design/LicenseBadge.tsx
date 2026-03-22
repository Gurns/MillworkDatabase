'use client';

import { getLicenseByCode } from '@/lib/utils/constants';

interface LicenseBadgeProps {
  licenseType: string | null | undefined;
  creatorName?: string;
  designTitle?: string;
  variant?: 'full' | 'compact' | 'inline';
}

export function LicenseBadge({
  licenseType,
  creatorName,
  designTitle,
  variant = 'full',
}: LicenseBadgeProps) {
  const license = getLicenseByCode(licenseType || 'CC-BY-4.0');
  if (!license) return null;

  if (variant === 'inline') {
    return (
      <a
        href={license.url}
        target="_blank"
        rel="noopener noreferrer license"
        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        title={license.name}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="bold">CC</text>
        </svg>
        <span>{license.code === 'CC0' ? 'Public Domain' : license.code.replace('CC-', '').replace(/-4\.0$/, '')}</span>
      </a>
    );
  }

  if (variant === 'compact') {
    return (
      <a
        href={license.url}
        target="_blank"
        rel="noopener noreferrer license"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        title={license.name}
      >
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="bold">CC</text>
        </svg>
        {license.code === 'CC0' ? 'Public Domain' : license.code.replace('CC-', '').replace(/-4\.0$/, '')}
      </a>
    );
  }

  // Full variant
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-start gap-3">
        <a href={license.url} target="_blank" rel="noopener noreferrer license">
          <img
            src={license.badge}
            alt={license.name}
            className="h-8 flex-shrink-0"
            loading="lazy"
          />
        </a>
        <div className="flex-1 min-w-0">
          <a
            href={license.url}
            target="_blank"
            rel="noopener noreferrer license"
            className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
          >
            {license.name}
          </a>
          <p className="text-xs text-gray-500 mt-0.5">{license.description}</p>

          {/* Permission indicators */}
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className={license.allows_commercial ? 'text-green-600' : 'text-red-500'}>
              {license.allows_commercial ? '✓ Commercial use' : '✗ No commercial use'}
            </span>
            <span className={license.allows_derivatives ? 'text-green-600' : 'text-red-500'}>
              {license.allows_derivatives ? '✓ Modifications allowed' : '✗ No modifications'}
            </span>
            {license.requires_attribution && (
              <span className="text-blue-600">☛ Credit required</span>
            )}
            {license.requires_sharealike && (
              <span className="text-amber-600">↻ ShareAlike</span>
            )}
          </div>

          {/* Attribution helper */}
          {license.requires_attribution && creatorName && designTitle && (
            <details className="mt-3">
              <summary className="text-xs text-blue-600 cursor-pointer hover:underline">
                How to give credit
              </summary>
              <div className="mt-2 bg-white border border-gray-200 rounded p-3 text-xs text-gray-700 font-mono leading-relaxed">
                &quot;{designTitle}&quot; by {creatorName} is licensed under{' '}
                <a href={license.url} className="text-blue-600">{license.name}</a>.
                Source: MillworkDatabase.com
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
