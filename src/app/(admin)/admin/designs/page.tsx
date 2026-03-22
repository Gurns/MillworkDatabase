'use client';

import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Design {
  id: string;
  title: string;
  creator_name: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  downloads: number;
  favorites: number;
  created_at: string;
  thumbnail_url?: string;
}

type StatusFilterType = 'all' | 'published' | 'draft' | 'archived';

export default function DesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const pageSize = 10;

  useEffect(() => {
    fetchDesigns();
  }, [search, statusFilter, currentPage]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(search && { search }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      });
      const res = await fetch(`/api/admin/designs?${params}`);
      if (!res.ok) throw new Error('Failed to fetch designs');
      const data = await res.json();
      setDesigns(data.designs);
      setTotalPages(Math.ceil(data.total / pageSize));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSetStatus = async (designId: string, newStatus: string) => {
    try {
      setActionLoading(designId);
      const res = await fetch(`/api/admin/designs/${designId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      await fetchDesigns();
      setOpenDropdown(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (designId: string) => {
    if (!confirm('Archive this design? It will no longer be visible to users.')) return;
    try {
      setActionLoading(designId);
      const res = await fetch(`/api/admin/designs/${designId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete design');
      await fetchDesigns();
      setOpenDropdown(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleView = (designId: string) => {
    window.open(`/designs/${designId}`, '_blank');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Design Management</h1>
        <p className="text-gray-600 mt-2">Manage designs, status, and content visibility.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by title or creator..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as StatusFilterType);
                setCurrentPage(1);
              }}
              className="input-field w-full"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <LoadingSpinner />
            </div>
          ) : designs.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No designs found.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Design
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Favorites
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {designs.map((design) => (
                  <tr key={design.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-200 flex-shrink-0 overflow-hidden">
                          {design.thumbnail_url ? (
                            <img
                              src={design.thumbnail_url}
                              alt={design.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300" />
                          )}
                        </div>
                        <button
                          onClick={() => handleView(design.id)}
                          className="text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline"
                        >
                          {design.title}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {design.creator_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          design.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : design.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {design.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {design.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {design.downloads.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {design.favorites.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(design.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenDropdown(openDropdown === design.id ? null : design.id)
                          }
                          className="text-gray-600 hover:text-gray-900"
                          disabled={actionLoading === design.id}
                        >
                          {actionLoading === design.id ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                          ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.5 1.5H9.5V3h1V1.5zM4 10.5V9.5H2v1h2zm14-1v1h2v-1h-2zM13.657 4.343L12.93 5.07l.707.707.728-.728zM5.07 12.93L4.343 13.657l.707.707.728-.728zM14.142 14.142l-.707-.707-.728.728.707.707.728-.728zM5.778 5.778L5.05 5.05 4.343 5.757l.728.728zM10 7a3 3 0 100 6 3 3 0 000-6z" />
                            </svg>
                          )}
                        </button>
                        {openDropdown === design.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <div className="p-1">
                              <button
                                onClick={() => handleView(design.id)}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                              >
                                View Design
                              </button>
                              <div className="border-t border-gray-200 my-1" />
                              <div className="px-3 py-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Edit Status
                              </div>
                              {['published', 'draft', 'archived'].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleSetStatus(design.id, status)}
                                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                >
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                              ))}
                              <div className="border-t border-gray-200 my-1" />
                              <button
                                onClick={() => handleDelete(design.id)}
                                className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded transition-colors"
                              >
                                Archive
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
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
