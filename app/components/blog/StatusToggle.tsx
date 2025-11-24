import { CheckCircle, FileEdit, List } from 'lucide-react';
interface StatusToggleProps {
  statusFilter: 'all' | 'DRAFT' | 'PUBLISHED';
  onStatusChange: (status: 'all' | 'DRAFT' | 'PUBLISHED') => void;
}
export function StatusToggle({ statusFilter, onStatusChange }: StatusToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
      <button
        onClick={() => onStatusChange('all')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
          statusFilter === 'all'
            ? 'bg-gray-900 dark:bg-slate-700 text-white shadow-md'
            : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400'
        }`}
      >
        <List className="w-4 h-4" />
        All
      </button>
      <button
        onClick={() => onStatusChange('PUBLISHED')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
          statusFilter === 'PUBLISHED'
            ? 'bg-emerald-500 dark:bg-emerald-600 text-white shadow-md'
            : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400'
        }`}
      >
        <CheckCircle className="w-4 h-4" />
        Published
      </button>
      <button
        onClick={() => onStatusChange('DRAFT')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
          statusFilter === 'DRAFT'
            ? 'bg-orange-500 dark:bg-orange-600 text-white shadow-md'
            : 'text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400'
        }`}
      >
        <FileEdit className="w-4 h-4" />
        Drafts
      </button>
    </div>
  );
}
