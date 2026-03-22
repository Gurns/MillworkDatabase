'use client';

import { useRef, useState, type ReactNode } from 'react';
import {
  ProfileSliceIcon,
  InstalledPhotoIcon,
  ThreeDModelIcon,
  ThreeDScanIcon,
  TessellatedMeshIcon,
} from './MillworkFileIcons';

export type TileType = 'profile' | 'photo' | 'model' | 'scan' | 'mesh';

interface UploadTileProps {
  type: TileType;
  /** Already-uploaded file info — triggers the "filled" state */
  file?: { name: string; url?: string; thumbnailUrl?: string; size?: number };
  /** Accept attribute for the file input */
  accept: string;
  /** Whether this tile is required (used for visual indicator) */
  required?: boolean;
  /** Max file size in bytes */
  maxSize?: number;
  /** True while uploading */
  uploading?: boolean;
  /** Callback with the selected file */
  onFileSelect: (file: File) => void;
  /** Callback to remove the current file */
  onRemove?: () => void;
}

const TILE_CONFIG: Record<TileType, { label: string; description: string; formats: string }> = {
  profile: {
    label: '2D Profile',
    description: 'Cross-section slice drawing of the molding profile',
    formats: 'JPEG, PNG, WebP',
  },
  photo: {
    label: 'Installed Photo',
    description: 'Photo of the millwork installed in a real setting',
    formats: 'JPEG, PNG, WebP',
  },
  model: {
    label: '3D Model',
    description: 'Parametric or solid model file of a short section',
    formats: 'STEP, STL, OBJ, F3D, F3Z',
  },
  scan: {
    label: '3D Scan',
    description: 'Raw 3D scan mesh from a structured-light or LiDAR scanner',
    formats: 'STL, OBJ, PLY',
  },
  mesh: {
    label: 'Tessellated Mesh',
    description: 'Triangulated mesh export for CNC or rendering',
    formats: 'STL, OBJ',
  },
};

function getIcon(type: TileType, className: string): ReactNode {
  switch (type) {
    case 'profile': return <ProfileSliceIcon className={className} />;
    case 'photo': return <InstalledPhotoIcon className={className} />;
    case 'model': return <ThreeDModelIcon className={className} />;
    case 'scan': return <ThreeDScanIcon className={className} />;
    case 'mesh': return <TessellatedMeshIcon className={className} />;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export function UploadTile({
  type,
  file,
  accept,
  required = false,
  maxSize,
  uploading = false,
  onFileSelect,
  onRemove,
}: UploadTileProps) {
  const config = TILE_CONFIG[type];
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const hasFile = !!file;
  const isImage = type === 'profile' || type === 'photo';

  function handleClick() {
    if (!uploading) inputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) onFileSelect(f);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFileSelect(f);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  return (
    <div
      className={`
        relative rounded-xl border-2 border-dashed transition-all cursor-pointer
        ${dragOver ? 'border-blue-400 bg-blue-50/50' : hasFile ? 'border-gray-200 bg-white' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/30'}
        ${uploading ? 'opacity-60 pointer-events-none' : ''}
      `}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(false)}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={uploading}
      />

      {/* Required badge */}
      {required && !hasFile && (
        <span className="absolute top-2 right-2 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          Required*
        </span>
      )}

      {hasFile ? (
        /* ─── Filled state ─── */
        <div className="p-3">
          <div className="flex items-start gap-3">
            {/* Shrunken icon in corner */}
            <div className="w-10 h-10 shrink-0 opacity-60">
              {getIcon(type, 'w-10 h-10')}
            </div>

            <div className="flex-1 min-w-0">
              {/* Image preview or file name */}
              {isImage && file.url ? (
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 mb-2">
                  <img src={file.url} alt={config.label} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center mb-2">
                  <div className="text-center px-2">
                    <svg className="w-8 h-8 mx-auto text-blue-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-gray-500 font-medium truncate">{file.name}</p>
                    {file.size && <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>}
                  </div>
                </div>
              )}

              <p className="text-xs font-medium text-gray-700 truncate">{config.label}</p>
              {isImage && file.name && <p className="text-xs text-gray-400 truncate">{file.name}</p>}
            </div>
          </div>

          {/* Remove button */}
          {onRemove && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        /* ─── Empty state ─── */
        <div className="p-4 flex flex-col items-center text-center">
          {/* Large icon */}
          <div className="w-20 h-20 mb-3">
            {getIcon(type, 'w-20 h-20')}
          </div>

          <p className="text-sm font-semibold text-gray-800 mb-0.5">{config.label}</p>
          <p className="text-xs text-gray-500 mb-2 leading-snug">{config.description}</p>

          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Drop or click to upload
          </div>

          <p className="text-xs text-gray-400 mt-1">{config.formats}</p>

          {uploading && (
            <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Uploading...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
