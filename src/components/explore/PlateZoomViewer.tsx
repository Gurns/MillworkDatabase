'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

// ─── Types ───

export type PlateStyle = 'classical' | 'victorian' | 'craftsman' | 'gothic' | 'contemporary' | 'rustic';

export interface ClickableLabel {
  label: string;
  slug: string;
  /** Position as % within the *zoomed* style region */
  top: number;
  left: number;
  width: number;
  height: number;
}

/** Where each style lives on the full plate image */
export interface StyleZone {
  /** CSS transform-origin X (%) */
  originX: number;
  /** CSS transform-origin Y (%) */
  originY: number;
  /** Scale factor for zoom */
  scale: number;
}

export interface PlateConfig {
  /** Path to the full plate image */
  imageSrc: string;
  /** Alt text */
  alt: string;
  /** Map of style → zoom zone */
  zones: Record<PlateStyle, StyleZone>;
  /** Map of style → clickable labels */
  labels: Record<PlateStyle, ClickableLabel[]>;
}

interface PlateZoomViewerProps {
  config: PlateConfig;
  buildHref?: (slug: string) => string;
}

const STYLE_BUTTONS: { key: PlateStyle; label: string }[] = [
  { key: 'classical', label: 'Classical' },
  { key: 'victorian', label: 'Victorian' },
  { key: 'craftsman', label: 'Craftsman' },
  { key: 'gothic', label: 'Gothic' },
  { key: 'contemporary', label: 'Contemporary' },
  { key: 'rustic', label: 'Rustic' },
];

export function PlateZoomViewer({ config, buildHref }: PlateZoomViewerProps) {
  const [activeStyle, setActiveStyle] = useState<PlateStyle | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const zone = activeStyle ? config.zones[activeStyle] : null;
  const labels = activeStyle ? config.labels[activeStyle] : [];

  function getHref(slug: string): string {
    return buildHref ? buildHref(slug) : `/categories/${slug}`;
  }

  const handleStyleClick = useCallback((style: PlateStyle) => {
    setHoveredLabel(null);
    if (activeStyle === style) {
      // Zoom out
      setIsTransitioning(true);
      setActiveStyle(null);
      setTimeout(() => setIsTransitioning(false), 500);
    } else {
      setIsTransitioning(true);
      setActiveStyle(style);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  }, [activeStyle]);

  const handleZoomOut = useCallback(() => {
    setHoveredLabel(null);
    setIsTransitioning(true);
    setActiveStyle(null);
    setTimeout(() => setIsTransitioning(false), 500);
  }, []);

  return (
    <div>
      {/* Style selector pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {STYLE_BUTTONS.map((s) => (
          <button
            key={s.key}
            onClick={() => handleStyleClick(s.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              activeStyle === s.key
                ? 'bg-wood-800 text-white shadow-md scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s.label}
          </button>
        ))}
        {activeStyle && (
          <button
            onClick={handleZoomOut}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 transition-all duration-200"
          >
            ← Show All
          </button>
        )}
      </div>

      {/* Image with zoom transform */}
      <div className="relative select-none rounded-lg overflow-hidden border border-gray-200 bg-[#e8edf4]">
        <div
          className="relative w-full"
          style={{
            transformOrigin: zone
              ? `${zone.originX}% ${zone.originY}%`
              : '50% 50%',
            transform: zone ? `scale(${zone.scale})` : 'scale(1)',
            transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1), transform-origin 0.45s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <img
            src={config.imageSrc}
            alt={config.alt}
            className="w-full block"
            draggable={false}
          />

          {/* Clickable label overlays — only visible when zoomed in */}
          {activeStyle && !isTransitioning && labels.map((item, i) => {
            const isHovered = hoveredLabel === `${activeStyle}-${i}`;
            const hoverKey = `${activeStyle}-${i}`;

            // Labels are in plate-absolute % coordinates. Since they're inside
            // the transformed container, the CSS zoom automatically positions them correctly.
            return (
              <Link
                key={hoverKey}
                href={getHref(item.slug)}
                scroll={false}
                className="absolute block cursor-pointer z-10"
                style={{
                  top: `${item.top}%`,
                  left: `${item.left}%`,
                  width: `${item.width}%`,
                  height: `${item.height}%`,
                }}
                onMouseEnter={() => setHoveredLabel(hoverKey)}
                onMouseLeave={() => setHoveredLabel(null)}
              >
                {/* Hover highlight */}
                <div
                  className={`absolute inset-0 rounded-sm transition-all duration-200 ${
                    isHovered
                      ? 'bg-amber-400/20 ring-1 ring-amber-500/60'
                      : ''
                  }`}
                />

                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 pointer-events-none whitespace-nowrap">
                    <div className="bg-gray-900 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-lg">
                      {item.label} →
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Caption */}
      <p className="text-[10px] text-gray-400 mt-1.5 text-center">
        {activeStyle
          ? 'Hover over labels to highlight · Click to browse · Click style again or "Show All" to zoom out'
          : 'Click a style above to zoom in and explore labeled elements'}
      </p>
    </div>
  );
}
