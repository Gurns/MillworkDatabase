import type { PlateConfig, PlateStyle, StyleZone, ClickableLabel } from '../PlateZoomViewer';

// ─── Ceiling & Wall plate: 6 columns ───

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
    { label: 'Built-Up Crown Molding',        slug: 'crown-molding',          top: 3,  left: 0,  width: 65, height: 6 },
    { label: 'Beam Detail',                    slug: 'ceiling-and-wall-elements', top: 12, left: 0,  width: 55, height: 6 },
    { label: 'Ceiling Rosette/Medallion',      slug: 'ceiling-and-wall-elements', top: 22, left: 0,  width: 70, height: 7 },
    { label: 'Corinthian Pilaster',            slug: 'columns-and-pilasters',  top: 34, left: 0,  width: 65, height: 7 },
    { label: 'Elaborate Turned Balustrade',    slug: 'balusters',             top: 46, left: 55, width: 45, height: 7 },
    { label: 'Scotiated Nosing Profile',       slug: 'stair-nosing',          top: 56, left: 0,  width: 65, height: 6 },
    { label: 'Carved Pilaster Capital',        slug: 'capitals',              top: 64, left: 55, width: 45, height: 6 },
    { label: 'Marble Tread & Baseboard',       slug: 'baseboards',            top: 76, left: 0,  width: 65, height: 6 },
    { label: 'Block Detail / Plinth',          slug: 'bases',                 top: 85, left: 0,  width: 55, height: 6 },
  ],
  victorian: [
    { label: 'Queen Anne Crown Molding',       slug: 'crown-molding',          top: 3,  left: 0,  width: 70, height: 6 },
    { label: 'Room Ceiling Beam Detail',       slug: 'ceiling-and-wall-elements', top: 12, left: 0,  width: 65, height: 6 },
    { label: 'Patterned Ceiling Panel',        slug: 'ceiling-and-wall-elements', top: 22, left: 55, width: 45, height: 6 },
    { label: 'Intricate Turned Balustrade',    slug: 'balusters',             top: 34, left: 0,  width: 70, height: 7 },
    { label: 'Wainscoting Detail',             slug: 'wainscoting',           top: 48, left: 0,  width: 65, height: 6 },
    { label: 'Post Cap / Finial',              slug: 'finials',               top: 58, left: 55, width: 45, height: 6 },
  ],
  craftsman: [
    { label: 'Simple Box Beam Ceiling',        slug: 'ceiling-and-wall-elements', top: 3,  left: 0,  width: 70, height: 6 },
    { label: 'Continuous Picture Rail',        slug: 'trim-and-molding',       top: 12, left: 0,  width: 70, height: 6 },
    { label: 'Flat Panel Wainscoting',         slug: 'wainscoting',           top: 22, left: 55, width: 45, height: 6 },
    { label: 'Coffered Panels',                slug: 'ceiling-and-wall-elements', top: 34, left: 0,  width: 65, height: 7 },
    { label: 'Simple Scotiated Nosing',        slug: 'stair-nosing',          top: 46, left: 0,  width: 70, height: 6 },
    { label: 'Square Balusters',               slug: 'balusters',             top: 56, left: 55, width: 45, height: 6 },
    { label: 'Honest Wood Joinery',            slug: 'stair-parts',           top: 66, left: 0,  width: 70, height: 6 },
    { label: 'Flush-Panel',                    slug: 'wainscoting',           top: 76, left: 0,  width: 55, height: 6 },
  ],
  gothic: [
    { label: 'Gothic Style Ceiling Boss',      slug: 'ceiling-and-wall-elements', top: 3,  left: 0,  width: 65, height: 6 },
    { label: 'Pointed Arch Arcade Panels',     slug: 'windows-and-doorways',  top: 14, left: 0,  width: 70, height: 7 },
    { label: 'Deep Recess Carved Archivolt',   slug: 'architrave',            top: 26, left: 55, width: 45, height: 6 },
    { label: 'Moulding Detail',                slug: 'trim-and-molding',      top: 36, left: 0,  width: 55, height: 6 },
    { label: 'Stone or Heavy Timber Treads',   slug: 'stair-treads',          top: 48, left: 0,  width: 75, height: 7 },
    { label: 'Heavy Forged Iron Hardware',     slug: 'hardware',              top: 62, left: 55, width: 45, height: 6 },
  ],
  contemporary: [
    { label: 'Integrated Lighting Datum',      slug: 'ceiling-and-wall-elements', top: 3,  left: 0,  width: 70, height: 6 },
    { label: 'Shadow Gap Crown',               slug: 'crown-molding',          top: 12, left: 55, width: 45, height: 6 },
    { label: 'Recessed Lighting',              slug: 'ceiling-and-wall-elements', top: 22, left: 0,  width: 65, height: 6 },
    { label: 'Lightweight Engineered Tread',   slug: 'stair-treads',           top: 34, left: 0,  width: 70, height: 6 },
    { label: 'Integrated Wall Niche',          slug: 'ceiling-and-wall-elements', top: 46, left: 55, width: 45, height: 6 },
    { label: 'ADA Compliant',                  slug: 'stair-parts',            top: 58, left: 0,  width: 55, height: 6 },
  ],
  rustic: [
    { label: 'Hand-Hewn Log Ceiling Beam',     slug: 'ceiling-and-wall-elements', top: 3,  left: 0,  width: 70, height: 6 },
    { label: 'Raw Log Plain Paneling',         slug: 'wainscoting',            top: 12, left: 55, width: 45, height: 6 },
    { label: 'Chunky Timber Lintels',          slug: 'lintels',                top: 24, left: 0,  width: 65, height: 6 },
    { label: 'Raw Post Timber Lintels',        slug: 'lintels',                top: 36, left: 0,  width: 65, height: 7 },
    { label: 'Forged Iron Brackets',           slug: 'hardware',               top: 48, left: 55, width: 45, height: 6 },
    { label: 'Natural Wood End Grain',         slug: 'stair-parts',            top: 60, left: 0,  width: 70, height: 6 },
  ],
};

const labels: Record<PlateStyle, ClickableLabel[]> = {} as any;
const styles: PlateStyle[] = ['classical', 'victorian', 'craftsman', 'gothic', 'contemporary', 'rustic'];
styles.forEach((style, i) => {
  labels[style] = mapCol(i, localLabels[style]);
});

export const ceilingWallConfig: PlateConfig = {
  imageSrc: '/images/ceiling-wall-plate.png',
  alt: 'Comparative Ceiling & Wall architectural elements across 6 styles',
  zones,
  labels,
};
