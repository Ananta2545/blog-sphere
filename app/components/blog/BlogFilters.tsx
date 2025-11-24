import { Filter } from 'lucide-react';

interface BlogFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function BlogFilters({ categories, selectedCategory, onCategoryChange }: BlogFiltersProps) {
  
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filter by category:</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm cursor-pointer font-medium transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-gray-900 dark:bg-teal-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
