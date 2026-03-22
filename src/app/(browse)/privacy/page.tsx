import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | MillworkDatabase',
  description: 'Privacy policy for MillworkDatabase.com',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: March 2026</p>

      <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
          <p>
            When you create an account, we collect your username, email address, and optional profile
            information. When you upload designs, we store the files and associated metadata you provide.
            We also collect standard usage data such as page views and feature interactions to improve
            the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
          <p>
            We use your information to operate and improve MillworkDatabase, communicate with you about
            your account and uploads, display your public profile and designs to other users, and
            process any transactions for paid designs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Information Sharing</h2>
          <p>
            Your public profile, username, and published designs are visible to all visitors.
            We do not sell your personal information to third parties. We may share information
            with service providers who help operate the platform (hosting, payment processing,
            email delivery) under strict data protection agreements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Data Storage & Security</h2>
          <p>
            Your data is stored securely using industry-standard encryption. Design files are stored
            in cloud object storage with access controls. We use Supabase for authentication and
            database services, which provides enterprise-grade security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Your Rights</h2>
          <p>
            You can access, update, or delete your account information at any time through your
            profile settings. You can delete any designs you&apos;ve uploaded. If you wish to delete your
            entire account, contact us and we will remove all your data within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Cookies</h2>
          <p>
            We use essential cookies for authentication and session management. We may use analytics
            cookies to understand how the platform is used. You can control cookie preferences in
            your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Contact</h2>
          <p>
            For privacy-related questions or requests, please contact us at{' '}
            <a href="/contact" className="text-blue-600 hover:text-blue-700">
              our contact page
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
