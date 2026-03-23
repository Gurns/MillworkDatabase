import type { PlateConfig, PlateStyle, StyleZone, ClickableLabel } from '../PlateZoomViewer';

// ─── Entablature plate: 2×3 grid layout ───
// Top row (0–48%): Classical | Victorian | Craftsman
// Bottom row (52–100%): Gothic | Contemporary | Rustic
// Each cell is ~33.3% wide

const zones: Record<PlateStyle, StyleZone> = {
  classical:    { originX: 16.7, originY: 24,  scale: 2.8 },
  victorian:    { originX: 50,   originY: 24,  scale: 2.8 },
  craftsman:    { originX: 83.3, originY: 24,  scale: 2.8 },
  gothic:       { originX: 16.7, originY: 76,  scale: 2.8 },
  contemporary: { originX: 50,   originY: 76,  scale: 2.8 },
  rustic:       { originX: 83.3, originY: 76,  scale: 2.8 },
};

// Helper: convert (% within cell) → (% of full plate)
// For a cell starting at (cellLeft%, cellTop%) with size (cellW%, cellH%),
// plate coordinate = cellLeft + (localPct / 100) * cellW
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

// Cell bounds (% of full plate)
const CELLS = {
  classical:    { left: 0,    top: 0,  w: 33.3, h: 48 },
  victorian:    { left: 33.3, top: 0,  w: 33.4, h: 48 },
  craftsman:    { left: 66.7, top: 0,  w: 33.3, h: 48 },
  gothic:       { left: 0,    top: 52, w: 33.3, h: 48 },
  contemporary: { left: 33.3, top: 52, w: 33.4, h: 48 },
  rustic:       { left: 66.7, top: 52, w: 33.3, h: 48 },
};

// Labels in local % (within each cell, same as the existing ImageEntablatureDiagram data)
const localLabels: Record<PlateStyle, ClickableLabel[]> = {
  classical: [
    { label: 'Pediment Base',   slug: 'pediments',        top: 5,  left: 1,  width: 28, height: 5 },
    { label: 'Cornice',         slug: 'cornice',          top: 14, left: 7,  width: 20, height: 6 },
    { label: 'Frieze',          slug: 'frieze',           top: 28, left: 9,  width: 16, height: 6 },
    { label: 'Architrave',      slug: 'architrave',       top: 41, left: 5,  width: 25, height: 6 },
    { label: 'Column Capital',  slug: 'capitals',         top: 55, left: 4,  width: 24, height: 7 },
    { label: 'Entablature',     slug: 'entablature',      top: 18, left: 0,  width: 7,  height: 30 },
    { label: 'Cymatium',        slug: 'cornice',          top: 5,  left: 60, width: 38, height: 5 },
    { label: 'Corona',          slug: 'cornice',          top: 10, left: 68, width: 20, height: 4 },
    { label: 'Sima (Gutter)',   slug: 'cornice',          top: 14, left: 62, width: 26, height: 4 },
    { label: 'Modillion',       slug: 'modillions',       top: 18, left: 68, width: 22, height: 4 },
    { label: 'Dentil Band',     slug: 'dentils',          top: 22, left: 65, width: 26, height: 4 },
    { label: 'Bed Mold',        slug: 'trim-and-molding', top: 26, left: 67, width: 22, height: 4 },
    { label: 'Frieze',          slug: 'frieze',           top: 30, left: 72, width: 24, height: 5 },
    { label: 'Taenia',          slug: 'architrave',       top: 37, left: 72, width: 18, height: 4 },
    { label: 'Guttae',          slug: 'architrave',       top: 41, left: 73, width: 16, height: 4 },
    { label: 'Architrave (with Fasciae)', slug: 'architrave', top: 45, left: 60, width: 38, height: 5 },
    { label: 'Abacus',          slug: 'capitals',         top: 53, left: 72, width: 18, height: 4 },
    { label: 'Echinus',         slug: 'capitals',         top: 57, left: 72, width: 18, height: 4 },
    { label: 'Astragal',        slug: 'trim-and-molding', top: 61, left: 70, width: 22, height: 4 },
    { label: 'Necking',         slug: 'capitals',         top: 65, left: 72, width: 18, height: 4 },
    { label: 'Column Shaft',    slug: 'shafts',           top: 72, left: 68, width: 26, height: 5 },
  ],
  victorian: [
    { label: 'Deep Overhanging Cornice', slug: 'cornice',          top: 8,  left: 0, width: 32, height: 8 },
    { label: 'Decorative Bracket',       slug: 'corbels',          top: 19, left: 0, width: 28, height: 7 },
    { label: 'Corbel Table',             slug: 'corbels',          top: 30, left: 0, width: 24, height: 5 },
    { label: 'Narrow Frieze Panel',      slug: 'frieze',           top: 37, left: 0, width: 28, height: 7 },
    { label: 'Picture Rail',       slug: 'trim-and-molding', top: 22, left: 64, width: 30, height: 5 },
    { label: 'Dado Rail',          slug: 'dado-rails',       top: 28, left: 68, width: 24, height: 5 },
    { label: 'Elaborate Crown Molding', slug: 'crown-molding', top: 34, left: 58, width: 40, height: 5 },
    { label: 'Dentil Band (Simplified)', slug: 'dentils',     top: 40, left: 60, width: 38, height: 6 },
    { label: 'Architrave Trim',    slug: 'architrave',       top: 48, left: 62, width: 32, height: 5 },
    { label: 'Paneling',           slug: 'wainscoting',      top: 54, left: 68, width: 22, height: 5 },
    { label: 'Plasterwork',        slug: 'ceiling-and-wall-elements', top: 60, left: 64, width: 28, height: 5 },
    { label: 'Wood Trim',          slug: 'trim-and-molding', top: 66, left: 68, width: 24, height: 4 },
    { label: 'Wall Plate',         slug: 'trim-and-molding', top: 71, left: 68, width: 24, height: 4 },
    { label: 'Ceiling Joist',      slug: 'ceiling-and-wall-elements', top: 76, left: 66, width: 28, height: 5 },
  ],
  craftsman: [
    { label: 'Low-Pitched Roof Line',    slug: 'entablature',      top: 8,  left: 0, width: 38, height: 5 },
    { label: 'Deep Eave Overhang',       slug: 'cornice',          top: 14, left: 0, width: 36, height: 5 },
    { label: 'Fascia Board',             slug: 'frieze',           top: 19, left: 0, width: 26, height: 4 },
    { label: 'Exterior Gutter',          slug: 'cornice',          top: 24, left: 0, width: 30, height: 4 },
    { label: 'Exposed Rafter Tail',      slug: 'corbels',          top: 28, left: 0, width: 38, height: 7 },
    { label: 'T&G Soffit Paneling',      slug: 'soffits',          top: 37, left: 0, width: 38, height: 5 },
    { label: 'Siding Ledge',             slug: 'trim-and-molding', top: 43, left: 0, width: 26, height: 4 },
    { label: 'Frieze Board',             slug: 'frieze',           top: 48, left: 0, width: 26, height: 4 },
    { label: 'Wall Plate',               slug: 'trim-and-molding', top: 53, left: 0, width: 24, height: 4 },
    { label: 'Heavy Timber Lintel',      slug: 'lintels',          top: 58, left: 0, width: 34, height: 5 },
    { label: 'Substantial Wooden Bracket', slug: 'corbels',        top: 65, left: 0, width: 38, height: 7 },
    { label: 'Tapered Column',           slug: 'columns-and-pilasters', top: 75, left: 0, width: 32, height: 5 },
    { label: 'Stone Base',               slug: 'bases',            top: 85, left: 0, width: 26, height: 5 },
    { label: 'Clapboard Siding',         slug: 'trim-and-molding', top: 62, left: 64, width: 32, height: 7 },
  ],
  gothic: [
    { label: 'Parapet Wall',              slug: 'entablature',      top: 6,  left: 0, width: 28, height: 5 },
    { label: 'Coping',                    slug: 'cornice',          top: 12, left: 2, width: 16, height: 4 },
    { label: 'Decorative Blind Arcading', slug: 'carvings',         top: 18, left: 0, width: 30, height: 7 },
    { label: 'Frieze of Quatrefoils',     slug: 'frieze',           top: 28, left: 0, width: 28, height: 7 },
    { label: 'Gargoyle',                  slug: 'carvings',         top: 37, left: 0, width: 22, height: 5 },
    { label: 'Corbel Table',              slug: 'corbels',          top: 43, left: 0, width: 24, height: 5 },
    { label: 'Pointed Arch Rib',          slug: 'windows-and-doorways', top: 49, left: 0, width: 26, height: 7 },
    { label: 'Wall Rib',                  slug: 'entablature',      top: 58, left: 0, width: 20, height: 4 },
    { label: 'Springing Point',           slug: 'columns-and-pilasters', top: 64, left: 0, width: 28, height: 5 },
    { label: 'Drip Mold',                 slug: 'trim-and-molding', top: 72, left: 0, width: 22, height: 4 },
    { label: 'Water Spout',               slug: 'carvings',         top: 78, left: 0, width: 24, height: 5 },
    { label: 'Finial',                    slug: 'finials',          top: 3,  left: 66, width: 30, height: 5 },
    { label: 'Water Spout',               slug: 'carvings',         top: 13, left: 66, width: 28, height: 5 },
    { label: 'Corbel Table',              slug: 'corbels',          top: 40, left: 66, width: 28, height: 5 },
    { label: 'Integrated Wall System',    slug: 'entablature',      top: 48, left: 62, width: 36, height: 6 },
    { label: 'Stone Tracery',             slug: 'windows-and-doorways', top: 56, left: 66, width: 28, height: 5 },
    { label: 'Finial (Partial)',          slug: 'finials',          top: 63, left: 66, width: 30, height: 5 },
    { label: 'Springing Point',           slug: 'columns-and-pilasters', top: 72, left: 66, width: 30, height: 5 },
  ],
  contemporary: [
    { label: 'Minimal Parapet Cap',       slug: 'cornice',          top: 8,  left: 58, width: 40, height: 5 },
    { label: 'Thermal Break',             slug: 'entablature',      top: 14, left: 62, width: 34, height: 4 },
    { label: 'Rigid Insulation',          slug: 'entablature',      top: 19, left: 62, width: 34, height: 4 },
    { label: 'Membrane Roofing',          slug: 'entablature',      top: 24, left: 58, width: 38, height: 4 },
    { label: 'Hidden Gutter System',      slug: 'cornice',          top: 29, left: 56, width: 40, height: 5 },
    { label: 'Minimalist Fascia Panel',   slug: 'frieze',           top: 34, left: 54, width: 44, height: 7 },
    { label: 'Drip Edge',                 slug: 'trim-and-molding', top: 43, left: 68, width: 24, height: 4 },
    { label: 'Window Datum (Mullion)',     slug: 'mullions-and-muntins', top: 48, left: 58, width: 40, height: 5 },
    { label: 'Cladding Datum',            slug: 'trim-and-molding', top: 55, left: 64, width: 30, height: 4 },
    { label: 'Internal Structural Lintel', slug: 'lintels',         top: 60, left: 56, width: 42, height: 6 },
    { label: 'Curtain Wall Junction',     slug: 'windows-and-doorways', top: 68, left: 60, width: 38, height: 5 },
    { label: 'ACM Panel',                 slug: 'trim-and-molding', top: 76, left: 68, width: 24, height: 5 },
    { label: 'Minimalist Fascia (Mullion)', slug: 'mullions-and-muntins', top: 42, left: 0, width: 38, height: 7 },
    { label: 'Simplified Frieze Datum',   slug: 'frieze',           top: 56, left: 0, width: 32, height: 7 },
  ],
  rustic: [
    { label: 'Clay Tile Roof Line',       slug: 'entablature',      top: 8,  left: 0, width: 36, height: 5 },
    { label: 'Drip Board',                slug: 'cornice',          top: 32, left: 0, width: 24, height: 4 },
    { label: 'Log Ends (Exposed)',        slug: 'corbels',          top: 40, left: 0, width: 28, height: 7 },
    { label: 'Heavy Timber Bracket',      slug: 'corbels',          top: 52, left: 0, width: 34, height: 5 },
    { label: 'Hand-Hewn Post',            slug: 'columns-and-pilasters', top: 62, left: 0, width: 32, height: 5 },
    { label: 'Stone Base / Column',       slug: 'bases',            top: 74, left: 0, width: 34, height: 5 },
    { label: 'Log Rafter',               slug: 'entablature',      top: 8,  left: 68, width: 26, height: 5 },
    { label: 'Heavy Timber Purlin',      slug: 'entablature',      top: 14, left: 62, width: 34, height: 5 },
    { label: 'Log Rafter',               slug: 'entablature',      top: 22, left: 68, width: 26, height: 5 },
    { label: 'Heavy Timber Bracket',     slug: 'corbels',          top: 28, left: 62, width: 34, height: 5 },
    { label: 'Log Beam (Lintel)',        slug: 'lintels',          top: 36, left: 66, width: 30, height: 5 },
    { label: 'Integrated Log Structure', slug: 'entablature',      top: 56, left: 60, width: 38, height: 6 },
    { label: 'Rough-Sawn Siding',        slug: 'trim-and-molding', top: 66, left: 66, width: 30, height: 5 },
  ],
};

// Convert local labels (% within cell) to plate-absolute labels (% of full plate)
const labels: Record<PlateStyle, ClickableLabel[]> = {} as any;
for (const style of Object.keys(localLabels) as PlateStyle[]) {
  const c = CELLS[style];
  labels[style] = mapLabels(c.left, c.top, c.w, c.h, localLabels[style]);
}

export const entablatureConfig: PlateConfig = {
  imageSrc: '/images/entablature-plate.png',
  alt: 'The Entablature — architectural elements and stylistic variations',
  zones,
  labels,
};
