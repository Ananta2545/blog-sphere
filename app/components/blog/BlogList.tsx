'use client';
import { Search, FileText, Loader2, AlertCircle, Plus } from 'lucide-react';
import { BlogCard } from './BlogCard';
import { BlogFilters } from './BlogFilters';
import { StatusToggle } from './StatusToggle';
import { DeleteConfirmationModal } from '@/app/components/ui/DeleteConfirmationModal';
import { trpc } from '@/app/_trpc/client';
import { useFilterState } from '@/app/store/useAppStore';
import { useMemo, useState, useEffect } from 'react';
import { useToast } from '@/app/components/ui/ToastContainer';
import { useRouter } from 'next/navigation';

export function BlogList() {
  const router = useRouter();
  const { showToast } = useToast();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{ id: number; title: string } | null>(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const {
    searchQuery,
    selectedCategorySlug,
    statusFilter,
    currentPage,
    setSearchQuery,
    setSelectedCategorySlug,
    setStatusFilter,
    setCurrentPage,
  } = useFilterState();
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  const { data: categoriesData, isLoading: categoriesLoading } = trpc.category.getAll.useQuery();
  const queryInput: {
    page: number;
    limit: number;
    status: 'DRAFT' | 'PUBLISHED' | 'ALL';
    categorySlug?: string;
    searchQuery?: string;
  } = {
    page: currentPage,
    limit: 9,
    status: (statusFilter === 'all' ? 'ALL' : statusFilter) as 'DRAFT' | 'PUBLISHED' | 'ALL',
  };

  if (selectedCategorySlug) queryInput.categorySlug = selectedCategorySlug;

  if (debouncedSearchQuery) queryInput.searchQuery = debouncedSearchQuery;

  const { data: postsData, isLoading: postsLoading, error: postsError} = trpc.post.getAll.useQuery(queryInput);
  const utils = trpc.useUtils();

  const deletePostMutation = trpc.post.delete.useMutation({
    onSuccess: () => {
      showToast('Post deleted successfully!', 'success');
      setDeleteModalOpen(false);
      setPostToDelete(null);
      utils.post.getAll.invalidate();
      utils.post.getStats.invalidate();
    },
    onError: (error) => {
      showToast(`Failed to delete post: ${error.message}`, 'error');
    },
  });

  const categories = useMemo(() => {
    if (!categoriesData || !Array.isArray(categoriesData)) return ['All'];
    return ['All', ...categoriesData.map(cat => cat.name)];
  }, [categoriesData]);
  const categoryNameToSlug = useMemo(() => {
    if (!categoriesData || !Array.isArray(categoriesData)) return {};
    return Object.fromEntries(
      categoriesData.map(cat => [cat.name, cat.slug])
    );
  }, [categoriesData]);

  const handleCategoryChange = (categoryName: string) => {
    if (categoryName === 'All') {
      setSelectedCategorySlug(null);
    } else {
      setSelectedCategorySlug(categoryNameToSlug[categoryName] || null);
    }
  };

  const handleDelete = (id: number) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      setPostToDelete({ id, title: post.title });
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    await deletePostMutation.mutateAsync({ postId: postToDelete.id });
  };

  const selectedCategoryName = useMemo(() => {
    if (!selectedCategorySlug) return 'All';
    const category = categoriesData?.find(cat => cat.slug === selectedCategorySlug);
    return category?.name || 'All';
  }, [selectedCategorySlug, categoriesData]);

  const posts = postsData?.posts || [];

  const totalPosts = postsData?.pagination?.total || 0;
  
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FileText className="w-10 h-10 text-teal-600 dark:text-teal-400" />
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100">Blog Posts</h1>
          <FileText className="w-10 h-10 text-teal-600 dark:text-teal-400" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Explore our collection of articles and stories</p>
      </div>
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent bg-white dark:bg-slate-800 shadow-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => router.push('/dashboard?tab=post-editor')}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Create Post</span>
          </button>
          <BlogFilters
            categories={categories}
            selectedCategory={selectedCategoryName}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        <StatusToggle
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </div>
      {(postsLoading || categoriesLoading) ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 text-teal-600 dark:text-teal-400 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
        </div>
      ) : postsError ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Failed to load posts</h3>
          <p className="text-gray-600 dark:text-gray-400">{postsError.message}</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Found <span className="font-semibold text-teal-600 dark:text-teal-400">{totalPosts}</span> post{totalPosts !== 1 ? 's' : ''}
            </p>
          </div>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = post.content || '';
                const plainText = tempDiv.textContent || tempDiv.innerText || '';
                const excerpt = plainText.length > 150 
                  ? plainText.substring(0, 150) + '...' 
                  : plainText;
                return (
                  <BlogCard 
                    key={post.id} 
                    blog={{
                      id: post.id,
                      title: post.title,
                      excerpt: excerpt,
                      categories: post.categories?.map(cat => cat.name) || [],
                      date: new Date(post.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      }),
                      readTime: `${post.readingTimeMins || 0} min read`,
                      status: post.status?.toLowerCase() as 'published' | 'draft',
                    }} 
                    onDelete={handleDelete} 
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-12 border border-gray-100 dark:border-slate-700 transition-colors">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No posts found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          )}
        </>
      )}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPostToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Post"
        message={`Are you sure you want to delete "${postToDelete?.title}"? This action cannot be undone.`}
        isDeleting={deletePostMutation.isPending}
      />
    </div>
  );
}
