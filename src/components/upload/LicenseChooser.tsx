'use client';

import { useState } from 'react';
import { CC_LICENSES, type CCLicenseCode } from '@/lib/utils/constants';

interface LicenseChooserProps {
  value: CCLicenseCode;
  onChange: (code: CCLicenseCode) => void;
}

// SVG icons for CC license elements
function CCIcon({ type, className = 'w-5 h-5' }: { type: string; className?: string }) {
  switch (type) {
    case 'cc':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1.65-4.65c.69.47 1.58.72 2.46.58.88-.14 1.67-.62 2.21-1.35l1.59 1.09c-.79 1.06-1.94 1.77-3.22 1.97-1.29.2-2.59-.16-3.59-.86-1-.7-1.7-1.76-1.93-2.97-.23-1.21.06-2.45.81-3.45s1.87-1.69 3.1-1.89c1.23-.2 2.5.09 3.51.8l-1.55 1.14c-.55-.39-1.22-.59-1.89-.51-.67.08-1.29.38-1.72.85-.43.47-.68 1.07-.67 1.68.01.62.28 1.2.72 1.65.44.45 1.03.73 1.66.77.63.04 1.24-.16 1.72-.56l1.5 1.18c-.73.64-1.65 1.03-2.63 1.09-.98.06-1.96-.2-2.76-.77l-.32.56z" />
        </svg>
      );
    case 'by':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="7" r="3.5" />
          <path d="M12 12c-4 0-6 2-6 4v2h12v-2c0-2-2-4-6-4z" />
        </svg>
      );
    case 'nc':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="bold">$</text>
          <line x1="6" y1="18" x2="18" y2="6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'nd':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <rect x="7" y="10" width="10" height="1.5" rx="0.5" />
          <rect x="7" y="13" width="10" height="1.5" rx="0.5" />
        </svg>
      );
    case 'sa':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <path d="M15.5 12c0 1.93-1.57 3.5-3.5 3.5S8.5 13.93 8.5 12c0-1.03.45-1.96 1.17-2.6L12 12l2.33-2.6c.72.64 1.17 1.57 1.17 2.6z" />
        </svg>
      );
    case 'zero':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <text x="12" y="16.5" textAnchor="middle" fontSize="12" fontWeight="bold">0</text>
        </svg>
      );
    default:
      return null;
  }
}

export function LicenseChooser({ value, onChange }: LicenseChooserProps) {
  const [mode, setMode] = useState<'guided' | 'direct'>('guided');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    commercial: null as boolean | null,
    derivatives: null as boolean | null,
    sharealike: null as boolean | null,
    publicDomain: false,
  });

  const selectedLicense = CC_LICENSES.find((l) => l.code === value);

  // Guided chooser logic
  function handleGuidedAnswer(question: string, answer: boolean) {
    const updated = { ...answers, [question]: answer };
    setAnswers(updated);

    if (question === 'publicDomain' && answer) {
      onChange('CC0');
      setStep(99); // done
      return;
    }

    if (question === 'commercial') {
      setStep(2);
      return;
    }

    if (question === 'derivatives') {
      if (!answer) {
        // No derivatives allowed
        const code = updated.commercial ? 'CC-BY-ND-4.0' : 'CC-BY-NC-ND-4.0';
        onChange(code as CCLicenseCode);
        setStep(99);
        return;
      }
      setStep(3);
      return;
    }

    if (question === 'sharealike') {
      let code: string;
      if (updated.commercial && answer) code = 'CC-BY-SA-4.0';
      else if (updated.commercial && !answer) code = 'CC-BY-4.0';
      else if (!updated.commercial && answer) code = 'CC-BY-NC-SA-4.0';
      else code = 'CC-BY-NC-4.0';
      onChange(code as CCLicenseCode);
      setStep(99);
      return;
    }
  }

  function resetGuided() {
    setStep(0);
    setAnswers({ commercial: null, derivatives: null, sharealike: null, publicDomain: false });
  }

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => setMode('guided')}
          className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
            mode === 'guided'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Guided chooser
        </button>
        <button
          type="button"
          onClick={() => setMode('direct')}
          className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
            mode === 'direct'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Choose directly
        </button>
      </div>

      {mode === 'guided' ? (
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
          {step === 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-900">
                Do you want to place your design in the public domain with no restrictions at all?
              </p>
              <p className="text-xs text-gray-500">
                This means anyone can use, modify, and sell your design without any conditions — no credit required.
              </p>
              <div className="flex gap-3">
                <button type="button" onClick={() => handleGuidedAnswer('publicDomain', true)} className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  Yes, public domain
                </button>
                <button type="button" onClick={() => { setAnswers((a) => ({ ...a, publicDomain: false })); setStep(1); }} className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  No, I want some rights
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-900">
                Do you want to allow others to use your design commercially?
              </p>
              <p className="text-xs text-gray-500">
                For example, a CNC shop producing and selling parts based on your design.
              </p>
              <div className="flex gap-3">
                <button type="button" onClick={() => handleGuidedAnswer('commercial', true)} className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  Yes, allow commercial use
                </button>
                <button type="button" onClick={() => handleGuidedAnswer('commercial', false)} className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  No, non-commercial only
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-900">
                Do you want to allow others to modify or create derivatives of your design?
              </p>
              <p className="text-xs text-gray-500">
                For example, someone adapting your crown molding profile for a different scale or material.
              </p>
              <div className="flex gap-3">
                <button type="button" onClick={() => handleGuidedAnswer('derivatives', true)} className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  Yes, allow modifications
                </button>
                <button type="button" onClick={() => handleGuidedAnswer('derivatives', false)} className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  No, share as-is only
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-900">
                If others modify your design, must they share their version under the same license?
              </p>
              <p className="text-xs text-gray-500">
                &quot;ShareAlike&quot; means improvements stay open and benefit the community.
              </p>
              <div className="flex gap-3">
                <button type="button" onClick={() => handleGuidedAnswer('sharealike', true)} className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  Yes, require same license
                </button>
                <button type="button" onClick={() => handleGuidedAnswer('sharealike', false)} className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  No, any license is fine
                </button>
              </div>
            </div>
          )}

          {step === 99 && selectedLicense && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-gray-700">
                  <CCIcon type="cc" />
                  {selectedLicense.icons.map((icon) => (
                    <CCIcon key={icon} type={icon} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900">{selectedLicense.name}</span>
              </div>
              <p className="text-sm text-gray-600">{selectedLicense.description}</p>
              <a
                href={selectedLicense.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Read the full license &rarr;
              </a>
              <button
                type="button"
                onClick={resetGuided}
                className="block text-xs text-gray-500 hover:text-gray-700 underline mt-2"
              >
                Start over
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Direct selection mode */
        <div className="space-y-2">
          {CC_LICENSES.map((license) => (
            <label
              key={license.code}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                value === license.code
                  ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-200'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="license_type"
                value={license.code}
                checked={value === license.code}
                onChange={() => onChange(license.code as CCLicenseCode)}
                className="mt-0.5 text-blue-600"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-0.5 text-gray-600">
                    <CCIcon type="cc" className="w-4 h-4" />
                    {license.icons.map((icon) => (
                      <CCIcon key={icon} type={icon} className="w-4 h-4" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{license.shortName}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{license.description}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs">
                  <span className={license.allows_commercial ? 'text-green-600' : 'text-red-500'}>
                    {license.allows_commercial ? '✓ Commercial' : '✗ Commercial'}
                  </span>
                  <span className={license.allows_derivatives ? 'text-green-600' : 'text-red-500'}>
                    {license.allows_derivatives ? '✓ Modifications' : '✗ Modifications'}
                  </span>
                  {license.requires_sharealike && (
                    <span className="text-amber-600">↻ ShareAlike</span>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
      )}

      {/* Current selection summary (always visible) */}
      {selectedLicense && mode === 'direct' && (
        <p className="text-xs text-gray-500">
          Selected: <strong>{selectedLicense.name}</strong> —{' '}
          <a href={selectedLicense.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            View license
          </a>
        </p>
      )}

      {/* Legal notice */}
      <p className="text-xs text-gray-400 leading-relaxed">
        By publishing, you confirm you are the copyright holder (or have permission) and understand that
        Creative Commons licenses are irrevocable — downloaders who comply with the terms retain their rights.
      </p>
    </div>
  );
}
