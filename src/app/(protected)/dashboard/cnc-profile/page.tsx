'use client';

export default function CNCProfilePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">CNC Provider Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Set up your CNC provider profile to accept manufacturing jobs</p>
      </div>

      <div className="max-w-2xl">
        <div className="card p-12 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">CNC Provider Features Coming Soon</h2>
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">
            We&apos;re building a marketplace for CNC providers to offer manufacturing services. This feature will be available soon.
          </p>

          {/* Feature preview */}
          <div className="bg-gray-50 rounded-lg p-6 text-left mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">What you&apos;ll be able to do:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">Create and manage your CNC provider profile</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">List your machinery and manufacturing capabilities</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">Receive manufacturing requests from designers</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">Set pricing and lead times for your services</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">Build your reputation through customer reviews</span>
              </li>
            </ul>
          </div>

          {/* Timeline */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="font-semibold text-gray-900 mb-6">Feature Timeline</h3>
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-brand-600 rounded-full flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Q1 2026</p>
                  <p className="text-xs text-gray-500">CNC provider registration</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-gray-300 rounded-full flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Q2 2026</p>
                  <p className="text-xs text-gray-500">Manufacturing marketplace launch</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-gray-300 rounded-full flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Q3 2026</p>
                  <p className="text-xs text-gray-500">Integrated order management</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
            </svg>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Get notified when CNC features launch</p>
              <p className="text-xs text-gray-600 mt-1">
                Check your email preferences to enable notifications about new features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
