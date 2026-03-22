import Link from 'next/link';
import { Metadata } from 'next';
import { ARCHITECTURAL_STYLES } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'Browse by Architectural Style | MillworkDatabase',
  description: 'Explore millwork designs organized by architectural style — Craftsman, Colonial, Victorian, Art Deco, and more.',
};

const STYLE_DESCRIPTIONS: Record<string, string> = {
  craftsman: 'Clean lines, visible joinery, and natural wood beauty. Emphasis on handcraft and honest materials.',
  colonial: 'Symmetrical designs rooted in early American architecture. Refined proportions with classical details.',
  victorian: 'Ornate and decorative profiles with rich carved details. Celebrates elaborate craftsmanship.',
  'art-deco': 'Bold geometric forms and angular designs inspired by 1920s-30s machine-age aesthetics.',
  georgian: 'Formal classical proportions with refined molding profiles. Elegant and balanced.',
  federal: 'Delicate neoclassical details with refined curves and fan motifs. Light and graceful.',
  'greek-revival': 'Bold classical columns and entablatures. Strong geometric forms from ancient Greek temples.',
  'gothic-revival': 'Pointed arches, tracery, and vertical emphasis. Medieval-inspired romantic details.',
  'queen-anne': 'Asymmetric designs with turned spindles and decorative shingles. Playful and eclectic.',
  tudor: 'Heavy timber aesthetics with arched details. English medieval character.',
  mission: 'Simple rectilinear forms inspired by Spanish missions. Minimal ornamentation.',
  prairie: 'Horizontal emphasis with integrated design. Frank Lloyd Wright-inspired organic forms.',
  'mid-century-modern': 'Clean minimal profiles celebrating function over ornament. 1950s-60s modernist aesthetic.',
  contemporary: 'Current design trends blending modern simplicity with warmth and texture.',
  rustic: 'Natural wood character with heavy stock. Celebrates grain, knots, and organic textures.',
  traditional: 'Timeless profiles that blend classical elements. Versatile and enduring designs.',
};

export default function StylesIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse by Architectural Style</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find millwork designs that match your project&apos;s architectural character. Each style
          represents a distinct design tradition with its own proportions, details, and materials.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARCHITECTURAL_STYLES.map((style) => {
          const slug = style.toLowerCase().replace(/[\s&]+/g, '-').replace(/['']/g, '');
          const description = STYLE_DESCRIPTIONS[slug] || 'Explore designs in this architectural style.';
          return (
            <Link
              key={style}
              href={`/styles/${slug}`}
              className="group block bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                {style}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {description}
              </p>
              <span className="inline-block mt-4 text-sm text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                Browse designs &rarr;
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
