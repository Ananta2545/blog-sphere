'use client';
import { CategoryCard } from './CategoryCard';
import { Category } from './CategoriesManager';
import { Plus } from 'lucide-react';
interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
  onAddCategory: () => void;
  showForm: boolean;
}
export function CategoryList({ categories, onEdit, onDelete, onAddCategory, showForm }: CategoryListProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">All Categories</h2>
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full">
            {categories.length}
          </span>
        </div>
        {!showForm && (
          <button
            onClick={onAddCategory}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        )}
      </div>
      {Array.isArray(categories) && categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No categories yet. Create your first category!</p>
        </div>
      )}
    </div>
  );
}
