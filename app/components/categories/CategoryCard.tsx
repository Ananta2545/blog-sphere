// components/categories/CategoryCard.tsx
'use client';
import { useState } from 'react';
import { Folder, Edit, Trash2 } from 'lucide-react';
import { Category } from './CategoriesManager';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(category.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 border border-gray-200 dark:border-slate-600 hover:border-teal-300 dark:hover:border-teal-500 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 dark:bg-teal-500 rounded-lg flex items-center justify-center shadow-lg dark:shadow-teal-500/30">
            <Folder className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{category.name}</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-600 px-2 py-1 rounded-full border border-gray-200 dark:border-slate-500">
              {category.postCount}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{category.description}</p>

      {/* Actions */}
      {!showDeleteConfirm ? (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onEdit(category)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-slate-500 hover:border-teal-500 dark:hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300 text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-600 text-red-600 dark:text-red-400 rounded-lg border border-gray-200 dark:border-slate-500 hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300 text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-center text-red-600 dark:text-red-400 font-medium">
            Delete this category?
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDelete}
              className="py-2 px-3 bg-red-600 dark:bg-red-500 text-white rounded-lg font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-300 text-sm"
            >
              Yes
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="py-2 px-3 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors duration-300 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
