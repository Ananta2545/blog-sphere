import { BlogList } from '@/app/components/blog/BlogList';

export default function BlogPage() {
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors">
      {}
      <main className="grow">
        <BlogList />
      </main>
      {}
    </div>
  );
}
