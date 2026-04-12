import type { PlateConfig, PlateStyle, StyleZone, ClickableLabel } from '../PlateZoomViewer';

// ─── Carving Types plate: horizontal carousel layout ───
// Single row of carving type images, each clickable to filter results

const zones: Record<PlateStyle, StyleZone> = {
  classical:    { originX: 16.7, originY: 50, scale: 2.8 },
  victorian:    { originX: 50,   originY: 50, scale: 2.8 },
  craftsman:    { originX: 83.3, originY: 50, scale: 2.8 },
  gothic:       { originX: 16.7, originY: 50, scale: 2.8 },
  contemporary: { originX: 50,   originY: 50, scale: 2.8 },
  rustic:       { originX: 83.3, originY: 50, scale: 2.8 },
};

// Helper: convert (% within cell) → (% of full plate)
function mapLabels(
  cellLeft: number, cellTop: number, cellW: number, cellH: number,
  localLabels: ClickableLabel[]
): ClickableLabel[] {
  return localLabels.map((l) => ({
    ...l,
    top:    cellTop  + (l.top / 100) * cellH,
    left:   cellLeft + (l.left / 100) * cellW,
    width:  (l.width / 100) * cellW,
    height: (l.height / 100) * cellH,
  }));
}

// Cell bounds (% of full plate) - 6 cells, each ~16.7% wide
const CELLS = {
  classical:    { left: 0,    top: 0,  w: 16.7, h: 100 },
  victorian:    { left: 16.7, top: 0,  w: 16.7, h: 100 },
  craftsman:    { left: 33.4, top: 0,  w: 16.7, h: 100 },
  gothic:       { left: 50,   top: 0,  w: 16.7, h: 100 },
  contemporary: { left: 66.7, top: 0,  w: 16.7, h: 100 },
  rustic:       { left: 83.4, top: 0,  w: 16.6, h: 100 },
};

// Labels in local % (within each cell)
const localLabels: Record<PlateStyle, ClickableLabel[]> = {
  classical: [
    { label: 'Geometric Patterns', slug: 'geometric-carvings', top: 50, left: 50, width: 40, height: 30 },
    { label: 'Floral Motifs',      slug: 'floral-carvings',    top: 50, left: 50, width: 40, height: 30 },
    { label: 'Mythological',       slug: 'mythological',       top: 50, left: 50, width: 40, height: 30 },
  ],
  victorian: [
    { label: 'Ornate Scrollwork',  slug: 'ornate-scrollwork',  top: 50, left: 50, width: 40, height: 30 },
    { label: 'Floral & Fauna',     slug: 'floral-carvings',    top: 50, left: 50, width: 40, height: 30 },
    { label: 'Figurative',         slug: 'figurative',         top: 50, left: 50, width: 40, height: 30 },
  ],
  craftsman: [
    { label: 'Simple Geometric',   slug: 'geometric-carvings', top: 50, left: 50, width: 40, height: 30 },
    { label: 'Nature Motifs',      slug: 'floral-carvings',    top: 50, left: 50, width: 40, height: 30 },
    { label: 'Hand-Carved',        slug: 'hand-carved',        top: 50, left: 50, width: 40, height: 30 },
  ],
  gothic: [
    { label: 'Tracery Panels',     slug: 'tracery',            top: 50, left: 50, width: 40, height: 30 },
    { label: 'Gargoyles',          slug: 'gargoyles',          top: 50, left: 50, width: 40, height: 30 },
    { label: 'Religious Symbols',  slug: 'religious-symbols',  top: 50, left: 50, width: 40, height: 30 },
  ],
  contemporary: [
    { label: 'Abstract Shapes',    slug: 'abstract',           top: 50, left: 50, width: 40, height: 30 },
    { label: 'Modern Geometric',   slug: 'geometric-carvings', top: 50, left: 50, width: 40, height: 30 },
    { label: 'Minimalist',         slug: 'minimalist',         top: 50, left: 50, width: 40, height: 30 },
  ],
  rustic: [
    { label: 'Wood Carvings',      slug: 'wood-carvings',      top: 50, left: 50, width: 40, height: 30 },
    { label: 'Stone Carvings',     slug: 'stone-carvings',     top: 50, left: 50, width: 40, height: 30 },
    { label: 'Heritage Motifs',    slug: 'heritage-motifs',    top: 50, left: 50, width: 40, height: 30 },
  ],
};

// Generate labels for each style using mapLabels
function generateLabels(style: PlateStyle): ClickableLabel[] {
  const cell = CELLS[style];
  return mapLabels(cell.left, cell.top, cell.w, cell.h, localLabels[style]);
}

// ─── Export Config ───

export const carvingTypesConfig: PlateConfig = {
  imageSrc: '/images/entablature-plate.png',
  alt: 'Carving types by architectural style',
  zones,
  labels: {
    classical:    generateLabels('classical'),
    victorian:    generateLabels('victorian'),
    craftsman:    generateLabels('craftsman'),
    gothic:       generateLabels('gothic'),
    contemporary: generateLabels('contemporary'),
    rustic:       generateLabels('rustic'),
  },
};