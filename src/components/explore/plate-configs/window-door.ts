import type { PlateConfig, PlateStyle, StyleZone, ClickableLabel } from '../PlateZoomViewer';

// ─── Window & Door plate: 6 columns ───
// Each column is ~16.67% wide, full height
// Order: Classical | Victorian | Craftsman | Gothic | Contemporary | Rustic

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

// Helper: convert local % within column → plate-absolute %
function mapCol(colIndex: number, localLabels: ClickableLabel[]): ClickableLabel[] {
  const colLeft = colIndex * COL_W;
  return localLabels.map((l) => ({
    ...l,
    top:    l.top,  // Y stays the same (full height columns)
    left:   colLeft + (l.left / 100) * COL_W,
    width:  (l.width / 100) * COL_W,
    height: l.height,
  }));
}

// Labels in local % (within each column — left/width are % of column, top/height are % of plate)
const localLabels: Record<PlateStyle, ClickableLabel[]> = {
  classical: [
    { label: 'Pediment Header',              slug: 'pediments',             top: 3,  left: 0,  width: 60, height: 6 },
    { label: 'Decorated Lintel with Dentil', slug: 'lintels',              top: 12, left: 0,  width: 70, height: 6 },
    { label: 'Rich Ornate Architrave',       slug: 'architrave',           top: 22, left: 55, width: 45, height: 6 },
    { label: 'Carved Pilaster Capital',      slug: 'capitals',             top: 30, left: 55, width: 45, height: 6 },
    { label: 'Decorated Sill with Apron',    slug: 'window-sills',         top: 42, left: 0,  width: 65, height: 6 },
    { label: 'Panel Door with Fanlight',     slug: 'doors',               top: 60, left: 0,  width: 80, height: 8 },
  ],
  victorian: [
    { label: 'Decorative Hood Mold',         slug: 'trim-and-molding',     top: 3,  left: 0,  width: 70, height: 7 },
    { label: 'Elaborate Carved Brackets',    slug: 'corbels',              top: 12, left: 55, width: 45, height: 6 },
    { label: 'Deeply Molded Architrave',     slug: 'architrave',           top: 22, left: 0,  width: 65, height: 6 },
    { label: 'Gingerbread Trim',             slug: 'trim-and-molding',     top: 30, left: 55, width: 45, height: 6 },
    { label: 'Intricate Stained Glass',      slug: 'windows-and-doorways', top: 40, left: 0,  width: 70, height: 7 },
    { label: 'Decorative Turned Spindles',   slug: 'balusters',           top: 52, left: 0,  width: 70, height: 6 },
  ],
  craftsman: [
    { label: 'Exposed Rafter Tail',          slug: 'corbels',              top: 3,  left: 0,  width: 60, height: 6 },
    { label: 'Robust Heavy Timber Lintel',   slug: 'lintels',              top: 12, left: 0,  width: 70, height: 6 },
    { label: 'Simple Wide Flat Architrave',  slug: 'architrave',           top: 22, left: 55, width: 45, height: 6 },
    { label: 'Heavy Simple Timber Sill',     slug: 'window-sills',         top: 32, left: 0,  width: 65, height: 6 },
    { label: 'Linear Window Muntin Pattern', slug: 'mullions-and-muntins', top: 42, left: 0,  width: 80, height: 7 },
    { label: 'Robust Timber Door',           slug: 'doors',               top: 60, left: 0,  width: 70, height: 8 },
  ],
  gothic: [
    { label: 'Pointed Arch with Hood Mold',  slug: 'windows-and-doorways', top: 3,  left: 0,  width: 80, height: 7 },
    { label: 'Gothic Tracery Mullion',       slug: 'mullions-and-muntins', top: 14, left: 0,  width: 70, height: 6 },
    { label: 'Deep Carved Stone Architrave', slug: 'architrave',           top: 24, left: 55, width: 45, height: 6 },
    { label: 'Detailed Quatrefoil Tracery',  slug: 'carvings',            top: 34, left: 0,  width: 70, height: 7 },
    { label: 'Heavy Studded Plank Door',     slug: 'doors',               top: 55, left: 0,  width: 75, height: 8 },
    { label: 'Forged Iron Hardware',         slug: 'hardware',            top: 68, left: 55, width: 45, height: 6 },
  ],
  contemporary: [
    { label: 'Minimal Aluminum Profile',     slug: 'trim-and-molding',     top: 5,  left: 0,  width: 70, height: 6 },
    { label: 'Large Glazing Panel',          slug: 'windows-and-doorways', top: 15, left: 0,  width: 65, height: 7 },
    { label: 'Flat Threshold Sill',          slug: 'window-sills',         top: 28, left: 55, width: 45, height: 6 },
    { label: 'Flush Sill',                   slug: 'window-sills',         top: 38, left: 0,  width: 55, height: 6 },
    { label: 'Minimal Invisible Architrave', slug: 'architrave',           top: 48, left: 0,  width: 75, height: 6 },
  ],
  rustic: [
    { label: 'Rough-Hewn Log Sill',          slug: 'window-sills',         top: 5,  left: 0,  width: 65, height: 6 },
    { label: 'Chunky Timber Lintel',         slug: 'lintels',              top: 14, left: 0,  width: 65, height: 6 },
    { label: 'Hand-Hewn Wood Siding',        slug: 'trim-and-molding',     top: 25, left: 55, width: 45, height: 6 },
    { label: 'Raw Wood Casing Detail',       slug: 'casing',              top: 35, left: 0,  width: 65, height: 6 },
    { label: 'Chunky Timber Architrave',     slug: 'architrave',           top: 48, left: 0,  width: 70, height: 6 },
  ],
};

// Convert to plate-absolute coordinates
const labels: Record<PlateStyle, ClickableLabel[]> = {} as any;
const styles: PlateStyle[] = ['classical', 'victorian', 'craftsman', 'gothic', 'contemporary', 'rustic'];
styles.forEach((style, i) => {
  labels[style] = mapCol(i, localLabels[style]);
});

export const windowDoorConfig: PlateConfig = {
  imageSrc: '/images/window-door-plate.png',
  alt: 'Comparative Window & Door architectural elements across 6 styles',
  zones,
  labels,
};
