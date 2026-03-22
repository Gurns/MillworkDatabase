'use client';

import { useRef, useState, type ReactNode } from 'react';
import {
  ProfileSliceIcon,
  InstalledPhotoIcon,
  ThreeDModelIcon,
  ThreeDScanIcon,
} from './MillworkFileIcons';

export type TileType = 'profile' | 'photo' | 'model' | 'scanmesh';

interface UploadTileProps {
  type: TileType;
  /** Already-uploaded files info — triggers the "filled" state */
  files?: { id: string; name: string; url?: string; thumbnailUrl?: string; size?: number }[];
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
  /** Callback to remove a specific file by id */
  onRemove?: (fileId: string) => void;
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
  scanmesh: {
    label: 'Scan / Mesh',
    description: '3D scanned mesh or tessellated mesh for CNC or rendering',
    formats: 'STL, OBJ, PLY',
  },
};

function getIcon(type: TileType, className: string): ReactNode {
  switch (type) {
    case 'profile': return <ProfileSliceIcon className={className} />;
    case 'photo': return <InstalledPhotoIcon className={className} />;
    case 'model': return <ThreeDModelIcon className={className} />;
    case 'scanmesh': return <ThreeDScanIcon className={className} />;
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
  files = [],
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

  const hasFiles = files.length > 0;
  const isImage = type === 'profile' || type === 'photo';

  function handleClick() {
    if (!uploading) inputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        onFileSelect(fileList[i]);
      }
    }
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const fileList = e.dataTransfer.files;
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        onFileSelect(fileList[i]);
      }
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  return (
    <div
      className={`
        relative rounded-xl border-2 border-dashed transition-all cursor-pointer
        ${dragOver ? 'border-blue-400 bg-blue-50/50' : hasFiles ? 'border-gray-200 bg-white' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/30'}
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
        multiple
        className="hidden"
        disabled={uploading}
      />

      {/* Required badge */}
      {required && !hasFiles && (
        <span className="absolute top-2 right-2 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          Required*
        </span>
      )}

      {hasFiles ? (
        /* ─── Filled state ─── */
        <div className="p-3">
          <div className="flex items-start gap-3">
            {/* Shrunken icon in corner */}
            <div className="w-10 h-10 shrink-0 opacity-60">
              {getIcon(type, 'w-10 h-10')}
            </div>

            <div className="flex-1 min-w-0">
              {/* File count badge */}
              <div className="mb-2">
                <span className="inline-block text-xs font-semibold text-white bg-blue-600 px-2 py-0.5 rounded-full">
                  {files.length} {files.length === 1 ? 'file' : 'files'}
                </span>
              </div>

              {/* List of files */}
              <div className="space-y-2">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2 border border-gray-100">
                    <div className="flex-1 min-w-0">
                      {isImage && file.url ? (
                        <div>
                          <div className="aspect-[4/3] rounded-md overflow-hidden bg-gray-100 mb-1">
                            <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                          </div>
                          <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
                          {file.size && <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>}
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
                          {file.size && <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>}
                        </div>
                      )}
                    </div>

                    {/* Remove button for this file */}
                    {onRemove && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onRemove(file.id); }}
                        className="ml-2 w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors shrink-0"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-xs font-medium text-gray-700 truncate mt-2">{config.label}</p>
            </div>
          </div>
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
