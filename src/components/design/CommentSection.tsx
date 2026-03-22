'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  replies?: Comment[];
}

interface CommentSectionProps {
  designId: string;
}

export function CommentSection({ designId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [designId]);

  async function fetchComments() {
    try {
      const res = await fetch(`/api/designs/${designId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.data || []);
      }
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  }

  async function submitComment(content: string, parentId?: string) {
    if (!content.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/designs/${designId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          parent_comment_id: parentId,
        }),
      });

      if (res.ok) {
        setNewComment('');
        setReplyText('');
        setReplyingTo(null);
        await fetchComments();
      }
    } catch {
      // Handle error
    } finally {
      setSubmitting(false);
    }
  }

  function timeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      {/* New comment form */}
      {user ? (
        <div className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts, ask questions, or give feedback..."
            rows={3}
            className="input-field mb-2"
          />
          <button
            onClick={() => submitComment(newComment)}
            disabled={submitting || !newComment.trim()}
            className="btn-primary text-sm"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
          <p className="text-sm text-gray-600">
            <Link href={`/login?redirect=/designs/${designId}`} className="text-brand-600 font-medium hover:underline">
              Sign in
            </Link>{' '}
            to leave a comment.
          </p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id}>
              {/* Main comment */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-medium shrink-0">
                  {comment.author.display_name?.[0] || comment.author.username[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/${comment.author.username}`}
                      className="text-sm font-medium text-gray-900 hover:text-brand-600"
                    >
                      {comment.author.display_name || comment.author.username}
                    </Link>
                    <span className="text-xs text-gray-400">{timeAgo(comment.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  {user && (
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="text-xs text-gray-500 hover:text-brand-600 mt-1"
                    >
                      Reply
                    </button>
                  )}

                  {/* Reply form */}
                  {replyingTo === comment.id && (
                    <div className="mt-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        rows={2}
                        className="input-field text-sm mb-1"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => submitComment(replyText, comment.id)}
                          disabled={submitting || !replyText.trim()}
                          className="btn-primary text-xs py-1 px-3"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => { setReplyingTo(null); setReplyText(''); }}
                          className="btn-ghost text-xs py-1 px-3"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-11 mt-3 space-y-3 pl-4 border-l-2 border-gray-100">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-[10px] font-medium shrink-0">
                        {reply.author.display_name?.[0] || reply.author.username[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <Link href={`/${reply.author.username}`} className="text-xs font-medium text-gray-900 hover:text-brand-600">
                            {reply.author.display_name || reply.author.username}
                          </Link>
                          <span className="text-xs text-gray-400">{timeAgo(reply.created_at)}</span>
                        </div>
                        <p className="text-sm text-gray-700">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
