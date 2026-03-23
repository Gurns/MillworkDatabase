'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ARCHITECTURAL_STYLES } from '@/lib/utils/constants';

// ─── Types ───
type DiagramView = 'entablature' | 'column' | 'window' | 'staircase' | 'ceiling';

interface ClickableElement {
  id: string;
  label: string;
  slug: string;        // category slug for navigation
  path: string;        // SVG path or rect data
  labelPos: { x: number; y: number };
}

// ─── Architectural styles that affect the diagrams ───
const INTERACTIVE_STYLES = [
  'Classical',
  'Victorian',
  'Craftsman',
  'Gothic Revival',
  'Art Deco',
] as const;

type InteractiveStyle = typeof INTERACTIVE_STYLES[number];

// ─── Main Component ───
interface ArchitecturalExplorerProps {
  /** Compact mode for sub-pages — smaller diagram, no outer padding */
  compact?: boolean;
  /**
   * When true, clicking a diagram element appends ?category=slug to
   * the current URL instead of navigating to /categories/{slug}.
   */
  filterMode?: boolean;
}

export function ArchitecturalExplorer({ compact = false, filterMode = false }: ArchitecturalExplorerProps) {
  const [activeView, setActiveView] = useState<DiagramView>('entablature');
  const [activeStyle, setActiveStyle] = useState<InteractiveStyle>('Classical');
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const views: { key: DiagramView; label: string; icon: string }[] = [
    { key: 'entablature', label: 'Entablature', icon: '🏛️' },
    { key: 'column', label: 'Columns', icon: '🏗️' },
    { key: 'window', label: 'Windows & Doors', icon: '🚪' },
    { key: 'staircase', label: 'Stair Parts', icon: '🪜' },
    { key: 'ceiling', label: 'Ceiling & Wall', icon: '🏠' },
  ];

  /** Build link for clickable region: filter mode or navigate mode */
  function buildCategoryHref(slug: string): string {
    if (!filterMode) {
      return `/categories/${slug}`;
    }
    const params = new URLSearchParams(searchParams.toString());
    if (params.get('element') === slug) {
      params.delete('element');
    } else {
      params.set('element', slug);
    }
    params.delete('page');
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-3 py-2 border-b border-gray-100">
          <h3 className="text-sm font-display font-bold text-gray-900">Architectural Elements</h3>
        </div>
        {/* Style selector — compact pills */}
        <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-gray-100">
          {INTERACTIVE_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => setActiveStyle(style)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                activeStyle === style
                  ? 'bg-wood-800 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
        {/* View tabs — compact */}
        <div className="flex gap-0.5 px-3 py-1.5 overflow-x-auto border-b border-gray-100">
          {views.map((v) => (
            <button
              key={v.key}
              onClick={() => setActiveView(v.key)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-all ${
                activeView === v.key
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-500 hover:text-brand-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-xs">{v.icon}</span>
              {v.label}
            </button>
          ))}
        </div>
        {/* Compact diagram */}
        <div className="relative bg-gray-50 overflow-hidden" style={{ minHeight: 300 }}>
          <div className="transition-opacity duration-500">
            {activeView === 'entablature' && (
              <EntablatureDiagram style={activeStyle} hoveredElement={hoveredElement} onHover={setHoveredElement} buildHref={buildCategoryHref} />
            )}
            {activeView === 'column' && (
              <ColumnDiagram style={activeStyle} hoveredElement={hoveredElement} onHover={setHoveredElement} buildHref={buildCategoryHref} />
            )}
            {activeView === 'window' && (
              <WindowDiagram style={activeStyle} hoveredElement={hoveredElement} onHover={setHoveredElement} buildHref={buildCategoryHref} />
            )}
            {activeView === 'staircase' && (
              <StaircaseDiagram style={activeStyle} hoveredElement={hoveredElement} onHover={setHoveredElement} buildHref={buildCategoryHref} />
            )}
            {activeView === 'ceiling' && (
              <CeilingWallDiagram style={activeStyle} hoveredElement={hoveredElement} onHover={setHoveredElement} buildHref={buildCategoryHref} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
            Explore Architectural Elements
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Click on any element in the diagram to browse designs in that category.
            Switch styles to see how elements change across architectural traditions.
          </p>
        </div>

        {/* Style selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {INTERACTIVE_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => setActiveStyle(style)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeStyle === style
                  ? 'bg-wood-800 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {style}
            </button>
          ))}
        </div>

        {/* View tabs */}
        <div className="flex justify-center gap-1 mb-8 overflow-x-auto pb-2">
          {views.map((v) => (
            <button
              key={v.key}
              onClick={() => setActiveView(v.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeView === v.key
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              <span>{v.icon}</span>
              {v.label}
            </button>
          ))}
        </div>

        {/* Diagram area */}
        <div className="relative bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden" style={{ minHeight: 500 }}>
          <div className="transition-opacity duration-500">
            {activeView === 'entablature' && (
              <EntablatureDiagram style={activeStyle} hoveredElement={hoveredElement} onHover={setHoveredElement} buildHref={buildCategoryHref} />
            )}
            {activeView === 'column' && (
              <ColumnDiagram style={activeStyle} hoveredElement={hoveredElement} onHover={setHoveredElement} buildHref={buildCategoryHref} />
            )}
            {activeView === 'window' && (
              <WindowDiagram style={activeStyle} hoveredElement={hoveredElement} onHover={setHoveredElement} buildHref={buildCategoryHref} />
            )}
            {activeView === 'staircase' && (
              <StaircaseDiagram style={activeStyle} hoveredElement={hoveredElement} onHover={setHoveredElement} buildHref={buildCategoryHref} />
            )}
            {activeView === 'ceiling' && (
              <CeilingWallDiagram style={activeStyle} hoveredElement={hoveredElement} onHover={setHoveredElement} buildHref={buildCategoryHref} />
            )}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg px-4 py-2 text-xs text-gray-500 border border-gray-200">
            <span className="inline-block w-3 h-3 border-2 border-brand-500 rounded-sm mr-1 align-middle" />
            Click highlighted elements to browse designs
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Shared helpers ───
interface DiagramProps {
  style: InteractiveStyle;
  hoveredElement: string | null;
  onHover: (id: string | null) => void;
  /** Function to build href — supports navigate or filter mode */
  buildHref: (slug: string) => string;
}

function ClickableRegion({
  slug,
  label,
  children,
  hovered,
  onHover,
  labelX,
  labelY,
  buildHref,
}: {
  slug: string;
  label: string;
  children: React.ReactNode;
  hovered: boolean;
  onHover: (id: string | null) => void;
  labelX: number;
  labelY: number;
  buildHref?: (slug: string) => string;
}) {
  const href = buildHref ? buildHref(slug) : `/categories/${slug}`;
  return (
    <Link href={href} scroll={false}>
      <g
        className="cursor-pointer"
        onMouseEnter={() => onHover(slug)}
        onMouseLeave={() => onHover(null)}
      >
        <g
          className="transition-all duration-200"
          style={{
            filter: hovered ? 'drop-shadow(0 0 6px rgba(180, 83, 9, 0.4))' : 'none',
          }}
        >
          {children}
        </g>
        {/* Label */}
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          className={`text-[10px] font-semibold pointer-events-none transition-all duration-200 ${
            hovered ? 'fill-brand-700' : 'fill-gray-600'
          }`}
        >
          {label}
        </text>
      </g>
    </Link>
  );
}

// ─── Style-specific visual configs ───
function getStyleConfig(style: InteractiveStyle) {
  switch (style) {
    case 'Classical':
      return { strokeColor: '#44403c', fillColor: '#faf7f2', accentColor: '#d4a574', ornateLevel: 2 };
    case 'Victorian':
      return { strokeColor: '#3f1f0a', fillColor: '#fef3e2', accentColor: '#8b4513', ornateLevel: 4 };
    case 'Craftsman':
      return { strokeColor: '#5c4033', fillColor: '#f5f0e8', accentColor: '#8b7355', ornateLevel: 1 };
    case 'Gothic Revival':
      return { strokeColor: '#2d2d2d', fillColor: '#f0f0f0', accentColor: '#555555', ornateLevel: 3 };
    case 'Art Deco':
      return { strokeColor: '#1a1a2e', fillColor: '#f5f5f0', accentColor: '#c5a55a', ornateLevel: 2 };
    default:
      return { strokeColor: '#44403c', fillColor: '#faf7f2', accentColor: '#d4a574', ornateLevel: 2 };
  }
}

// ═══════════════════════════════════════════════════════
// ENTABLATURE DIAGRAM
// ═══════════════════════════════════════════════════════
function EntablatureDiagram({ style, hoveredElement, onHover, buildHref }: DiagramProps) {
  const cfg = getStyleConfig(style);

  // Style-specific ornament details
  const hasDentils = style === 'Classical' || style === 'Gothic Revival';
  const hasModillions = style === 'Classical' || style === 'Victorian';
  const hasTriglyphs = style === 'Classical';
  const hasScrollwork = style === 'Victorian';
  const hasGeometric = style === 'Art Deco';
  const isSimple = style === 'Craftsman';

  return (
    <div className="flex items-center justify-center p-8">
      <svg viewBox="0 0 700 500" className="w-full max-w-3xl" xmlns="http://www.w3.org/2000/svg">
        {/* Title */}
        <text x="350" y="30" textAnchor="middle" className="text-sm font-display fill-gray-800 font-bold">
          {style} Entablature
        </text>

        {/* ── CORNICE (top section) ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="cornice"
          label="Cornice"
          hovered={hoveredElement === 'cornice'}
          onHover={onHover}
          labelX={600}
          labelY={80}
        >
          {/* Corona / crown */}
          <rect x="80" y="50" width="440" height="30" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2.5" />
          {/* Cyma recta top */}
          <path d={`M 80 50 Q 80 42, 90 42 L 510 42 Q 520 42, 520 50`} fill="none" stroke={cfg.strokeColor} strokeWidth="2" />
          {/* Drip edge */}
          <rect x="75" y="40" width="450" height="5" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="1.5" />
          {/* Bed molding under corona */}
          <path d={`M 80 80 Q 80 85, 85 88 L 515 88 Q 520 85, 520 80`} fill="none" stroke={cfg.strokeColor} strokeWidth="1.5" />

          {/* Leader line */}
          <line x1="525" y1="65" x2="585" y2="75" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* ── DENTILS ── */}
        {hasDentils && (
          <ClickableRegion
          buildHref={buildHref}
            slug="dentils"
            label="Dentils"
            hovered={hoveredElement === 'dentils'}
            onHover={onHover}
            labelX={600}
            labelY={110}
          >
            <g>
              {Array.from({ length: 22 }).map((_, i) => (
                <rect
                  key={i}
                  x={90 + i * 20}
                  y="92"
                  width="12"
                  height="16"
                  fill={cfg.fillColor}
                  stroke={cfg.strokeColor}
                  strokeWidth="1.5"
                />
              ))}
            </g>
            <line x1="525" y1="100" x2="585" y2="108" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
          </ClickableRegion>
        )}

        {/* ── MODILLIONS ── */}
        {hasModillions && (
          <ClickableRegion
          buildHref={buildHref}
            slug="modillions"
            label="Modillions"
            hovered={hoveredElement === 'modillions'}
            onHover={onHover}
            labelX={600}
            labelY={140}
          >
            <g>
              {Array.from({ length: 11 }).map((_, i) => (
                <g key={i}>
                  <rect
                    x={90 + i * 40}
                    y={hasDentils ? 112 : 92}
                    width="20"
                    height="24"
                    rx="2"
                    fill={cfg.fillColor}
                    stroke={cfg.strokeColor}
                    strokeWidth="1.5"
                  />
                  {/* Scroll detail */}
                  <path
                    d={`M ${95 + i * 40} ${(hasDentils ? 112 : 92) + 20} Q ${100 + i * 40} ${(hasDentils ? 112 : 92) + 28}, ${105 + i * 40} ${(hasDentils ? 112 : 92) + 20}`}
                    fill="none"
                    stroke={cfg.strokeColor}
                    strokeWidth="1"
                  />
                </g>
              ))}
            </g>
            <line x1="525" y1="125" x2="585" y2="135" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
          </ClickableRegion>
        )}

        {/* ── FRIEZE (middle band) ── */}
        {(() => {
          const friezeY = hasDentils && hasModillions ? 140 : hasDentils ? 112 : hasModillions ? 120 : 92;
          return (
            <ClickableRegion
          buildHref={buildHref}
              slug="frieze"
              label="Frieze"
              hovered={hoveredElement === 'frieze'}
              onHover={onHover}
              labelX={600}
              labelY={friezeY + 40}
            >
              <rect x="100" y={friezeY} width="400" height="60" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2.5" />

              {/* Style-specific frieze decoration */}
              {hasTriglyphs && (
                <g>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <g key={i}>
                      {/* Triglyph */}
                      <rect x={110 + i * 50} y={friezeY + 5} width="20" height="50" fill="none" stroke={cfg.strokeColor} strokeWidth="1.5" />
                      <line x1={116 + i * 50} y1={friezeY + 5} x2={116 + i * 50} y2={friezeY + 55} stroke={cfg.strokeColor} strokeWidth="1" />
                      <line x1={124 + i * 50} y1={friezeY + 5} x2={124 + i * 50} y2={friezeY + 55} stroke={cfg.strokeColor} strokeWidth="1" />
                    </g>
                  ))}
                </g>
              )}
              {hasScrollwork && (
                <g>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <path
                      key={i}
                      d={`M ${130 + i * 60} ${friezeY + 30} C ${145 + i * 60} ${friezeY + 10}, ${155 + i * 60} ${friezeY + 50}, ${170 + i * 60} ${friezeY + 30}`}
                      fill="none"
                      stroke={cfg.accentColor}
                      strokeWidth="1.5"
                    />
                  ))}
                </g>
              )}
              {hasGeometric && (
                <g>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <g key={i} transform={`translate(${120 + i * 38}, ${friezeY + 10})`}>
                      <polygon points="0,20 10,0 20,20 10,40" fill="none" stroke={cfg.accentColor} strokeWidth="1" />
                    </g>
                  ))}
                </g>
              )}

              <line x1="505" y1={friezeY + 30} x2="585" y2={friezeY + 35} stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
            </ClickableRegion>
          );
        })()}

        {/* ── ARCHITRAVE (bottom band) ── */}
        {(() => {
          const architraveY = hasDentils && hasModillions ? 205 : hasDentils ? 177 : hasModillions ? 185 : 157;
          return (
            <ClickableRegion
          buildHref={buildHref}
              slug="architrave"
              label="Architrave"
              hovered={hoveredElement === 'architrave'}
              onHover={onHover}
              labelX={600}
              labelY={architraveY + 28}
            >
              <rect x="110" y={architraveY} width="380" height="18" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2" />
              <rect x="115" y={architraveY + 18} width="370" height="14" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="1.5" />
              <rect x="120" y={architraveY + 32} width="360" height="10" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="1" />

              <line x1="505" y1={architraveY + 21} x2="585" y2={architraveY + 25} stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
            </ClickableRegion>
          );
        })()}

        {/* ── COLUMN CAPITALS (supporting) ── */}
        {(() => {
          const capY = hasDentils && hasModillions ? 250 : hasDentils ? 222 : hasModillions ? 230 : 202;
          return (
            <ClickableRegion
          buildHref={buildHref}
              slug="column-capitals"
              label="Capital"
              hovered={hoveredElement === 'column-capitals'}
              onHover={onHover}
              labelX={600}
              labelY={capY + 35}
            >
              {/* Left column capital */}
              <path
                d={`M 130 ${capY} L 110 ${capY + 15} L 110 ${capY + 25} L 190 ${capY + 25} L 190 ${capY + 15} L 170 ${capY}`}
                fill={cfg.fillColor}
                stroke={cfg.strokeColor}
                strokeWidth="2.5"
              />
              {style === 'Classical' && (
                <>
                  <path
                    d={`M 120 ${capY + 8} C 130 ${capY - 5}, 140 ${capY + 15}, 150 ${capY + 8}`}
                    fill="none" stroke={cfg.accentColor} strokeWidth="1.5"
                  />
                  <path
                    d={`M 150 ${capY + 8} C 160 ${capY - 5}, 170 ${capY + 15}, 180 ${capY + 8}`}
                    fill="none" stroke={cfg.accentColor} strokeWidth="1.5"
                  />
                </>
              )}

              {/* Right column capital */}
              <path
                d={`M 430 ${capY} L 410 ${capY + 15} L 410 ${capY + 25} L 490 ${capY + 25} L 490 ${capY + 15} L 470 ${capY}`}
                fill={cfg.fillColor}
                stroke={cfg.strokeColor}
                strokeWidth="2.5"
              />

              {/* Column shafts (partial) */}
              <rect x="135" y={capY + 25} width="30" height="180" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2" />
              <rect x="435" y={capY + 25} width="30" height="180" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2" />

              {/* Fluting */}
              {style !== 'Craftsman' && (
                <g>
                  {[0, 1, 2, 3].map((i) => (
                    <g key={i}>
                      <line x1={140 + i * 7} y1={capY + 30} x2={140 + i * 7} y2={capY + 200} stroke={cfg.strokeColor} strokeWidth="0.5" opacity="0.4" />
                      <line x1={440 + i * 7} y1={capY + 30} x2={440 + i * 7} y2={capY + 200} stroke={cfg.strokeColor} strokeWidth="0.5" opacity="0.4" />
                    </g>
                  ))}
                </g>
              )}

              <line x1="495" y1={capY + 15} x2="585" y2={capY + 30} stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
            </ClickableRegion>
          );
        })()}

        {/* Style badge */}
        <rect x="280" y="460" width="140" height="28" rx="14" fill={cfg.strokeColor} />
        <text x="350" y="479" textAnchor="middle" className="text-[11px] fill-white font-medium">
          {style} Order
        </text>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// COLUMN DIAGRAM
// ═══════════════════════════════════════════════════════
function ColumnDiagram({ style, hoveredElement, onHover, buildHref }: DiagramProps) {
  const cfg = getStyleConfig(style);

  const isFluted = style !== 'Craftsman';
  const hasVolutes = style === 'Classical' || style === 'Victorian';
  const hasAcanthus = style === 'Classical';

  return (
    <div className="flex items-center justify-center p-8">
      <svg viewBox="0 0 700 520" className="w-full max-w-3xl" xmlns="http://www.w3.org/2000/svg">
        <text x="350" y="30" textAnchor="middle" className="text-sm font-display fill-gray-800 font-bold">
          {style} Column Orders
        </text>

        {/* ── CAPITAL ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="column-capitals"
          label="Capital"
          hovered={hoveredElement === 'column-capitals'}
          onHover={onHover}
          labelX={530}
          labelY={95}
        >
          {/* Abacus (top slab) */}
          <rect x="250" y="55" width="200" height="15" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2.5" />

          {/* Echinus / bell */}
          <path
            d={`M 270 70 Q 270 ${hasAcanthus ? 105 : 95}, 290 ${hasAcanthus ? 115 : 100} L 410 ${hasAcanthus ? 115 : 100} Q 430 ${hasAcanthus ? 105 : 95}, 430 70`}
            fill={cfg.fillColor}
            stroke={cfg.strokeColor}
            strokeWidth="2.5"
          />

          {/* Volutes */}
          {hasVolutes && (
            <>
              <path d="M 270 80 C 255 75, 255 95, 270 90" fill="none" stroke={cfg.strokeColor} strokeWidth="2" />
              <path d="M 430 80 C 445 75, 445 95, 430 90" fill="none" stroke={cfg.strokeColor} strokeWidth="2" />
            </>
          )}

          {/* Acanthus leaves */}
          {hasAcanthus && (
            <g>
              {[0, 1, 2, 3, 4].map((i) => (
                <path
                  key={i}
                  d={`M ${310 + i * 22} 105 C ${315 + i * 22} 85, ${325 + i * 22} 85, ${320 + i * 22} 105`}
                  fill="none"
                  stroke={cfg.accentColor}
                  strokeWidth="1.2"
                />
              ))}
            </g>
          )}

          {style === 'Art Deco' && (
            <g>
              {[0, 1, 2].map((i) => (
                <rect key={i} x={295 + i * 45} y="78" width="30" height="6" fill="none" stroke={cfg.accentColor} strokeWidth="1" />
              ))}
            </g>
          )}

          <line x1="435" y1="85" x2="515" y2="90" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* ── SHAFT ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="column-shafts"
          label="Shaft"
          hovered={hoveredElement === 'column-shafts'}
          onHover={onHover}
          labelX={530}
          labelY={250}
        >
          {/* Shaft with entasis */}
          <path
            d={`M 295 ${hasAcanthus ? 118 : 103} L 290 380 L 410 380 L 405 ${hasAcanthus ? 118 : 103}`}
            fill={cfg.fillColor}
            stroke={cfg.strokeColor}
            strokeWidth="2.5"
          />

          {/* Fluting */}
          {isFluted && (
            <g>
              {Array.from({ length: 10 }).map((_, i) => (
                <line
                  key={i}
                  x1={300 + i * 11}
                  y1={hasAcanthus ? 120 : 105}
                  x2={298 + i * 11}
                  y2="378"
                  stroke={cfg.strokeColor}
                  strokeWidth="0.6"
                  opacity="0.35"
                />
              ))}
            </g>
          )}

          {/* Astragal molding at neck */}
          <rect x="292" y={hasAcanthus ? 115 : 100} width="116" height="6" rx="3" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="1.5" />

          <line x1="413" y1="250" x2="515" y2="248" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* ── BASE ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="column-bases"
          label="Base"
          hovered={hoveredElement === 'column-bases'}
          onHover={onHover}
          labelX={530}
          labelY={410}
        >
          {/* Torus (upper) */}
          <rect x="280" y="380" width="140" height="14" rx="7" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2" />
          {/* Scotia */}
          <path d="M 280 394 Q 285 402, 290 400 L 410 400 Q 415 402, 420 394" fill="none" stroke={cfg.strokeColor} strokeWidth="1.5" />
          {/* Torus (lower) */}
          <rect x="275" y="400" width="150" height="14" rx="7" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2" />
          {/* Plinth */}
          <rect x="265" y="414" width="170" height="22" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2.5" />

          <line x1="440" y1="410" x2="515" y2="408" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* ── PILASTER hint ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="pilasters"
          label="Pilaster"
          hovered={hoveredElement === 'pilasters'}
          onHover={onHover}
          labelX={130}
          labelY={250}
        >
          {/* Flat pilaster on left side */}
          <rect x="80" y="55" width="50" height="382" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="1.5" strokeDasharray="4,2" />
          <text x="105" y="245" textAnchor="middle" className="text-[8px] fill-gray-400" transform="rotate(-90, 105, 245)">
            Flat wall-mounted column
          </text>
          <line x1="132" y1="250" x2="145" y2="250" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* Style badge */}
        <rect x="280" y="470" width="140" height="28" rx="14" fill={cfg.strokeColor} />
        <text x="350" y="489" textAnchor="middle" className="text-[11px] fill-white font-medium">
          {style} Column
        </text>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// WINDOW / DOORWAY DIAGRAM
// ═══════════════════════════════════════════════════════
function WindowDiagram({ style, hoveredElement, onHover, buildHref }: DiagramProps) {
  const cfg = getStyleConfig(style);
  const hasArch = style === 'Classical' || style === 'Gothic Revival' || style === 'Victorian';
  const isPointed = style === 'Gothic Revival';
  const hasFanlight = style === 'Classical' || style === 'Victorian';

  // Window opening dimensions
  const wx = 200, wy = 80, ww = 300, wh = 340;

  return (
    <div className="flex items-center justify-center p-8">
      <svg viewBox="0 0 700 520" className="w-full max-w-3xl" xmlns="http://www.w3.org/2000/svg">
        <text x="350" y="30" textAnchor="middle" className="text-sm font-display fill-gray-800 font-bold">
          {style} Window & Doorway Elements
        </text>

        {/* Wall background */}
        <rect x="120" y="50" width="460" height="430" fill="#f5f0ea" stroke={cfg.strokeColor} strokeWidth="1" opacity="0.3" />

        {/* ── PEDIMENT ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="pediments"
          label="Pediment"
          hovered={hoveredElement === 'pediments'}
          onHover={onHover}
          labelX={80}
          labelY={65}
        >
          <path
            d={isPointed
              ? `M 180 80 L 350 30 L 520 80`
              : `M 180 80 L 190 60 L 510 60 L 520 80`
            }
            fill={cfg.fillColor}
            stroke={cfg.strokeColor}
            strokeWidth="2.5"
          />
          {/* Tympanum fill */}
          {!isPointed && (
            <line x1="250" y1="70" x2="450" y2="70" stroke={cfg.strokeColor} strokeWidth="1" opacity="0.3" />
          )}
          <line x1="180" y1="68" x2="95" y2="62" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* ── LINTEL ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="lintels"
          label="Lintel"
          hovered={hoveredElement === 'lintels'}
          onHover={onHover}
          labelX={80}
          labelY={95}
        >
          <rect x={wx - 10} y={wy} width={ww + 20} height="18" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2.5" />
          <line x1="190" y1="90" x2="95" y2="92" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* ── ARCHITRAVE (surround) ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="door-window-architraves"
          label="Casing"
          hovered={hoveredElement === 'door-window-architraves'}
          onHover={onHover}
          labelX={80}
          labelY={200}
        >
          {/* Left casing (side of window frame) */}
          <rect x={wx - 20} y={wy + 18} width="20" height={wh} fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2.5" />
          {/* Right casing (side of window frame) */}
          <rect x={wx + ww} y={wy + 18} width="20" height={wh} fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2.5" />

          {style === 'Victorian' && (
            <>
              <path d={`M ${wx - 15} ${wy + 50} C ${wx - 25} ${wy + 70}, ${wx - 5} ${wy + 90}, ${wx - 15} ${wy + 110}`} fill="none" stroke={cfg.accentColor} strokeWidth="1" />
              <path d={`M ${wx + ww + 15} ${wy + 50} C ${wx + ww + 25} ${wy + 70}, ${wx + ww + 5} ${wy + 90}, ${wx + ww + 15} ${wy + 110}`} fill="none" stroke={cfg.accentColor} strokeWidth="1" />
            </>
          )}
          <line x1={wx - 20} y1="200" x2="95" y2="198" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* ── Window Opening ── */}
        <rect x={wx} y={wy + 18} width={ww} height={wh - 18} fill="#e8edf2" stroke={cfg.strokeColor} strokeWidth="1" />

        {/* ── FANLIGHT / TRANSOM ── */}
        {hasFanlight && (
          <ClickableRegion
          buildHref={buildHref}
            slug="transoms-and-fanlights"
            label="Fanlight"
            hovered={hoveredElement === 'transoms-and-fanlights'}
            onHover={onHover}
            labelX={620}
            labelY={140}
          >
            <rect x={wx} y={wy + 18} width={ww} height="50" fill="#dce5ef" stroke={cfg.strokeColor} strokeWidth="1.5" />
            {/* Fan ribs */}
            {Array.from({ length: 7 }).map((_, i) => (
              <line
                key={i}
                x1={wx + ww / 2}
                y1={wy + 68}
                x2={wx + 30 + i * (ww - 60) / 6}
                y2={wy + 18}
                stroke={cfg.strokeColor}
                strokeWidth="0.8"
              />
            ))}
            <line x1={wx + ww + 20} y1="135" x2="605" y2="137" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
          </ClickableRegion>
        )}

        {/* ── MULLIONS ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="mullions-and-muntins"
          label="Mullions"
          hovered={hoveredElement === 'mullions-and-muntins'}
          onHover={onHover}
          labelX={620}
          labelY={260}
        >
          {/* Vertical mullion */}
          <rect x={wx + ww / 2 - 4} y={wy + (hasFanlight ? 68 : 18)} width="8" height={wh - (hasFanlight ? 68 : 18)} fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="1.5" />
          {/* Horizontal muntin */}
          <rect x={wx} y={wy + wh / 2 + 20} width={ww} height="6" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="1" />

          <line x1={wx + ww + 20} y1="260" x2="605" y2="258" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* ── KEYSTONE (if arched) ── */}
        {hasArch && (
          <ClickableRegion
          buildHref={buildHref}
            slug="keystones"
            label="Keystone"
            hovered={hoveredElement === 'keystones'}
            onHover={onHover}
            labelX={350}
            labelY={wy + 10}
          >
            <path
              d={`M 340 ${wy + 18} L 335 ${wy + 5} L 365 ${wy + 5} L 360 ${wy + 18}`}
              fill={cfg.fillColor}
              stroke={cfg.strokeColor}
              strokeWidth="2.5"
            />
          </ClickableRegion>
        )}

        {/* ── SILL ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="sills-and-aprons"
          label="Sill & Apron"
          hovered={hoveredElement === 'sills-and-aprons'}
          onHover={onHover}
          labelX={620}
          labelY={wy + wh + 15}
        >
          <rect x={wx - 15} y={wy + wh} width={ww + 30} height="12" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2.5" />
          {/* Apron */}
          <rect x={wx + 10} y={wy + wh + 12} width={ww - 20} height="20" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="1.5" />

          <line x1={wx + ww + 20} y1={wy + wh + 10} x2="605" y2={wy + wh + 12} stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* Style badge */}
        <rect x="280" y="475" width="140" height="28" rx="14" fill={cfg.strokeColor} />
        <text x="350" y="494" textAnchor="middle" className="text-[11px] fill-white font-medium">
          {style} Window
        </text>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// STAIRCASE DIAGRAM
// ═══════════════════════════════════════════════════════
function StaircaseDiagram({ style, hoveredElement, onHover, buildHref }: DiagramProps) {
  const cfg = getStyleConfig(style);
  const isTurned = style === 'Classical' || style === 'Victorian';
  const isSquare = style === 'Craftsman' || style === 'Art Deco';

  // Stair geometry
  const steps = 6;
  const stepW = 70, stepH = 50;
  const startX = 120, startY = 400;

  return (
    <div className="flex items-center justify-center p-8">
      <svg viewBox="0 0 700 520" className="w-full max-w-3xl" xmlns="http://www.w3.org/2000/svg">
        <text x="350" y="30" textAnchor="middle" className="text-sm font-display fill-gray-800 font-bold">
          {style} Stair Parts
        </text>

        {/* ── STRINGER ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="stringers"
          label="Stringer"
          hovered={hoveredElement === 'stringers'}
          onHover={onHover}
          labelX={80}
          labelY={320}
        >
          <path
            d={`M ${startX} ${startY + 30} L ${startX + steps * stepW} ${startY - steps * stepH + 30} L ${startX + steps * stepW + 15} ${startY - steps * stepH + 15} L ${startX + 15} ${startY + 15}`}
            fill={cfg.fillColor}
            stroke={cfg.strokeColor}
            strokeWidth="2"
          />
          <line x1={startX + 10} y1="320" x2="95" y2="318" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* ── TREADS & RISERS (steps) ── */}
        <g>
          {Array.from({ length: steps }).map((_, i) => {
            const sx = startX + i * stepW;
            const sy = startY - i * stepH;
            return (
              <g key={i}>
                {/* Tread */}
                <rect x={sx} y={sy - stepH} width={stepW} height="8" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="1.5" />
                {/* Riser */}
                <rect x={sx} y={sy - stepH + 8} width="8" height={stepH - 8} fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="1" />
              </g>
            );
          })}
        </g>

        {/* ── TREAD BRACKETS ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="tread-brackets"
          label="Tread Bracket"
          hovered={hoveredElement === 'tread-brackets'}
          onHover={onHover}
          labelX={80}
          labelY={380}
        >
          {Array.from({ length: steps }).map((_, i) => {
            const sx = startX + i * stepW + stepW;
            const sy = startY - i * stepH - stepH + 8;
            return (
              <path
                key={i}
                d={`M ${sx} ${sy} C ${sx + 8} ${sy + 10}, ${sx - 5} ${sy + 20}, ${sx} ${sy + stepH - 10}`}
                fill="none"
                stroke={cfg.accentColor}
                strokeWidth="1.5"
              />
            );
          })}
          <line x1={startX + stepW + 5} y1="375" x2="95" y2="378" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* ── NEWEL POST ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="newel-posts"
          label="Newel Post"
          hovered={hoveredElement === 'newel-posts'}
          onHover={onHover}
          labelX={600}
          labelY={250}
        >
          {/* Bottom newel */}
          <rect x={startX - 15} y={startY - 100} width="24" height="130" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2.5" />
          {/* Newel cap */}
          <rect x={startX - 20} y={startY - 108} width="34" height="12" rx="2" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2" />
          {/* Finial on top */}
          {isTurned && (
            <ellipse cx={startX - 3} cy={startY - 115} rx="8" ry="8" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="1.5" />
          )}

          {/* Top newel */}
          {(() => {
            const tx = startX + steps * stepW - 15;
            const ty = startY - steps * stepH - 100;
            return (
              <>
                <rect x={tx} y={ty} width="24" height="130" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2.5" />
                <rect x={tx - 5} y={ty - 8} width="34" height="12" rx="2" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2" />
                {isTurned && (
                  <ellipse cx={tx + 12} cy={ty - 15} rx="8" ry="8" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="1.5" />
                )}
              </>
            );
          })()}

          <line x1={startX + steps * stepW + 15} y1="245" x2="585" y2="248" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* ── BALUSTERS ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="balusters"
          label="Balusters"
          hovered={hoveredElement === 'balusters'}
          onHover={onHover}
          labelX={600}
          labelY={340}
        >
          {Array.from({ length: steps * 2 }).map((_, i) => {
            const bx = startX + 15 + i * (stepW / 2);
            const stepIdx = Math.floor(i / 2);
            const topY = startY - stepIdx * stepH - 90;
            const bottomY = startY - stepIdx * stepH;

            return isTurned ? (
              <g key={i}>
                <line x1={bx} y1={topY} x2={bx} y2={bottomY} stroke={cfg.strokeColor} strokeWidth="1.5" />
                {/* Turned detail */}
                <ellipse cx={bx} cy={topY + (bottomY - topY) * 0.4} rx="4" ry="8" fill="none" stroke={cfg.strokeColor} strokeWidth="1" />
                <ellipse cx={bx} cy={topY + (bottomY - topY) * 0.7} rx="3" ry="5" fill="none" stroke={cfg.strokeColor} strokeWidth="0.8" />
              </g>
            ) : (
              <rect key={i} x={bx - 3} y={topY} width="6" height={bottomY - topY} fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="1" />
            );
          })}
          <line x1={startX + steps * stepW - 20} y1="335" x2="585" y2="338" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* ── HANDRAIL ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="handrails"
          label="Handrail"
          hovered={hoveredElement === 'handrails'}
          onHover={onHover}
          labelX={600}
          labelY={170}
        >
          <line
            x1={startX - 3}
            y1={startY - 95}
            x2={startX + steps * stepW - 3}
            y2={startY - steps * stepH - 95}
            stroke={cfg.strokeColor}
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Rail profile */}
          <line
            x1={startX - 3}
            y1={startY - 98}
            x2={startX + steps * stepW - 3}
            y2={startY - steps * stepH - 98}
            stroke={cfg.accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line x1={startX + steps * stepW + 10} y1={startY - steps * stepH - 95} x2="585" y2="168" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* ── VOLUTE (at bottom of handrail) ── */}
        {isTurned && (
          <ClickableRegion
          buildHref={buildHref}
            slug="volutes-and-scrolls"
            label="Volute"
            hovered={hoveredElement === 'volutes-and-scrolls'}
            onHover={onHover}
            labelX={80}
            labelY={280}
          >
            <path
              d={`M ${startX - 3} ${startY - 95} C ${startX - 30} ${startY - 90}, ${startX - 35} ${startY - 70}, ${startX - 15} ${startY - 75} C ${startX - 5} ${startY - 78}, ${startX - 10} ${startY - 85}, ${startX - 3} ${startY - 95}`}
              fill="none"
              stroke={cfg.strokeColor}
              strokeWidth="2.5"
            />
            <line x1={startX - 25} y1={startY - 78} x2="95" y2="278" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
          </ClickableRegion>
        )}

        {/* Style badge */}
        <rect x="280" y="470" width="140" height="28" rx="14" fill={cfg.strokeColor} />
        <text x="350" y="489" textAnchor="middle" className="text-[11px] fill-white font-medium">
          {style} Staircase
        </text>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CEILING & WALL DIAGRAM
// ═══════════════════════════════════════════════════════
function CeilingWallDiagram({ style, hoveredElement, onHover, buildHref }: DiagramProps) {
  const cfg = getStyleConfig(style);

  return (
    <div className="flex items-center justify-center p-8">
      <svg viewBox="0 0 700 520" className="w-full max-w-3xl" xmlns="http://www.w3.org/2000/svg">
        <text x="350" y="30" textAnchor="middle" className="text-sm font-display fill-gray-800 font-bold">
          {style} Ceiling & Wall Elements
        </text>

        {/* Room cross-section: ceiling at top, wall below */}
        {/* Ceiling plane */}
        <rect x="80" y="50" width="540" height="160" fill="#f9f7f4" stroke={cfg.strokeColor} strokeWidth="1" />
        {/* Wall plane */}
        <rect x="80" y="210" width="540" height="280" fill="#faf8f5" stroke={cfg.strokeColor} strokeWidth="1" />

        {/* ── COFFERS ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="coffered-panels"
          label="Coffered Panel"
          hovered={hoveredElement === 'coffered-panels'}
          onHover={onHover}
          labelX={350}
          labelY={78}
        >
          {/* Grid of coffers */}
          {[0, 1, 2, 3].map((col) =>
            [0, 1].map((row) => (
              <rect
                key={`${col}-${row}`}
                x={110 + col * 125}
                y={60 + row * 65}
                width="110"
                height="55"
                fill="none"
                stroke={cfg.strokeColor}
                strokeWidth="2"
                rx="2"
              />
            ))
          )}
          {/* Inner panel detail */}
          {[0, 1, 2, 3].map((col) =>
            [0, 1].map((row) => (
              <rect
                key={`inner-${col}-${row}`}
                x={120 + col * 125}
                y={68 + row * 65}
                width="90"
                height="40"
                fill="none"
                stroke={cfg.strokeColor}
                strokeWidth="0.8"
                rx="1"
                opacity="0.5"
              />
            ))
          )}
        </ClickableRegion>

        {/* ── CEILING MEDALLION ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="ceiling-medallions"
          label="Medallion"
          hovered={hoveredElement === 'ceiling-medallions'}
          onHover={onHover}
          labelX={350}
          labelY={155}
        >
          <circle cx="350" cy="130" r="35" fill="none" stroke={cfg.strokeColor} strokeWidth="2.5" />
          <circle cx="350" cy="130" r="25" fill="none" stroke={cfg.strokeColor} strokeWidth="1.5" />
          <circle cx="350" cy="130" r="8" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="1.5" />
          {/* Ornamental rays */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={350 + Math.cos(angle) * 10}
                y1={130 + Math.sin(angle) * 10}
                x2={350 + Math.cos(angle) * 22}
                y2={130 + Math.sin(angle) * 22}
                stroke={cfg.accentColor}
                strokeWidth="1"
              />
            );
          })}
        </ClickableRegion>

        {/* ── COVE MOLDING (ceiling-wall junction) ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="soffits-and-coves"
          label="Cove / Soffit"
          hovered={hoveredElement === 'soffits-and-coves'}
          onHover={onHover}
          labelX={640}
          labelY={210}
        >
          <path
            d="M 80 210 Q 80 195, 95 195 L 605 195 Q 620 195, 620 210"
            fill="none"
            stroke={cfg.strokeColor}
            strokeWidth="2.5"
          />
          <line x1="620" y1="205" x2="640" y2="208" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* ── CROWN MOLDING ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="crown-molding"
          label="Crown Molding"
          hovered={hoveredElement === 'crown-molding'}
          onHover={onHover}
          labelX={640}
          labelY={228}
        >
          <rect x="80" y="210" width="540" height="12" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2" />
          <path d="M 80 222 L 80 215 Q 100 218, 120 215 Q 140 218, 160 215 Q 180 218, 200 215 Q 220 218, 240 215 Q 260 218, 280 215 Q 300 218, 320 215 Q 340 218, 360 215 Q 380 218, 400 215 Q 420 218, 440 215 Q 460 218, 480 215 Q 500 218, 520 215 Q 540 218, 560 215 Q 580 218, 600 215 L 620 222" fill="none" stroke={cfg.accentColor} strokeWidth="0.8" />
          <line x1="620" y1="222" x2="640" y2="226" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* ── WAINSCOTING ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="wainscoting-and-paneling"
          label="Wainscoting"
          hovered={hoveredElement === 'wainscoting-and-paneling'}
          onHover={onHover}
          labelX={640}
          labelY={400}
        >
          {/* Wainscot area (lower wall) */}
          <rect x="80" y="350" width="540" height="140" fill="none" stroke={cfg.strokeColor} strokeWidth="1.5" />
          {/* Panels */}
          {Array.from({ length: 6 }).map((_, i) => (
            <g key={i}>
              <rect
                x={95 + i * 88}
                y="365"
                width="72"
                height="110"
                fill={cfg.fillColor}
                stroke={cfg.strokeColor}
                strokeWidth="1.5"
                rx="1"
              />
              {/* Inner raised panel */}
              <rect
                x={103 + i * 88}
                y="375"
                width="56"
                height="90"
                fill="none"
                stroke={cfg.strokeColor}
                strokeWidth="0.8"
                rx="1"
              />
            </g>
          ))}
          <line x1="620" y1="400" x2="640" y2="398" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* ── DADO RAIL ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="dado-rails"
          label="Dado Rail"
          hovered={hoveredElement === 'dado-rails'}
          onHover={onHover}
          labelX={640}
          labelY={350}
        >
          <rect x="80" y="345" width="540" height="8" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2.5" />
          <line x1="620" y1="350" x2="640" y2="348" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* ── NICHE ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="niches-and-alcoves"
          label="Niche"
          hovered={hoveredElement === 'niches-and-alcoves'}
          onHover={onHover}
          labelX={350}
          labelY={310}
        >
          {/* Arched niche in upper wall */}
          <path
            d="M 310 335 L 310 260 A 40 40 0 0 1 390 260 L 390 335"
            fill="#eee9e0"
            stroke={cfg.strokeColor}
            strokeWidth="2"
          />
          {/* Shell top */}
          {(style === 'Classical' || style === 'Victorian') && (
            <g>
              {Array.from({ length: 7 }).map((_, i) => {
                const angle = (Math.PI / 6) * (i - 3);
                return (
                  <line
                    key={i}
                    x1={350}
                    y1={265}
                    x2={350 + Math.sin(angle) * 35}
                    y2={265 - Math.cos(angle) * 20}
                    stroke={cfg.accentColor}
                    strokeWidth="0.8"
                  />
                );
              })}
            </g>
          )}
        </ClickableRegion>

        {/* ── BASEBOARD ── */}
        <ClickableRegion
          buildHref={buildHref}
          slug="baseboards"
          label="Baseboard"
          hovered={hoveredElement === 'baseboards'}
          onHover={onHover}
          labelX={640}
          labelY={490}
        >
          <rect x="80" y="490" width="540" height="14" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2.5" />
          <line x1="620" y1="497" x2="640" y2="488" stroke={cfg.strokeColor} strokeWidth="0.8" strokeDasharray="3,3" />
        </ClickableRegion>

        {/* Style badge */}
        <rect x="140" y="50" width="120" height="24" rx="12" fill={cfg.strokeColor} opacity="0.8" />
        <text x="200" y="67" textAnchor="middle" className="text-[10px] fill-white font-medium">
          Ceiling
        </text>
        <rect x="140" y="222" width="120" height="24" rx="12" fill={cfg.strokeColor} opacity="0.8" />
        <text x="200" y="239" textAnchor="middle" className="text-[10px] fill-white font-medium">
          Wall Section
        </text>
      </svg>
    </div>
  );
}
