// components/blog/BlogPostView.tsx
'use client';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag, Edit, Loader2, Eye } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';

interface BlogPostViewProps {
  postId: string;
}

export function BlogPostView({ postId }: BlogPostViewProps) {
  const { data: post, isLoading, error } = trpc.post.getById.useQuery({ 
    postId: parseInt(postId) 
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    const isDraftError = error?.message?.includes('not published');
    
    return (
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {isDraftError ? 'Post Not Published' : 'Post Not Found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {isDraftError 
              ? 'This post is still in draft status and not publicly available yet.'
              : error?.message || 'The blog post you\'re looking for doesn\'t exist.'
            }
          </p>
          
          <div className="flex flex-col items-center gap-4">
            {isDraftError && (
              <Link
                href={`/blog/preview/${postId}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
              >
                <Eye className="w-5 h-5" />
                Preview Draft Version
              </Link>
            )}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <Link
              href="/dashboard?tab=posts"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Blog
      </Link>

      {/* Draft Badge */}
      {post.status === 'DRAFT' && (
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
            Draft
          </span>
        </div>
      )}

      {/* Article Header */}
      <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="p-8 sm:p-12">
          {/* Categories */}
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

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {post.title}
          </h1>

          {/* Meta Information */}
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

          {/* Content */}
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

      {/* Footer Section */}
      <div className="mt-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Last updated</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {new Date(post.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <Link
            href="/blog"
            className="px-6 py-3 bg-gray-900 dark:bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors duration-300"
          >
            Browse More Posts
          </Link>
        </div>
      </div>

      {/* Edit Button for Admins */}
      <div className="mt-8 text-center">
        <Link
          href={`/dashboard?tab=editor&postId=${postId}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-300"
        >
          <Edit className="w-4 h-4" />
          Edit Post
        </Link>
      </div>
    </div>
  );
}
