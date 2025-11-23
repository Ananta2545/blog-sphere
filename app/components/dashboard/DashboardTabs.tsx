// components/dashboard/DashboardTabs.tsx
import { BarChart3, PenSquare } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface DashboardTabsProps {
  activeTab: 'analytics' | 'post-editor';
  onTabChange: (tab: 'analytics' | 'post-editor') => void;
}

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="border-b border-gray-200 dark:border-slate-700 transition-colors overflow-x-auto">
      <nav className="flex space-x-4 sm:space-x-8 min-w-max sm:min-w-0" aria-label="Dashboard tabs">
        <button
          onClick={() => onTabChange('analytics')}
          className={cn(
            'flex items-center gap-1 sm:gap-2 py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap',
            activeTab === 'analytics'
              ? 'border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600'
          )}
        >
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">Analytics</span>
          <span className="xs:hidden">Stats</span>
        </button>
        <button
          onClick={() => onTabChange('post-editor')}
          className={cn(
            'flex items-center gap-1 sm:gap-2 py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap',
            'flex items-center gap-1 sm:gap-2 py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap',
            activeTab === 'post-editor'
              ? 'border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600'
          )}
        >
          <PenSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          Editor
        </button>
      </nav>
    </div>
  )
}
