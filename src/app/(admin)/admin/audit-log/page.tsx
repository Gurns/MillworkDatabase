'use client';

import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface AuditLog {
  id: string;
  admin_username: string;
  action: string;
  target_type: string;
  target_id: string;
  details: Record<string, any>;
  created_at: string;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pageSize = 20;

  useEffect(() => {
    fetchLogs();
  }, [currentPage]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });
      const res = await fetch(`/api/admin/audit-log?${params}`);
      if (!res.ok) throw new Error('Failed to fetch audit log');
      const data = await res.json();
      setLogs(data.entries);
      setTotalPages(Math.ceil(data.total / pageSize));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('ban') || action.includes('delete') || action.includes('archive')) {
      return 'text-red-600 bg-red-50';
    }
    if (action.includes('create') || action.includes('publish')) {
      return 'text-green-600 bg-green-50';
    }
    if (action.includes('update') || action.includes('set')) {
      return 'text-blue-600 bg-blue-50';
    }
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Audit Log</h1>
        <p className="text-gray-600 mt-2">Track all administrative actions and changes.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Timeline */}
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p>No audit logs found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {logs.map((log, index) => (
              <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${getActionColor(log.action).split(' ')[0]}`} />
                    {index !== logs.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-300 my-2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {log.admin_username}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                          <span className="text-xs text-gray-600">
                            on {log.target_type}
                          </span>
                          {log.target_id && (
                            <span className="text-xs text-gray-500">
                              #{log.target_id.substring(0, 8)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-600 whitespace-nowrap">
                          {new Date(log.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {/* Expandable details */}
                    {Object.keys(log.details).length > 0 && (
                      <div className="mt-3">
                        <button
                          onClick={() =>
                            setExpandedId(expandedId === log.id ? null : log.id)
                          }
                          className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                        >
                          {expandedId === log.id ? 'Hide' : 'Show'} Details
                        </button>
                        {expandedId === log.id && (
                          <pre className="mt-2 p-3 bg-gray-50 rounded border border-gray-200 text-xs overflow-auto text-gray-700">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
