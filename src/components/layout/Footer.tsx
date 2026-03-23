import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-wood-950 text-wood-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-display font-bold text-white mb-3">
              Millwork<span className="text-brand-400">Database</span>
            </h3>
            <p className="text-sm text-wood-400">
              The community for sharing, discovering, and CNC-cutting architectural millwork
              designs.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Browse</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categories/trim-and-molding" className="hover:text-white transition-colors">
                  Trim & Molding
                </Link>
              </li>
              <li>
                <Link href="/categories/stair-parts" className="hover:text-white transition-colors">
                  Stair Parts
                </Link>
              </li>
              <li>
                <Link href="/categories/mantels" className="hover:text-white transition-colors">
                  Mantels
                </Link>
              </li>
              <li>
                <Link href="/categories/built-ins" className="hover:text-white transition-colors">
                  Built-ins
                </Link>
              </li>
              <li>
                <Link href="/styles" className="hover:text-white transition-colors">
                  Browse by Style
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/designs?sort=trending" className="hover:text-white transition-colors">
                  Trending Designs
                </Link>
              </li>
              <li>
                <Link href="/cnc-providers" className="hover:text-white transition-colors">
                  Find CNC Services
                </Link>
              </li>
              <li>
                <Link href="/designs?sort=newest" className="hover:text-white transition-colors">
                  New Uploads
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/guides/digitizing-3d-scans" className="hover:text-white transition-colors">
                  Digitizing Guide
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-wood-800 text-center text-sm text-wood-500">
          <p>&copy; {new Date().getFullYear()} MillworkDatabase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
