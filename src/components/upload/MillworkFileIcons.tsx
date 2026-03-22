/**
 * Blue-line-on-white architectural drawing style SVG icons
 * for each millwork file upload type.
 */

const STROKE = '#2563eb'; // blue-600
const STROKE_LIGHT = '#93c5fd'; // blue-300
const FILL_HINT = '#eff6ff'; // blue-50

interface IconProps {
  className?: string;
}

/**
 * 2D Profile — a cross-section slice of a molding profile.
 * Shows a characteristic ogee/cove profile outline.
 */
export function ProfileSliceIcon({ className = 'w-full h-full' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background hint */}
      <rect x="15" y="15" width="90" height="90" rx="4" fill={FILL_HINT} />
      {/* Cross-section outline — an ogee molding profile */}
      <path
        d="M30 95 L30 55 Q30 45 35 40 Q42 33 50 35 Q55 36 58 40 L60 45 Q62 50 65 48 Q70 44 72 38 Q76 30 80 28 L85 26 L90 25 L90 95 Z"
        fill="none"
        stroke={STROKE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Hatching lines to indicate solid material */}
      <line x1="35" y1="90" x2="55" y2="70" stroke={STROKE_LIGHT} strokeWidth="1" />
      <line x1="45" y1="90" x2="65" y2="70" stroke={STROKE_LIGHT} strokeWidth="1" />
      <line x1="55" y1="90" x2="75" y2="70" stroke={STROKE_LIGHT} strokeWidth="1" />
      <line x1="65" y1="90" x2="85" y2="70" stroke={STROKE_LIGHT} strokeWidth="1" />
      <line x1="75" y1="90" x2="88" y2="77" stroke={STROKE_LIGHT} strokeWidth="1" />
      {/* Dimension line */}
      <line x1="25" y1="25" x2="25" y2="95" stroke={STROKE_LIGHT} strokeWidth="1" strokeDasharray="3 3" />
      <line x1="23" y1="25" x2="27" y2="25" stroke={STROKE_LIGHT} strokeWidth="1.5" />
      <line x1="23" y1="95" x2="27" y2="95" stroke={STROKE_LIGHT} strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Installed Photo — shows a camera/photo frame with molding in context.
 * Depicts a room corner with crown molding installed.
 */
export function InstalledPhotoIcon({ className = 'w-full h-full' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Photo frame */}
      <rect x="20" y="25" width="80" height="70" rx="3" fill={FILL_HINT} stroke={STROKE} strokeWidth="2" />
      {/* Room corner — ceiling and wall meeting */}
      <line x1="25" y1="55" x2="95" y2="55" stroke={STROKE_LIGHT} strokeWidth="1.5" />
      {/* Crown molding profile along the top of the wall */}
      <path
        d="M25 52 Q30 48 35 50 Q40 52 42 48 L45 44 Q48 42 52 44 Q56 46 60 44 Q64 42 68 44 Q72 46 76 44 Q80 42 84 44 L87 48 Q89 52 92 50 Q95 48 95 52"
        fill="none"
        stroke={STROKE}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Wall texture lines */}
      <line x1="40" y1="60" x2="40" y2="90" stroke={STROKE_LIGHT} strokeWidth="0.75" />
      <line x1="60" y1="58" x2="60" y2="90" stroke={STROKE_LIGHT} strokeWidth="0.75" />
      <line x1="80" y1="60" x2="80" y2="90" stroke={STROKE_LIGHT} strokeWidth="0.75" />
      {/* Camera icon in corner */}
      <circle cx="88" cy="35" r="6" fill="none" stroke={STROKE} strokeWidth="1.5" />
      <circle cx="88" cy="35" r="2.5" fill={STROKE} />
    </svg>
  );
}

/**
 * 3D Model — shows an isometric 6-inch section of molding
 * with rotation arrows indicating spinnability.
 */
export function ThreeDModelIcon({ className = 'w-full h-full' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Isometric 3D block — a short extrusion of a profile */}
      {/* Front face */}
      <path
        d="M30 80 L30 45 Q32 38 38 35 Q45 32 48 38 L50 45 L52 42 Q56 36 62 38 L65 40 L65 80 Z"
        fill={FILL_HINT}
        stroke={STROKE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Top face (perspective) */}
      <path
        d="M30 45 Q32 38 38 35 Q45 32 48 38 L50 45 L52 42 Q56 36 62 38 L65 40 L85 30 Q79 26 75 28 Q71 30 69 32 L67 35 L65 32 Q61 22 55 25 Q51 27 50 35 L50 35 Z"
        fill="none"
        stroke={STROKE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Side face */}
      <path
        d="M65 40 L85 30 L85 70 L65 80 Z"
        fill="none"
        stroke={STROKE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Depth lines */}
      <line x1="30" y1="45" x2="50" y2="35" stroke={STROKE_LIGHT} strokeWidth="1" strokeDasharray="2 2" />
      {/* Rotation arrow (circular) */}
      <path
        d="M90 55 A15 15 0 1 1 100 70"
        fill="none"
        stroke={STROKE}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M98 66 L100 70 L104 67" fill="none" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* "3D" label */}
      <text x="92" y="92" fontSize="12" fontWeight="bold" fill={STROKE} fontFamily="system-ui">3D</text>
    </svg>
  );
}

/**
 * 3D Scan — shows a handheld scanner emitting scan lines
 * over a piece of molding, with a point cloud suggestion.
 */
export function ThreeDScanIcon({ className = 'w-full h-full' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Scanner device (simplified handheld shape) */}
      <rect x="18" y="22" width="22" height="35" rx="4" fill="none" stroke={STROKE} strokeWidth="2" />
      <rect x="22" y="26" width="14" height="8" rx="2" fill={FILL_HINT} stroke={STROKE} strokeWidth="1.5" />
      {/* Scanner handle */}
      <rect x="24" y="57" width="10" height="18" rx="2" fill="none" stroke={STROKE} strokeWidth="1.5" />
      {/* Scan beam / fan lines */}
      <line x1="40" y1="30" x2="75" y2="35" stroke={STROKE} strokeWidth="1" strokeDasharray="3 2" />
      <line x1="40" y1="38" x2="75" y2="50" stroke={STROKE} strokeWidth="1" strokeDasharray="3 2" />
      <line x1="40" y1="46" x2="75" y2="65" stroke={STROKE} strokeWidth="1" strokeDasharray="3 2" />
      {/* Target molding piece */}
      <path
        d="M70 30 L70 70 Q72 68 76 65 Q80 60 82 55 Q84 50 86 48 Q90 44 93 42 L95 40 L95 30 Z"
        fill={FILL_HINT}
        stroke={STROKE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Point cloud dots on the molding */}
      <circle cx="73" cy="40" r="1.5" fill={STROKE} />
      <circle cx="76" cy="45" r="1.5" fill={STROKE} />
      <circle cx="80" cy="50" r="1.5" fill={STROKE} />
      <circle cx="78" cy="55" r="1.5" fill={STROKE} />
      <circle cx="74" cy="60" r="1.5" fill={STROKE} />
      <circle cx="83" cy="44" r="1.5" fill={STROKE} />
      <circle cx="88" cy="42" r="1.5" fill={STROKE} />
      <circle cx="85" cy="48" r="1.5" fill={STROKE} />
      <circle cx="90" cy="38" r="1" fill={STROKE_LIGHT} />
      <circle cx="77" cy="35" r="1" fill={STROKE_LIGHT} />
      <circle cx="82" cy="38" r="1" fill={STROKE_LIGHT} />
      {/* Label */}
      <text x="58" y="95" fontSize="10" fill={STROKE} fontFamily="system-ui">SCAN</text>
    </svg>
  );
}

/**
 * Tessellated Mesh — shows a triangulated wireframe surface
 * representing a mesh export.
 */
export function TessellatedMeshIcon({ className = 'w-full h-full' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Mesh surface — triangulated grid forming a curved molding surface */}
      {/* Row 1 */}
      <polygon points="25,35 45,30 35,50" fill={FILL_HINT} stroke={STROKE} strokeWidth="1.5" />
      <polygon points="45,30 65,28 55,48" fill={FILL_HINT} stroke={STROKE} strokeWidth="1.5" />
      <polygon points="45,30 55,48 35,50" fill="none" stroke={STROKE} strokeWidth="1.5" />
      <polygon points="65,28 85,30 75,48" fill={FILL_HINT} stroke={STROKE} strokeWidth="1.5" />
      <polygon points="65,28 75,48 55,48" fill="none" stroke={STROKE} strokeWidth="1.5" />
      <polygon points="85,30 95,35 85,52" fill={FILL_HINT} stroke={STROKE} strokeWidth="1.5" />
      <polygon points="85,30 85,52 75,48" fill="none" stroke={STROKE} strokeWidth="1.5" />
      {/* Row 2 */}
      <polygon points="25,35 35,50 28,65" fill={FILL_HINT} stroke={STROKE} strokeWidth="1.5" />
      <polygon points="35,50 55,48 48,66" fill="none" stroke={STROKE} strokeWidth="1.5" />
      <polygon points="35,50 48,66 28,65" fill={FILL_HINT} stroke={STROKE} strokeWidth="1.5" />
      <polygon points="55,48 75,48 68,66" fill="none" stroke={STROKE} strokeWidth="1.5" />
      <polygon points="55,48 68,66 48,66" fill={FILL_HINT} stroke={STROKE} strokeWidth="1.5" />
      <polygon points="75,48 85,52 82,68" fill="none" stroke={STROKE} strokeWidth="1.5" />
      <polygon points="75,48 82,68 68,66" fill={FILL_HINT} stroke={STROKE} strokeWidth="1.5" />
      <polygon points="85,52 95,35 95,65" fill="none" stroke={STROKE} strokeWidth="1.5" />
      <polygon points="85,52 95,65 82,68" fill={FILL_HINT} stroke={STROKE} strokeWidth="1.5" />
      {/* Row 3 */}
      <polygon points="28,65 48,66 38,85" fill={FILL_HINT} stroke={STROKE} strokeWidth="1.5" />
      <polygon points="28,65 38,85 25,82" fill="none" stroke={STROKE} strokeWidth="1.5" />
      <polygon points="48,66 68,66 60,85" fill="none" stroke={STROKE} strokeWidth="1.5" />
      <polygon points="48,66 60,85 38,85" fill={FILL_HINT} stroke={STROKE} strokeWidth="1.5" />
      <polygon points="68,66 82,68 78,87" fill="none" stroke={STROKE} strokeWidth="1.5" />
      <polygon points="68,66 78,87 60,85" fill={FILL_HINT} stroke={STROKE} strokeWidth="1.5" />
      <polygon points="82,68 95,65 95,85" fill="none" stroke={STROKE} strokeWidth="1.5" />
      <polygon points="82,68 95,85 78,87" fill={FILL_HINT} stroke={STROKE} strokeWidth="1.5" />
      {/* Vertex dots at key intersections */}
      <circle cx="25" cy="35" r="2" fill={STROKE} />
      <circle cx="65" cy="28" r="2" fill={STROKE} />
      <circle cx="95" cy="35" r="2" fill={STROKE} />
      <circle cx="55" cy="48" r="2" fill={STROKE} />
      <circle cx="60" cy="85" r="2" fill={STROKE} />
    </svg>
  );
}
