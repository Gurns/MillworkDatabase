'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatFileSize } from '@/lib/utils/file-validation';
import {
  ThreeDModelIcon,
  ThreeDScanIcon,
  TessellatedMeshIcon,
} from '@/components/upload/MillworkFileIcons';

interface DesignFile {
  id: string;
  file_name: string;
  file_type: string;
  file_size_bytes: number;
}

interface DesignFileListProps {
  files: DesignFile[];
  designId: string;
  isLoggedIn: boolean;
  isFree: boolean;
}

function getFileIcon(fileType: string) {
  // Map file types to the most appropriate icon
  switch (fileType) {
    case 'step':
    case 'f3d':
    case 'fusion360':
      return <ThreeDModelIcon className="w-8 h-8" />;
    case 'ply':
      return <ThreeDScanIcon className="w-8 h-8" />;
    case 'stl':
    case 'obj':
    default:
      return <TessellatedMeshIcon className="w-8 h-8" />;
  }
}

export function DesignFileList({ files, designId, isLoggedIn, isFree }: DesignFileListProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState<string | null>(null);

  async function handleDownload(file: DesignFile) {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/designs/${designId}`);
      return;
    }

    if (!isFree) {
      return;
    }

    setDownloading(file.id);
    try {
      const res = await fetch(`/api/designs/${designId}/files/${encodeURIComponent(file.file_name)}/download`);
      if (res.ok) {
        const { url } = await res.json();
        window.open(url, '_blank');
      }
    } catch {
      // Handle error
    } finally {
      setDownloading(null);
    }
  }

  const fileTypeLabels: Record<string, string> = {
    stl: 'STL Mesh',
    step: 'STEP Model',
    obj: 'OBJ Mesh',
    ply: 'PLY Scan',
    f3d: 'Fusion 360',
    fusion360: 'Fusion 360',
    other: 'Other',
  };

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <div key={file.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="shrink-0">
            {getFileIcon(file.file_type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {fileTypeLabels[file.file_type] || file.file_type.toUpperCase()}
            </p>
            <p className="text-xs text-gray-500 truncate">{file.file_name} · {formatFileSize(file.file_size_bytes)}</p>
          </div>
          <button
            onClick={() => handleDownload(file)}
            disabled={downloading === file.id || (!isFree && true)}
            className="btn-primary text-xs py-1.5 px-3 shrink-0"
          >
            {downloading === file.id ? (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                ...
              </span>
            ) : !isFree ? (
              'Purchase'
            ) : (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </span>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
