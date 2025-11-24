'use client';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag, Edit, Send, AlertCircle, Loader2 } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ui/ToastContainer';
import { useState } from 'react';
interface BlogPreviewProps {
  postId: string;
}
export function BlogPreview({ postId }: BlogPreviewProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);
  const { data: post, isLoading, error } = trpc.post.getByIdIncludingDrafts.useQuery({ 
    postId: parseInt(postId) 
  });
  const utils = trpc.useUtils();
  const updateMutation = trpc.post.update.useMutation({
    onSuccess: () => {
      utils.post.getAll.invalidate();
      utils.post.getById.invalidate({ postId: parseInt(postId) });
      utils.post.getByIdIncludingDrafts.invalidate({ postId: parseInt(postId) });
      utils.post.getStats.invalidate();
    },
  });
  const handlePublish = async () => {
    if (!post) return;
    setIsPublishing(true);
    try {
      await updateMutation.mutateAsync({
        postId: parseInt(postId),
        title: post.title!,
        content: post.content!,
        status: 'PUBLISHED',
        categoryIds: post.categories?.map(cat => cat.id) || [],
      });
      showToast('Post published successfully!', 'success');
      setTimeout(() => {
        router.push(`/blog/${postId}`);
      }, 1000);
    } catch (error: unknown) {
      console.error('Publish error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to publish post';
      showToast(errorMessage, 'error');
    } finally {
      setIsPublishing(false);
    }
  };
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading preview...</p>
        </div>
      </div>
    );
  }
  if (error || !post) {
    return (
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Preview Not Available</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {error?.message || 'Unable to load preview.'}
          </p>
          <Link
            href="/dashboard?tab=post-editor"
            className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </Link>
        </div>
      </div>
    );
  }
  const isDraft = post.status === 'DRAFT';
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {}
      <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-4 mb-8 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-blue-900 dark:text-blue-100 font-semibold">Preview Mode</p>
            <p className="text-blue-700 dark:text-blue-300 text-sm">This is how your post will appear to readers</p>
          </div>
        </div>
        <Link
          href={`/dashboard?tab=editor&postId=${postId}`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Link>
      </div>
      {}
      <Link
        href="/dashboard?tab=post-editor"
        className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Editor
      </Link>
      {}
      <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="p-8 sm:p-12">
          {}
          {isDraft && (
            <div className="inline-block bg-orange-500 dark:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
              DRAFT - NOT PUBLISHED
            </div>
          )}
          {}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.categories?.map((category) => (
              <span
                key={category.id}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700"
              >
                <Tag className="w-4 h-4" />
                {category.name}
              </span>
            ))}
          </div>
          {}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {post.title}
          </h1>
          {}
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{post.readingTimeMins || 0} min read</span>
            </div>
          </div>
          {}
          <div
            className="prose prose-lg max-w-none dark:prose-invert
              prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-headings:font-bold
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
              prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
              prose-ul:my-6 prose-ul:space-y-2
              prose-li:text-gray-700 dark:prose-li:text-gray-300
              prose-blockquote:border-l-4 prose-blockquote:border-teal-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
      {}
      <div className="mt-8 flex gap-4 justify-center">
        <Link
          href={`/dashboard?tab=post-editor&postId=${postId}`}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-300"
        >
          <Edit className="w-5 h-5" />
          Continue Editing
        </Link>
        {isDraft && (
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-teal-600 dark:bg-teal-700 text-white rounded-xl font-medium hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Publish Now
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
