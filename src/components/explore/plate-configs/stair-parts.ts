import type { PlateConfig, PlateStyle, StyleZone, ClickableLabel } from '../PlateZoomViewer';

// ─── Stair Parts plate: 6 columns ───

const COL_W = 16.67;
function colCenter(index: number): number {
  return COL_W * index + COL_W / 2;
}

const zones: Record<PlateStyle, StyleZone> = {
  classical:    { originX: colCenter(0), originY: 50, scale: 5 },
  victorian:    { originX: colCenter(1), originY: 50, scale: 5 },
  craftsman:    { originX: colCenter(2), originY: 50, scale: 5 },
  gothic:       { originX: colCenter(3), originY: 50, scale: 5 },
  contemporary: { originX: colCenter(4), originY: 50, scale: 5 },
  rustic:       { originX: colCenter(5), originY: 50, scale: 5 },
};

function mapCol(colIndex: number, localLabels: ClickableLabel[]): ClickableLabel[] {
  const colLeft = colIndex * COL_W;
  return localLabels.map((l) => ({
    ...l,
    top:    l.top,
    left:   colLeft + (l.left / 100) * COL_W,
    width:  (l.width / 100) * COL_W,
    height: l.height,
  }));
}

const localLabels: Record<PlateStyle, ClickableLabel[]> = {
  classical: [
    { label: 'Classical Volute',               slug: 'handrails',            top: 3,  left: 0,  width: 65, height: 6 },
    { label: 'Dentil Molding on Stringer',     slug: 'dentils',             top: 14, left: 0,  width: 70, height: 6 },
    { label: 'Scotiated Nosing Profile',       slug: 'stair-nosing',        top: 24, left: 55, width: 45, height: 6 },
    { label: 'Elaborate Turned Baluster',      slug: 'balusters',           top: 34, left: 0,  width: 70, height: 7 },
    { label: 'Carved Pilaster Capital on Newel', slug: 'newel-posts',       top: 46, left: 0,  width: 80, height: 7 },
    { label: 'Marble Tread & Riser Inlay',     slug: 'stair-treads',        top: 60, left: 0,  width: 75, height: 7 },
  ],
  victorian: [
    { label: 'Gooseneck Handrail End',         slug: 'handrails',           top: 3,  left: 0,  width: 65, height: 6 },
    { label: 'Gingerbread Trim on Stringer',   slug: 'trim-and-molding',    top: 14, left: 0,  width: 75, height: 6 },
    { label: 'Intricate Turned Balusters',     slug: 'balusters',           top: 24, left: 0,  width: 70, height: 7 },
    { label: 'Complex Panels Under Stairs',    slug: 'wainscoting',         top: 36, left: 55, width: 45, height: 6 },
    { label: 'Carved Newel Post Cap',          slug: 'newel-posts',         top: 46, left: 0,  width: 65, height: 7 },
    { label: 'Refined Stair Apron with Dado',  slug: 'wainscoting',         top: 60, left: 0,  width: 80, height: 7 },
  ],
  craftsman: [
    { label: 'Robust Heavy Timber Posts',      slug: 'newel-posts',         top: 3,  left: 0,  width: 70, height: 6 },
    { label: 'Simple Flat-Faced Newel Post',   slug: 'newel-posts',         top: 14, left: 0,  width: 75, height: 7 },
    { label: 'Simple Scotiated Nosing',        slug: 'stair-nosing',        top: 24, left: 55, width: 45, height: 6 },
    { label: 'Square Timber Baluster',         slug: 'balusters',           top: 34, left: 0,  width: 65, height: 7 },
    { label: 'Honest Wood Joinery (Tenons)',   slug: 'stair-parts',         top: 48, left: 0,  width: 80, height: 7 },
    { label: 'Flush-Panel Stair Apron',        slug: 'wainscoting',         top: 62, left: 0,  width: 70, height: 7 },
  ],
  gothic: [
    { label: 'Pointed Arch Under Stairs',      slug: 'windows-and-doorways', top: 3,  left: 0,  width: 70, height: 7 },
    { label: 'Gothic Tracery Infill Panel',    slug: 'carvings',            top: 14, left: 0,  width: 75, height: 7 },
    { label: 'Carved Gothic Stringer',         slug: 'trim-and-molding',    top: 26, left: 55, width: 45, height: 6 },
    { label: 'Deep Recess Carved Archivolt',   slug: 'architrave',          top: 36, left: 0,  width: 70, height: 6 },
    { label: 'Gargoyle/Gothic Newel Carving',  slug: 'newel-posts',         top: 48, left: 0,  width: 75, height: 7 },
    { label: 'Heavy Forged Iron Railings',     slug: 'handrails',           top: 62, left: 0,  width: 70, height: 6 },
    { label: 'Stone/Heavy Timber Treads',      slug: 'stair-treads',        top: 72, left: 55, width: 45, height: 6 },
  ],
  contemporary: [
    { label: 'Minimal Aluminum Rail',          slug: 'handrails',           top: 3,  left: 0,  width: 65, height: 6 },
    { label: 'Glass/Metal Balustrade',         slug: 'balusters',           top: 14, left: 0,  width: 70, height: 7 },
    { label: 'Ultra-Minimalist Handrail',      slug: 'handrails',           top: 26, left: 55, width: 45, height: 6 },
    { label: 'Flush-Detail Nosing',            slug: 'stair-nosing',        top: 36, left: 0,  width: 65, height: 6 },
    { label: 'Lightweight Engineered Treads',  slug: 'stair-treads',        top: 48, left: 0,  width: 80, height: 7 },
    { label: 'Integrated Tread Lighting',      slug: 'stair-parts',         top: 60, left: 0,  width: 70, height: 6 },
    { label: 'ADA Compliant Handrail',         slug: 'handrails',           top: 72, left: 55, width: 45, height: 6 },
  ],
  rustic: [
    { label: 'Rough-Hewn Log Stringers',       slug: 'stair-parts',         top: 3,  left: 0,  width: 70, height: 6 },
    { label: 'Uneven Raw Wood Treads',         slug: 'stair-treads',        top: 14, left: 0,  width: 65, height: 6 },
    { label: 'Log Balusters & Newel Posts',    slug: 'newel-posts',         top: 26, left: 0,  width: 75, height: 7 },
    { label: 'Raw Stone Risers',               slug: 'stair-parts',         top: 38, left: 55, width: 45, height: 6 },
    { label: 'Chunky Timber Lintels',          slug: 'lintels',             top: 48, left: 0,  width: 65, height: 6 },
    { label: 'Forged Iron Brackets',           slug: 'hardware',            top: 60, left: 0,  width: 65, height: 6 },
    { label: 'Natural Wood End Grain',         slug: 'stair-parts',         top: 72, left: 55, width: 45, height: 6 },
  ],
};

const labels: Record<PlateStyle, ClickableLabel[]> = {} as any;
const styles: PlateStyle[] = ['classical', 'victorian', 'craftsman', 'gothic', 'contemporary', 'rustic'];
styles.forEach((style, i) => {
  labels[style] = mapCol(i, localLabels[style]);
});

export const stairPartsConfig: PlateConfig = {
  imageSrc: '/images/stair-parts-plate.png',
  alt: 'Comparative Stair Parts architectural elements across 6 styles',
  zones,
  labels,
};
