import { CategoriesManager } from '@/app/components/categories/CategoriesManager';

export default function CategoriesPage() {
  
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      <main className="grow">
        <CategoriesManager />
      </main>
    </div>
  );
}
