'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ARCHITECTURAL_STYLES } from '@/lib/utils/constants';

// ─── House SVG illustrations per style ───
// Each house is drawn in a 140×160 viewBox with consistent ground line

interface HouseProps {
  style: string;
  slug: string;
  hovered: boolean;
  onHover: (slug: string | null) => void;
}

function getSlug(style: string) {
  return style.toLowerCase().replace(/[\s&]+/g, '-').replace(/['']/g, '');
}

// ─── Color palettes per style ───
function getHouseColors(slug: string) {
  const palettes: Record<string, { body: string; roof: string; trim: string; door: string; accent: string }> = {
    craftsman:           { body: '#c9a96e', roof: '#5c4033', trim: '#f5f0e6', door: '#6b3a2a', accent: '#8b7355' },
    colonial:            { body: '#c4453a', roof: '#3d3d3d', trim: '#f5f5f5', door: '#1a3a5c', accent: '#f5f5f5' },
    victorian:           { body: '#7a5c8a', roof: '#4a3050', trim: '#f0e0c0', door: '#3a2050', accent: '#d4a574' },
    'art-deco':          { body: '#f5f0e0', roof: '#2a2a3a', trim: '#c5a55a', door: '#2a2a3a', accent: '#c5a55a' },
    georgian:            { body: '#b85c4a', roof: '#3d3d3d', trim: '#f5f5f5', door: '#1a1a3a', accent: '#f5f5f5' },
    federal:             { body: '#d4a574', roof: '#3d3d3d', trim: '#f5f5f5', door: '#2a4a2a', accent: '#f5f5f5' },
    'greek-revival':     { body: '#f5f5f0', roof: '#3d3d3d', trim: '#e8e0d0', door: '#1a3a1a', accent: '#d0c0a0' },
    'gothic-revival':    { body: '#8a8a80', roof: '#4a4a4a', trim: '#d0c8b8', door: '#4a2020', accent: '#c0b8a0' },
    'queen-anne':        { body: '#c06060', roof: '#4a3050', trim: '#f0d870', door: '#2a4a5a', accent: '#70a070' },
    tudor:               { body: '#f0e0c0', roof: '#5c4033', trim: '#3a2a1a', door: '#5c3020', accent: '#3a2a1a' },
    mission:             { body: '#e8d8c0', roof: '#b85c3a', trim: '#f0e8d8', door: '#5c3a2a', accent: '#b85c3a' },
    prairie:             { body: '#c9a96e', roof: '#5c4a3a', trim: '#e8d8b8', door: '#5c4033', accent: '#8b7355' },
    'mid-century-modern':{ body: '#f5f0e0', roof: '#4a5a4a', trim: '#d0d0c0', door: '#c06030', accent: '#4a7a8a' },
    contemporary:        { body: '#e0e0e0', roof: '#3a3a3a', trim: '#f0f0f0', door: '#c06030', accent: '#4a7a8a' },
    rustic:              { body: '#8b6914', roof: '#5c4033', trim: '#a08050', door: '#5c3a2a', accent: '#6b5020' },
    traditional:         { body: '#b8a080', roof: '#5c4a4a', trim: '#f5f0e8', door: '#3a3a5c', accent: '#f5f0e8' },
  };
  return palettes[slug] || palettes.traditional;
}

function HouseSVG({ style, slug, hovered, onHover }: HouseProps) {
  const c = getHouseColors(slug);

  // Each house type is a small SVG drawing
  return (
    <Link href={`/styles/${slug}`}>
      <g
        className="cursor-pointer"
        onMouseEnter={() => onHover(slug)}
        onMouseLeave={() => onHover(null)}
      >
        {/* Ground / lawn */}
        <rect x="0" y="138" width="140" height="22" fill="#7cac5c" rx="2" />
        <rect x="0" y="145" width="140" height="15" fill="#6a9a4a" rx="2" />

        {/* Sidewalk */}
        <rect x="55" y="138" width="30" height="22" fill="#d4cdc0" />

        {/* House body */}
        {slug === 'craftsman' && <CraftsmanHouse c={c} />}
        {slug === 'colonial' && <ColonialHouse c={c} />}
        {slug === 'victorian' && <VictorianHouse c={c} />}
        {slug === 'art-deco' && <ArtDecoHouse c={c} />}
        {slug === 'georgian' && <GeorgianHouse c={c} />}
        {slug === 'federal' && <FederalHouse c={c} />}
        {slug === 'greek-revival' && <GreekRevivalHouse c={c} />}
        {slug === 'gothic-revival' && <GothicRevivalHouse c={c} />}
        {slug === 'queen-anne' && <QueenAnneHouse c={c} />}
        {slug === 'tudor' && <TudorHouse c={c} />}
        {slug === 'mission' && <MissionHouse c={c} />}
        {slug === 'prairie' && <PrairieHouse c={c} />}
        {slug === 'mid-century-modern' && <MidCenturyHouse c={c} />}
        {slug === 'contemporary' && <ContemporaryHouse c={c} />}
        {slug === 'rustic' && <RusticHouse c={c} />}
        {slug === 'traditional' && <TraditionalHouse c={c} />}

        {/* Label */}
        <rect
          x="10" y="148" width="120" height="16" rx="3"
          fill={hovered ? '#44403c' : 'white'}
          stroke="#a0978a"
          strokeWidth="0.5"
          opacity={hovered ? 1 : 0.9}
        />
        <text
          x="70" y="159"
          textAnchor="middle"
          className="text-[8px] font-semibold pointer-events-none"
          fill={hovered ? 'white' : '#44403c'}
        >
          {style}
        </text>
      </g>
    </Link>
  );
}

// ─── Individual house shapes ───
type C = { body: string; roof: string; trim: string; door: string; accent: string };

function CraftsmanHouse({ c }: { c: C }) {
  return (
    <g>
      {/* Low-pitched roof with wide overhang */}
      <polygon points="5,65 70,35 135,65" fill={c.roof} stroke="#3a2a1a" strokeWidth="1" />
      {/* Tapered columns on porch */}
      <rect x="20" y="65" width="100" height="73" fill={c.body} stroke="#5c4a3a" strokeWidth="0.8" />
      <rect x="15" y="95" width="15" height="43" fill={c.trim} stroke="#5c4a3a" strokeWidth="0.5" />
      <rect x="110" y="95" width="15" height="43" fill={c.trim} stroke="#5c4a3a" strokeWidth="0.5" />
      {/* Porch roof */}
      <rect x="10" y="92" width="120" height="4" fill={c.roof} />
      {/* Windows */}
      <rect x="30" y="74" width="18" height="14" fill="#a8c8e8" stroke={c.trim} strokeWidth="1" />
      <rect x="92" y="74" width="18" height="14" fill="#a8c8e8" stroke={c.trim} strokeWidth="1" />
      {/* Door */}
      <rect x="58" y="105" width="24" height="33" rx="1" fill={c.door} stroke="#3a2a1a" strokeWidth="0.8" />
      {/* Stone base */}
      <rect x="20" y="130" width="100" height="8" fill="#a09888" stroke="#887868" strokeWidth="0.5" />
    </g>
  );
}

function ColonialHouse({ c }: { c: C }) {
  return (
    <g>
      {/* Gable roof */}
      <polygon points="15,55 70,25 125,55" fill={c.roof} stroke="#2a2a2a" strokeWidth="1" />
      {/* Body - 2 story */}
      <rect x="20" y="55" width="100" height="83" fill={c.body} stroke="#8a3a2a" strokeWidth="0.8" />
      {/* Symmetrical windows */}
      <rect x="28" y="62" width="14" height="16" fill="#a8c8e8" stroke={c.trim} strokeWidth="1" />
      <rect x="52" y="62" width="14" height="16" fill="#a8c8e8" stroke={c.trim} strokeWidth="1" />
      <rect x="76" y="62" width="14" height="16" fill="#a8c8e8" stroke={c.trim} strokeWidth="1" />
      <rect x="100" y="62" width="14" height="16" fill="#a8c8e8" stroke={c.trim} strokeWidth="1" />
      {/* Lower windows */}
      <rect x="28" y="100" width="14" height="16" fill="#a8c8e8" stroke={c.trim} strokeWidth="1" />
      <rect x="100" y="100" width="14" height="16" fill="#a8c8e8" stroke={c.trim} strokeWidth="1" />
      {/* Center door */}
      <rect x="58" y="100" width="24" height="38" rx="1" fill={c.door} stroke={c.trim} strokeWidth="1" />
      {/* Pediment over door */}
      <polygon points="55,100 70,92 85,100" fill={c.trim} stroke="#aaa" strokeWidth="0.5" />
      {/* Shutters */}
      {[28, 100].map((x) => (
        <g key={x}>
          <rect x={x - 4} y="62" width="3" height="16" fill={c.door} />
          <rect x={x + 15} y="62" width="3" height="16" fill={c.door} />
        </g>
      ))}
      {/* Chimney */}
      <rect x="100" y="20" width="12" height="35" fill={c.body} stroke="#8a3a2a" strokeWidth="0.5" />
    </g>
  );
}

function VictorianHouse({ c }: { c: C }) {
  return (
    <g>
      {/* Main steep roof */}
      <polygon points="10,60 50,15 90,60" fill={c.roof} stroke="#2a1a2a" strokeWidth="1" />
      {/* Tower */}
      <polygon points="85,50 110,10 135,50" fill={c.roof} stroke="#2a1a2a" strokeWidth="1" />
      <rect x="88" y="50" width="44" height="88" fill={c.body} stroke="#4a3050" strokeWidth="0.8" />
      {/* Main body */}
      <rect x="15" y="60" width="80" height="78" fill={c.body} stroke="#4a3050" strokeWidth="0.8" />
      {/* Gingerbread trim */}
      <path d="M 10 60 Q 25 56, 30 60 Q 40 56, 50 60 Q 60 56, 70 60 Q 80 56, 90 60" fill="none" stroke={c.accent} strokeWidth="1.5" />
      {/* Ornate windows */}
      <rect x="25" y="70" width="12" height="18" rx="6" fill="#a8c8e8" stroke={c.trim} strokeWidth="1" />
      <rect x="55" y="70" width="12" height="18" rx="6" fill="#a8c8e8" stroke={c.trim} strokeWidth="1" />
      <rect x="100" y="58" width="14" height="20" rx="7" fill="#a8c8e8" stroke={c.trim} strokeWidth="1" />
      {/* Porch */}
      <rect x="15" y="110" width="75" height="4" fill={c.accent} />
      <rect x="22" y="114" width="4" height="24" fill={c.trim} />
      <rect x="80" y="114" width="4" height="24" fill={c.trim} />
      {/* Door */}
      <rect x="45" y="114" width="20" height="24" rx="1" fill={c.door} stroke={c.trim} strokeWidth="0.8" />
      {/* Spindle work */}
      {[30, 38, 46, 54, 62, 70].map((x) => (
        <line key={x} x1={x} y1="110" x2={x} y2="114" stroke={c.trim} strokeWidth="0.8" />
      ))}
    </g>
  );
}

function ArtDecoHouse({ c }: { c: C }) {
  return (
    <g>
      {/* Flat roof with stepped parapet */}
      <rect x="20" y="40" width="100" height="98" fill={c.body} stroke={c.accent} strokeWidth="1" />
      <rect x="40" y="32" width="60" height="8" fill={c.body} stroke={c.accent} strokeWidth="0.8" />
      <rect x="55" y="24" width="30" height="8" fill={c.body} stroke={c.accent} strokeWidth="0.8" />
      {/* Geometric ornament */}
      <line x1="70" y1="24" x2="70" y2="40" stroke={c.accent} strokeWidth="2" />
      <circle cx="70" cy="36" r="3" fill="none" stroke={c.accent} strokeWidth="1" />
      {/* Geometric windows */}
      <rect x="30" y="55" width="22" height="30" fill="#a8c8e8" stroke={c.accent} strokeWidth="1" />
      <rect x="88" y="55" width="22" height="30" fill="#a8c8e8" stroke={c.accent} strokeWidth="1" />
      {/* Vertical window bars */}
      <line x1="37" y1="55" x2="37" y2="85" stroke={c.accent} strokeWidth="0.5" />
      <line x1="44" y1="55" x2="44" y2="85" stroke={c.accent} strokeWidth="0.5" />
      <line x1="95" y1="55" x2="95" y2="85" stroke={c.accent} strokeWidth="0.5" />
      <line x1="102" y1="55" x2="102" y2="85" stroke={c.accent} strokeWidth="0.5" />
      {/* Zigzag band */}
      <path d="M 20 94 L 28 88 L 36 94 L 44 88 L 52 94 L 60 88 L 68 94 L 76 88 L 84 94 L 92 88 L 100 94 L 108 88 L 120 94" fill="none" stroke={c.accent} strokeWidth="1.2" />
      {/* Door */}
      <rect x="56" y="100" width="28" height="38" rx="1" fill={c.door} stroke={c.accent} strokeWidth="1" />
      <rect x="58" y="102" width="24" height="10" rx="5" fill="#a8c8e8" stroke={c.accent} strokeWidth="0.5" />
    </g>
  );
}

function GeorgianHouse({ c }: { c: C }) {
  return (
    <g>
      <polygon points="15,55 70,28 125,55" fill={c.roof} stroke="#2a2a2a" strokeWidth="1" />
      <rect x="20" y="55" width="100" height="83" fill={c.body} stroke="#8a4a3a" strokeWidth="0.8" />
      {/* Quoins */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}><rect x="20" y={58 + i * 16} width="6" height="12" fill={c.trim} strokeWidth="0.3" stroke="#bbb" /><rect x="114" y={58 + i * 16} width="6" height="12" fill={c.trim} strokeWidth="0.3" stroke="#bbb" /></g>
      ))}
      {/* 5 symmetrical windows */}
      {[30, 50, 90, 110].map((x) => (
        <rect key={x} x={x - 5} y="62" width="14" height="16" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      ))}
      {[30, 50, 90, 110].map((x) => (
        <rect key={`l${x}`} x={x - 5} y="100" width="14" height="16" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      ))}
      <rect x="60" y="100" width="20" height="38" rx="10" fill={c.door} stroke={c.trim} strokeWidth="1" />
      <rect x="55" y="92" width="30" height="4" fill={c.trim} />
      <rect x="105" y="20" width="10" height="35" fill={c.body} stroke="#8a4a3a" strokeWidth="0.5" />
    </g>
  );
}

function FederalHouse({ c }: { c: C }) {
  return (
    <g>
      <polygon points="15,58 70,30 125,58" fill={c.roof} stroke="#2a2a2a" strokeWidth="1" />
      <rect x="20" y="58" width="100" height="80" fill={c.body} stroke="#a08060" strokeWidth="0.8" />
      {/* Fan window in gable */}
      <path d="M 58 58 A 12 12 0 0 1 82 58" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (Math.PI / 5) * (i + 0.5);
        return <line key={i} x1={70} y1={58} x2={70 + Math.cos(angle - Math.PI) * 11} y2={58 - Math.sin(angle) * 11} stroke={c.trim} strokeWidth="0.5" />;
      })}
      <rect x="30" y="68" width="12" height="16" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      <rect x="96" y="68" width="12" height="16" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      <rect x="30" y="102" width="12" height="16" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      <rect x="96" y="102" width="12" height="16" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      <rect x="58" y="102" width="22" height="36" rx="1" fill={c.door} stroke={c.trim} strokeWidth="1" />
      {/* Sidelights */}
      <rect x="54" y="104" width="4" height="30" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.5" />
      <rect x="80" y="104" width="4" height="30" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.5" />
    </g>
  );
}

function GreekRevivalHouse({ c }: { c: C }) {
  return (
    <g>
      {/* Pediment */}
      <polygon points="10,60 70,25 130,60" fill={c.roof} stroke="#4a4a4a" strokeWidth="1" />
      {/* Entablature */}
      <rect x="10" y="60" width="120" height="8" fill={c.trim} stroke="#aaa" strokeWidth="0.5" />
      <rect x="15" y="68" width="110" height="70" fill={c.body} stroke="#ccc" strokeWidth="0.8" />
      {/* Columns */}
      {[22, 48, 90, 116].map((x) => (
        <rect key={x} x={x - 3} y="68" width="6" height="70" fill={c.trim} stroke="#bbb" strokeWidth="0.5" />
      ))}
      {/* Windows between columns */}
      <rect x="32" y="80" width="14" height="20" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      <rect x="98" y="80" width="14" height="20" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      {/* Grand door */}
      <rect x="58" y="80" width="24" height="58" rx="1" fill={c.door} stroke={c.trim} strokeWidth="1" />
      <path d="M 58 80 A 12 12 0 0 1 82 80" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
    </g>
  );
}

function GothicRevivalHouse({ c }: { c: C }) {
  return (
    <g>
      {/* Steep pointed roof */}
      <polygon points="10,65 70,10 130,65" fill={c.roof} stroke="#3a3a3a" strokeWidth="1" />
      <rect x="20" y="65" width="100" height="73" fill={c.body} stroke="#5a5a50" strokeWidth="0.8" />
      {/* Pointed arch window in gable */}
      <path d="M 60 65 L 60 45 A 10 10 0 0 1 80 45 L 80 65" fill="#a8c8e8" stroke={c.trim} strokeWidth="1" />
      {/* Pointed arch windows */}
      <path d="M 30 80 L 30 95 L 44 95 L 44 80 A 7 7 0 0 0 30 80" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      <path d="M 96 80 L 96 95 L 110 95 L 110 80 A 7 7 0 0 0 96 80" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      {/* Pointed door */}
      <path d="M 58 138 L 58 108 A 12 12 0 0 1 82 108 L 82 138" fill={c.door} stroke={c.trim} strokeWidth="1" />
      {/* Decorative bargeboard */}
      <line x1="10" y1="65" x2="70" y2="10" stroke={c.accent} strokeWidth="2" />
      <line x1="130" y1="65" x2="70" y2="10" stroke={c.accent} strokeWidth="2" />
      {/* Finial */}
      <line x1="70" y1="10" x2="70" y2="4" stroke={c.trim} strokeWidth="1.5" />
      <circle cx="70" cy="3" r="2" fill={c.trim} />
    </g>
  );
}

function QueenAnneHouse({ c }: { c: C }) {
  return (
    <g>
      {/* Asymmetric — main body + turret */}
      <polygon points="5,70 55,35 105,70" fill={c.roof} stroke="#3a2030" strokeWidth="1" />
      <rect x="10" y="70" width="95" height="68" fill={c.body} stroke="#7a4040" strokeWidth="0.8" />
      {/* Turret */}
      <polygon points="95,55 115,20 135,55" fill={c.roof} stroke="#3a2030" strokeWidth="1" />
      <rect x="98" y="55" width="34" height="83" fill={c.accent} stroke="#4a6a4a" strokeWidth="0.8" />
      {/* Decorative shingles on turret */}
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M 98 ${60 + i * 8} Q 115 ${56 + i * 8}, 132 ${60 + i * 8}`} fill="none" stroke="#5a8a5a" strokeWidth="0.5" />
      ))}
      {/* Wraparound porch */}
      <rect x="5" y="108" width="100" height="4" fill={c.accent} />
      {[12, 30, 50, 70, 90].map((x) => (
        <rect key={x} x={x} y="112" width="3" height="26" fill={c.trim} />
      ))}
      {/* Windows */}
      <rect x="22" y="78" width="14" height="16" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      <rect x="60" y="78" width="14" height="16" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      <rect x="106" y="62" width="12" height="16" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      {/* Door */}
      <rect x="40" y="112" width="18" height="26" fill={c.door} stroke={c.trim} strokeWidth="0.8" />
    </g>
  );
}

function TudorHouse({ c }: { c: C }) {
  return (
    <g>
      {/* Steep cross-gabled roof */}
      <polygon points="5,65 70,20 135,65" fill={c.roof} stroke="#3a2a1a" strokeWidth="1" />
      <rect x="15" y="65" width="110" height="73" fill={c.body} stroke="#a08860" strokeWidth="0.8" />
      {/* Half-timber framing */}
      <line x1="70" y1="65" x2="70" y2="138" stroke={c.accent} strokeWidth="2" />
      <line x1="15" y1="95" x2="125" y2="95" stroke={c.accent} strokeWidth="2" />
      <line x1="15" y1="80" x2="70" y2="80" stroke={c.accent} strokeWidth="1.5" />
      <line x1="70" y1="80" x2="125" y2="80" stroke={c.accent} strokeWidth="1.5" />
      {/* Diagonal braces */}
      <line x1="15" y1="65" x2="42" y2="95" stroke={c.accent} strokeWidth="1" />
      <line x1="70" y1="65" x2="42" y2="95" stroke={c.accent} strokeWidth="1" />
      {/* Windows */}
      <rect x="24" y="100" width="18" height="14" fill="#a8c8e8" stroke={c.accent} strokeWidth="0.8" />
      <rect x="100" y="100" width="18" height="14" fill="#a8c8e8" stroke={c.accent} strokeWidth="0.8" />
      {/* Arched door */}
      <path d="M 58 138 L 58 108 A 12 12 0 0 1 82 108 L 82 138" fill={c.door} stroke={c.accent} strokeWidth="1" />
      {/* Chimney */}
      <rect x="108" y="15" width="14" height="50" fill="#8a7060" stroke="#6a5040" strokeWidth="0.5" />
    </g>
  );
}

function MissionHouse({ c }: { c: C }) {
  return (
    <g>
      {/* Tile roof with gentle slope */}
      <polygon points="10,60 70,38 130,60" fill={c.roof} stroke="#8a4a2a" strokeWidth="1" />
      <rect x="20" y="60" width="100" height="78" fill={c.body} stroke="#c0a880" strokeWidth="0.8" />
      {/* Mission parapet */}
      <path d="M 50 60 L 50 48 A 20 20 0 0 1 90 48 L 90 60" fill={c.body} stroke="#c0a880" strokeWidth="1" />
      {/* Arched windows */}
      <path d="M 30 80 L 30 100 L 44 100 L 44 80 A 7 7 0 0 0 30 80" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      <path d="M 96 80 L 96 100 L 110 100 L 110 80 A 7 7 0 0 0 96 80" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      {/* Arched door */}
      <path d="M 58 138 L 58 108 A 12 12 0 0 1 82 108 L 82 138" fill={c.door} stroke={c.trim} strokeWidth="1" />
      {/* Tile roof detail */}
      <rect x="15" y="56" width="110" height="5" fill={c.roof} rx="2" />
    </g>
  );
}

function PrairieHouse({ c }: { c: C }) {
  return (
    <g>
      {/* Very low-pitch hip roof — wide horizontal */}
      <polygon points="0,70 70,52 140,70" fill={c.roof} stroke="#4a3a2a" strokeWidth="1" />
      {/* Wide horizontal body */}
      <rect x="10" y="70" width="120" height="68" fill={c.body} stroke="#8a7050" strokeWidth="0.8" />
      {/* Horizontal band */}
      <rect x="10" y="95" width="120" height="3" fill={c.accent} />
      {/* Wide ribbon windows */}
      <rect x="18" y="76" width="40" height="14" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      <rect x="82" y="76" width="40" height="14" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      <rect x="18" y="102" width="30" height="12" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      <rect x="92" y="102" width="30" height="12" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      {/* Mullions */}
      {[28, 38, 48].map((x) => <line key={x} x1={x} y1="76" x2={x} y2="90" stroke={c.trim} strokeWidth="0.4" />)}
      {/* Door — recessed */}
      <rect x="58" y="102" width="24" height="36" fill={c.door} stroke={c.trim} strokeWidth="0.8" />
      {/* Planter */}
      <rect x="56" y="130" width="28" height="6" fill="#6a8a4a" rx="1" />
    </g>
  );
}

function MidCenturyHouse({ c }: { c: C }) {
  return (
    <g>
      {/* Flat-ish butterfly / low-slope roof */}
      <polygon points="0,60 70,50 140,60" fill={c.roof} stroke="#3a4a3a" strokeWidth="1" />
      <rect x="10" y="60" width="120" height="78" fill={c.body} stroke="#b0a890" strokeWidth="0.8" />
      {/* Large picture window */}
      <rect x="18" y="68" width="50" height="35" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      {/* Vertical mullion */}
      <line x1="43" y1="68" x2="43" y2="103" stroke={c.trim} strokeWidth="0.6" />
      {/* Small windows */}
      <rect x="80" y="70" width="35" height="14" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      {/* Bold colored door */}
      <rect x="80" y="100" width="22" height="38" fill={c.door} stroke={c.accent} strokeWidth="1.5" />
      {/* Carport suggestion */}
      <rect x="108" y="105" width="25" height="3" fill={c.roof} />
      <rect x="130" y="105" width="3" height="33" fill={c.trim} />
    </g>
  );
}

function ContemporaryHouse({ c }: { c: C }) {
  return (
    <g>
      {/* Flat roof, cubic forms */}
      <rect x="15" y="45" width="55" height="93" fill={c.body} stroke="#5a5a5a" strokeWidth="0.8" />
      <rect x="70" y="60" width="55" height="78" fill="#c0c0c0" stroke="#5a5a5a" strokeWidth="0.8" />
      {/* Large glass walls */}
      <rect x="22" y="55" width="40" height="40" fill="#a8d8e8" stroke="#888" strokeWidth="0.8" />
      <line x1="42" y1="55" x2="42" y2="95" stroke="#888" strokeWidth="0.5" />
      {/* Upper window on right */}
      <rect x="78" y="68" width="38" height="18" fill="#a8d8e8" stroke="#888" strokeWidth="0.8" />
      {/* Accent panel */}
      <rect x="78" y="95" width="38" height="20" fill={c.door} opacity="0.3" />
      {/* Door */}
      <rect x="78" y="104" width="18" height="34" fill={c.door} stroke="#888" strokeWidth="0.8" />
      {/* Cantilevered element */}
      <rect x="10" y="45" width="62" height="3" fill="#5a5a5a" />
    </g>
  );
}

function RusticHouse({ c }: { c: C }) {
  return (
    <g>
      {/* Log cabin style with steep roof */}
      <polygon points="5,65 70,25 135,65" fill={c.roof} stroke="#4a3020" strokeWidth="1" />
      <rect x="15" y="65" width="110" height="73" fill={c.body} stroke="#6a4a20" strokeWidth="0.8" />
      {/* Log lines */}
      {[70, 78, 86, 94, 102, 110, 118, 126].map((y) => (
        <line key={y} x1="15" y1={y} x2="125" y2={y} stroke="#7a5a30" strokeWidth="0.8" />
      ))}
      {/* Stone chimney */}
      <rect x="98" y="15" width="18" height="50" fill="#8a8070" stroke="#6a6050" strokeWidth="0.5" />
      {[20, 28, 36, 44, 52].map((y) => (
        <line key={y} x1="98" y1={y} x2="116" y2={y} stroke="#6a6050" strokeWidth="0.3" />
      ))}
      {/* Windows */}
      <rect x="28" y="82" width="16" height="14" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      <rect x="96" y="82" width="16" height="14" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      {/* Plank door */}
      <rect x="58" y="100" width="24" height="38" fill={c.door} stroke="#4a2a1a" strokeWidth="1" />
      <line x1="64" y1="100" x2="64" y2="138" stroke="#4a2a1a" strokeWidth="0.5" />
      <line x1="70" y1="100" x2="70" y2="138" stroke="#4a2a1a" strokeWidth="0.5" />
      <line x1="76" y1="100" x2="76" y2="138" stroke="#4a2a1a" strokeWidth="0.5" />
    </g>
  );
}

function TraditionalHouse({ c }: { c: C }) {
  return (
    <g>
      <polygon points="10,60 70,28 130,60" fill={c.roof} stroke="#4a3a3a" strokeWidth="1" />
      <rect x="18" y="60" width="104" height="78" fill={c.body} stroke="#9a8a7a" strokeWidth="0.8" />
      {/* Dormer */}
      <polygon points="50,60 70,45 90,60" fill={c.roof} stroke="#4a3a3a" strokeWidth="0.8" />
      <rect x="60" y="50" width="20" height="10" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.5" />
      {/* Windows */}
      <rect x="28" y="70" width="16" height="18" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      <rect x="96" y="70" width="16" height="18" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      <rect x="28" y="104" width="16" height="16" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      <rect x="96" y="104" width="16" height="16" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      {/* Shutters */}
      {[28, 96].map((x) => (
        <g key={x}><rect x={x - 4} y="70" width="3" height="18" fill={c.door} /><rect x={x + 17} y="70" width="3" height="18" fill={c.door} /></g>
      ))}
      {/* Center door with arch */}
      <rect x="58" y="100" width="24" height="38" rx="1" fill={c.door} stroke={c.trim} strokeWidth="1" />
      <path d="M 58 100 A 12 12 0 0 1 82 100" fill="#a8c8e8" stroke={c.trim} strokeWidth="0.8" />
      {/* Chimney */}
      <rect x="102" y="22" width="10" height="38" fill="#9a8a7a" stroke="#7a6a5a" strokeWidth="0.5" />
    </g>
  );
}

// ─── Main Street Scene Component ───
export function StyleStreetScene() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);

  const houseWidth = 150; // px per house slot
  const totalWidth = ARCHITECTURAL_STYLES.length * houseWidth;

  return (
    <div className="relative">
      {/* Scroll buttons */}
      <button
        onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur rounded-full w-10 h-10 flex items-center justify-center shadow-lg border border-gray-200 hover:bg-white transition-colors"
        aria-label="Scroll left"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur rounded-full w-10 h-10 flex items-center justify-center shadow-lg border border-gray-200 hover:bg-white transition-colors"
        aria-label="Scroll right"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Scrollable street */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2"
        style={{ scrollbarWidth: 'thin' }}
      >
        {/* Sky gradient background */}
        <div
          className="relative"
          style={{
            width: totalWidth,
            minWidth: '100%',
            background: 'linear-gradient(to bottom, #c8e0f8 0%, #e8f0f8 50%, #f0f4f0 75%, #7cac5c 85%, #6a9a4a 100%)',
            borderRadius: '12px',
          }}
        >
          <svg
            width={totalWidth}
            height="180"
            viewBox={`0 0 ${totalWidth} 180`}
            xmlns="http://www.w3.org/2000/svg"
            className="block"
          >
            {/* Road at bottom */}
            <rect x="0" y="158" width={totalWidth} height="22" fill="#6a6a6a" />
            <line x1="0" y1="168" x2={totalWidth} y2="168" stroke="#e8e080" strokeWidth="1.5" strokeDasharray="20,15" />

            {/* Trees between some houses */}
            {[2, 5, 8, 11, 14].map((i) => {
              const tx = i * houseWidth + houseWidth / 2;
              return (
                <g key={`tree-${i}`} opacity="0.4">
                  <rect x={tx - 2} y="110" width="4" height="35" fill="#6a5030" />
                  <circle cx={tx} cy="100" r="15" fill="#5a9a3a" />
                </g>
              );
            })}

            {/* Houses */}
            {ARCHITECTURAL_STYLES.map((style, i) => {
              const slug = getSlug(style);
              const isHovered = hoveredStyle === slug;
              const xOffset = i * houseWidth + 5;

              return (
                <g
                  key={slug}
                  transform={`translate(${xOffset}, ${isHovered ? -6 : 0})`}
                  className="transition-transform duration-200"
                  style={{
                    transform: `translate(${xOffset}px, ${isHovered ? -6 : 0}px) scale(${isHovered ? 1.05 : 1})`,
                    transformOrigin: `${xOffset + 70}px 90px`,
                    transition: 'transform 0.2s ease-out',
                  }}
                >
                  <HouseSVG
                    style={style}
                    slug={slug}
                    hovered={isHovered}
                    onHover={setHoveredStyle}
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
