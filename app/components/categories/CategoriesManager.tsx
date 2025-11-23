// components/categories/CategoriesManager.tsx
'use client';
import { useState } from 'react';
import { CategoryForm } from './CategoryForm';
import { CategoryList } from './CategoryList';
import { trpc } from '@/app/_trpc/client';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/app/components/ui/ToastContainer';

export interface Category {
  id: number;
  name: string;
  description: string | null;
  postCount: number;
}

export function CategoriesManager() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { showToast } = useToast();

  // tRPC queries and mutations
  const utils = trpc.useUtils();
  const { data: categories, isLoading, error } = trpc.category.getAll.useQuery();

  const createMutation = trpc.category.create.useMutation({
    onSuccess: async () => {
      await utils.category.getAll.refetch();
      showToast('Category created successfully!', 'success');
    },
    onError: (error) => {
      showToast(error.message || 'Failed to create category', 'error');
    },
  });

  const updateMutation = trpc.category.update.useMutation({
    onSuccess: async () => {
      await utils.category.getAll.refetch();
      setEditingCategory(null);
      showToast('Category updated successfully!', 'success');
    },
    onError: (error) => {
      showToast(error.message || 'Failed to update category', 'error');
    },
  });

  const deleteMutation = trpc.category.delete.useMutation({
    onSuccess: async () => {
      await utils.category.getAll.refetch();
      await utils.post.getAll.refetch();
      showToast('Category deleted successfully!', 'success');
    },
    onError: (error) => {
      showToast(error.message || 'Failed to delete category', 'error');
    },
  });

  const handleCreate = async (name: string, description: string) => {
    await createMutation.mutateAsync({
      name,
      description: description || undefined,
    });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleUpdate = async (name: string, description: string) => {
    if (editingCategory) {
      await updateMutation.mutateAsync({
        categoryId: editingCategory.id,
        name,
        description: description || undefined,
      });
    }
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync({ categoryId: id });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 text-teal-600 dark:text-teal-400 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading categories...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Failed to load categories</h3>
          <p className="text-gray-600 dark:text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Categories</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Organize your blog posts with categories</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Form */}
        <div className="lg:col-span-1">
          <CategoryForm
            editingCategory={editingCategory}
            onSubmit={editingCategory ? handleUpdate : handleCreate}
            onCancel={handleCancelEdit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </div>

        {/* Category List */}
        <div className="lg:col-span-2">
          <CategoryList
            categories={categories || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
