'use client';
import { useState, useEffect } from 'react';
import { Save, X, Loader2 } from 'lucide-react';
import { Category } from './CategoriesManager';
interface CategoryFormProps {
  onSubmit: (name: string, description: string) => void;
  onCancel?: () => void;
  editingCategory?: Category | null;
  isLoading?: boolean;
}
export function CategoryForm({ onSubmit, onCancel, editingCategory, isLoading }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setDescription(editingCategory.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [editingCategory]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), description.trim());
      if (!editingCategory) {
        setName('');
        setDescription('');
      }
    }
  };
  const handleCancel = () => {
    setName('');
    setDescription('');
    if (onCancel) {
      onCancel();
    }
  };
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 sticky top-20 transition-colors">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {editingCategory ? 'Edit Category' : 'New Category'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {}
        <div>
          <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name
          </label>
          <input
            id="category-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Technology, Travel"
            className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-colors"
            required
          />
        </div>
        {}
        <div>
          <label htmlFor="category-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="category-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this category..."
            rows={4}
            className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent resize-none transition-colors"
            required
          />
        </div>
        {}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 dark:bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors duration-300 shadow-lg shadow-teal-500/20 dark:shadow-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {editingCategory ? 'Update' : 'Create'}
          </button>
          {editingCategory && onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
