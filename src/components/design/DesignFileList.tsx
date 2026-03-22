'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatFileSize } from '@/lib/utils/file-validation';

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

export function DesignFileList({ files, designId, isLoggedIn, isFree }: DesignFileListProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState<string | null>(null);

  async function handleDownload(file: DesignFile) {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/designs/${designId}`);
      return;
    }

    if (!isFree) {
      // Paid design — check purchase (marketplace coming later)
      return;
    }

    setDownloading(file.id);
    try {
      const res = await fetch(`/api/designs/${designId}/files/${file.file_name}/download`);
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
    stl: 'STL',
    step: 'STEP',
    obj: 'OBJ',
    ply: 'PLY (Raw Scan)',
    f3d: 'Fusion 360',
    fusion360: 'Fusion 360',
    other: 'Other',
  };

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div key={file.id} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {fileTypeLabels[file.file_type] || file.file_type.toUpperCase()}
            </p>
            <p className="text-xs text-gray-500">{formatFileSize(file.file_size_bytes)}</p>
          </div>
          <button
            onClick={() => handleDownload(file)}
            disabled={downloading === file.id || (!isFree && true)}
            className="btn-primary text-xs py-1.5 px-3"
          >
            {downloading === file.id ? (
              'Downloading...'
            ) : !isFree ? (
              'Purchase to Download'
            ) : (
              'Download'
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
