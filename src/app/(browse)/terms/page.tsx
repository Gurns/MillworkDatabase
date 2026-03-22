import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | MillworkDatabase',
  description: 'Terms of service for MillworkDatabase.com',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-gray-500 mb-8">Last updated: March 2026</p>

      <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using MillworkDatabase.com, you agree to be bound by these Terms of
            Service. If you do not agree to these terms, please do not use the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. User Accounts</h2>
          <p>
            You must provide accurate information when creating an account. You are responsible for
            maintaining the security of your account credentials. You must be at least 13 years old
            to create an account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Design Uploads & Intellectual Property</h2>
          <p>
            By uploading designs to MillworkDatabase, you represent that you own the rights to the
            content or have permission to share it. You retain ownership of your designs. By publishing
            a design as free, you grant other users a license to download and use the design files
            for personal and commercial woodworking projects. Paid designs are licensed per-download
            according to the standard design license.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Prohibited Uses</h2>
          <p>
            You may not upload designs that infringe on others&apos; intellectual property, use the
            platform to distribute malware or harmful content, attempt to gain unauthorized access
            to other accounts or systems, or use automated tools to scrape or bulk-download content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. CNC Provider Services</h2>
          <p>
            MillworkDatabase connects users with CNC service providers but is not responsible for the
            quality, accuracy, or timeliness of work performed by third-party providers. Any
            agreements between users and CNC providers are solely between those parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Content Moderation</h2>
          <p>
            We reserve the right to remove designs or suspend accounts that violate these terms.
            We may review uploaded content for quality, accuracy, and compliance with our guidelines.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
          <p>
            MillworkDatabase is provided &quot;as is&quot; without warranties of any kind. We are not
            liable for any damages arising from the use of designs downloaded from the platform,
            including but not limited to structural failures, material waste, or production errors.
            Users are responsible for verifying design suitability for their specific applications.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the platform after changes
            constitutes acceptance of the updated terms. We will notify registered users of significant
            changes via email.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Contact</h2>
          <p>
            Questions about these terms? Reach out through our{' '}
            <a href="/contact" className="text-blue-600 hover:text-blue-700">
              contact page
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
