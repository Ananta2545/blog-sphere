// components/dashboard/PostsManagementTab.tsx
'use client';
import Link from 'next/link';
import { Edit, Eye, Trash2, FileText, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';
import { useToast } from '../ui/ToastContainer';
import { DeleteConfirmationModal } from '../ui/DeleteConfirmationModal';
import { useState } from 'react';

export function PostsManagementTab() {
  const { showToast } = useToast();
  const [statusFilter, setStatusFilter] = useState<'all' | 'DRAFT' | 'PUBLISHED'>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{ id: number; title: string } | null>(null);
  
  const { data: postsData, isLoading, refetch } = trpc.post.getAll.useQuery({
    page: 1,
    limit: 50,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const deleteMutation = trpc.post.delete.useMutation({
    onSuccess: () => {
      showToast('Post deleted successfully!', 'success');
      setDeleteModalOpen(false);
      setPostToDelete(null);
      refetch();
    },
    onError: (error) => {
      showToast(`Failed to delete post: ${error.message}`, 'error');
    },
  });

  const handleDelete = (postId: number, title: string) => {
    setPostToDelete({ id: postId, title });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    await deleteMutation.mutateAsync({ postId: postToDelete.id });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-900/50 transition-colors p-12">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-teal-600 dark:text-teal-400 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
        </div>
      </div>
    );
  }

  const posts = postsData?.posts || [];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-900/50 transition-colors">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-slate-700 px-6 py-4 transition-colors">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Manage Posts
          </h2>
          <Link
            href="/dashboard?tab=post-editor"
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-lg transition-colors font-medium"
          >
            <FileText className="w-4 h-4" />
            Create New Post
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700 px-6 transition-colors">
        <div className="flex gap-4">
          <button
            onClick={() => setStatusFilter('all')}
            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              statusFilter === 'all'
                ? 'border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            All Posts ({postsData?.pagination?.total || 0})
          </button>
          <button
            onClick={() => setStatusFilter('PUBLISHED')}
            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              statusFilter === 'PUBLISHED'
                ? 'border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <CheckCircle className="w-4 h-4 inline mr-1" />
            Published
          </button>
          <button
            onClick={() => setStatusFilter('DRAFT')}
            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              statusFilter === 'DRAFT'
                ? 'border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-1" />
            Drafts
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="p-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No posts found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
              {statusFilter === 'DRAFT' ? 'You have no draft posts yet.' : 'Start creating your first post!'}
            </p>
            <Link
              href="/dashboard?tab=post-editor"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium"
            >
              <FileText className="w-5 h-5" />
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {post.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.status === 'PUBLISHED'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        }`}
                      >
                        {post.status === 'PUBLISHED' ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Published
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Draft
                          </>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span>{post.readingTime} min read</span>
                      {post.categories && post.categories.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{post.categories.map((cat: { id: number; name: string }) => cat.name).join(', ')}</span>
                        </>
                      )}
                    </div>
                    
                    <div
                      className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2"
                      dangerouslySetInnerHTML={{ 
                        __html: post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/dashboard?tab=post-editor&postId=${post.id}`}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    
                    {post.status === 'PUBLISHED' ? (
                      <Link
                        href={`/blog/${post.id}`}
                        target="_blank"
                        className="p-2 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg transition-colors"
                        title="View Post"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    ) : (
                      <Link
                        href={`/blog/preview/${post.id}`}
                        target="_blank"
                        className="p-2 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg transition-colors"
                        title="Preview Draft"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    )}
                    
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPostToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Post"
        message={`Are you sure you want to delete "${postToDelete?.title}"? This action cannot be undone.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
