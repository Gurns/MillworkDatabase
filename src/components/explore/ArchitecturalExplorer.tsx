'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { PlateZoomViewer } from './PlateZoomViewer';
import { entablatureConfig } from './plate-configs/entablature';
import { windowDoorConfig } from './plate-configs/window-door';
import { stairPartsConfig } from './plate-configs/stair-parts';
import { ceilingWallConfig } from './plate-configs/ceiling-wall';

// ─── Types ───
type DiagramView = 'entablature' | 'column' | 'window' | 'staircase' | 'ceiling';

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
  compact?: boolean;
  filterMode?: boolean;
}

export function ArchitecturalExplorer(props: ArchitecturalExplorerProps) {
  return (
    <Suspense fallback={<div className="bg-gray-50 rounded-2xl border border-gray-200 animate-pulse" style={{ minHeight: props.compact ? 300 : 500 }} />}>
      <ArchitecturalExplorerInner {...props} />
    </Suspense>
  );
}

function ArchitecturalExplorerInner({ compact = false, filterMode = false }: ArchitecturalExplorerProps) {
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

  /** Is this view a plate-based diagram? */
  const isPlateView = activeView !== 'column';

  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-3 py-2 border-b border-gray-100">
          <h3 className="text-sm font-display font-bold text-gray-900">Architectural Elements</h3>
        </div>
        {/* Style selector — only for column SVG view */}
        {!isPlateView && (
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
        )}
        {/* View tabs */}
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
        {/* Diagram area */}
        <div className="relative bg-gray-50 overflow-hidden" style={{ minHeight: 300 }}>
          <div className="transition-opacity duration-500">
            {activeView === 'entablature' && (
              <div className="p-3">
                <PlateZoomViewer config={entablatureConfig} buildHref={buildCategoryHref} />
              </div>
            )}
            {activeView === 'column' && (
              <ColumnDiagram style={activeStyle} hoveredElement={hoveredElement} onHover={setHoveredElement} buildHref={buildCategoryHref} />
            )}
            {activeView === 'window' && (
              <div className="p-3">
                <PlateZoomViewer config={windowDoorConfig} buildHref={buildCategoryHref} />
              </div>
            )}
            {activeView === 'staircase' && (
              <div className="p-3">
                <PlateZoomViewer config={stairPartsConfig} buildHref={buildCategoryHref} />
              </div>
            )}
            {activeView === 'ceiling' && (
              <div className="p-3">
                <PlateZoomViewer config={ceilingWallConfig} buildHref={buildCategoryHref} />
              </div>
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
            Select a style to zoom in and see labeled details.
          </p>
        </div>

        {/* Style selector — only for column SVG view */}
        {!isPlateView && (
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
        )}

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
              <div className="p-4">
                <PlateZoomViewer config={entablatureConfig} buildHref={buildCategoryHref} />
              </div>
            )}
            {activeView === 'column' && (
              <ColumnDiagram style={activeStyle} hoveredElement={hoveredElement} onHover={setHoveredElement} buildHref={buildCategoryHref} />
            )}
            {activeView === 'window' && (
              <div className="p-4">
                <PlateZoomViewer config={windowDoorConfig} buildHref={buildCategoryHref} />
              </div>
            )}
            {activeView === 'staircase' && (
              <div className="p-4">
                <PlateZoomViewer config={stairPartsConfig} buildHref={buildCategoryHref} />
              </div>
            )}
            {activeView === 'ceiling' && (
              <div className="p-4">
                <PlateZoomViewer config={ceilingWallConfig} buildHref={buildCategoryHref} />
              </div>
            )}
          </div>

          {/* Legend — only for column SVG view */}
          {!isPlateView && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg px-4 py-2 text-xs text-gray-500 border border-gray-200">
              <span className="inline-block w-3 h-3 border-2 border-brand-500 rounded-sm mr-1 align-middle" />
              Click highlighted elements to browse designs
            </div>
          )}
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
// COLUMN DIAGRAM (SVG — no plate image for this one)
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
          <rect x="250" y="55" width="200" height="15" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2.5" />
          <path
            d={`M 270 70 Q 270 ${hasAcanthus ? 105 : 95}, 290 ${hasAcanthus ? 115 : 100} L 410 ${hasAcanthus ? 115 : 100} Q 430 ${hasAcanthus ? 105 : 95}, 430 70`}
            fill={cfg.fillColor}
            stroke={cfg.strokeColor}
            strokeWidth="2.5"
          />
          {hasVolutes && (
            <>
              <path d="M 270 80 C 255 75, 255 95, 270 90" fill="none" stroke={cfg.strokeColor} strokeWidth="2" />
              <path d="M 430 80 C 445 75, 445 95, 430 90" fill="none" stroke={cfg.strokeColor} strokeWidth="2" />
            </>
          )}
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
          <path
            d={`M 295 ${hasAcanthus ? 118 : 103} L 290 380 L 410 380 L 405 ${hasAcanthus ? 118 : 103}`}
            fill={cfg.fillColor}
            stroke={cfg.strokeColor}
            strokeWidth="2.5"
          />
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
          <rect x="280" y="380" width="140" height="14" rx="7" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2" />
          <path d="M 280 394 Q 285 402, 290 400 L 410 400 Q 415 402, 420 394" fill="none" stroke={cfg.strokeColor} strokeWidth="1.5" />
          <rect x="275" y="400" width="150" height="14" rx="7" fill={cfg.fillColor} stroke={cfg.strokeColor} strokeWidth="2" />
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
