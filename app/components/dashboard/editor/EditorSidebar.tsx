import { Folder, Calendar, Clock } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}

interface EditorSidebarProps {
  categories: Category[];
  selectedCategoryIds: number[];
  onCategoryChange: (categoryIds: number[]) => void;
  status: 'DRAFT' | 'PUBLISHED';
  onStatusChange: (status: 'DRAFT' | 'PUBLISHED') => void;
  readingTimeMins: number;
  onReadingTimeChange: (mins: number) => void;
}

export function EditorSidebar({
  categories,
  selectedCategoryIds,
  onCategoryChange,
  status,
  onStatusChange,
  readingTimeMins,
  onReadingTimeChange,
}: EditorSidebarProps) {
  const toggleCategory = (categoryId: number) => {
    if (selectedCategoryIds.includes(categoryId)) {
      onCategoryChange(selectedCategoryIds.filter(id => id !== categoryId));
    } else {
      onCategoryChange([...selectedCategoryIds, categoryId]);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Status</h3>
        </div>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as 'DRAFT' | 'PUBLISHED')}
          className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-colors"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>
      <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Reading Time</h3>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="999"
            value={readingTimeMins}
            onChange={(e) => onReadingTimeChange(Math.max(1, Math.min(999, parseInt(e.target.value) || 1)))}
            className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-colors"
            placeholder="Enter minutes"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">min</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Estimated time to read this post
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <Folder className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Categories</h3>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {!Array.isArray(categories) || categories.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No categories available</p>
          ) : (
            categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-600 rounded cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="w-4 h-4 text-teal-600 border-gray-300 dark:border-slate-500 rounded focus:ring-teal-500 dark:focus:ring-teal-400"
                />
                <span className="text-sm text-gray-900 dark:text-gray-100">{category.name}</span>
                <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                  ({category.postCount})
                </span>
              </label>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
