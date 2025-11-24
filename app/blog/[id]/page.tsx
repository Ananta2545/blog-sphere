import { BlogPostView } from '@/app/components/blog/BlogPostView';
export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors">
      <main className="grow">
        <BlogPostView postId={id} />
      </main>
    </div>
  );
}
