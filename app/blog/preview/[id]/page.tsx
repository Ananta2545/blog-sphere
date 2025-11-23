// app/blog/preview/[id]/page.tsx
import { BlogPreview } from '@/app/components/blog/BlogPreview';

export default async function BlogPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors">
      {/* <Navbar /> */}
      <main className="grow">
        <BlogPreview postId={id} />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
