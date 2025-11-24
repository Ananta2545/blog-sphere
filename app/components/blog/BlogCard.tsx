'use client';
import Link from 'next/link';
import { Calendar, Clock, Tag, Edit, Trash2, Eye } from 'lucide-react';

interface BlogCardProps {
  blog: {
    id: number;
    title: string;
    excerpt: string;
    categories: string[];
    date: string;
    readTime: string;
    status: 'published' | 'draft';
  };
  onDelete?: (id: number) => void;
}

export function BlogCard({ blog, onDelete }: BlogCardProps) {

  const isDraft = blog.status === 'draft';

  const handleDelete = () => {
    if (onDelete) {
      onDelete(blog.id);
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 transition-all duration-300 border border-gray-100 dark:border-slate-700 overflow-hidden group">
      {}
      {isDraft && (
        <div className="bg-orange-500 dark:bg-orange-600 text-white text-xs font-semibold px-3 py-1 text-center">
          DRAFT
        </div>
      )}
      <div className="p-6">
        {}
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.isArray(blog.categories) && blog.categories.map((category, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-700"
            >
              <Tag className="w-3 h-3" />
              {category}
            </span>
          ))}
        </div>
        {}
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
          {blog.title}
        </h3>
        {}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {blog.excerpt}
        </p>
        {}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{blog.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{blog.readTime}</span>
          </div>
        </div>
        {}
        <div className="space-y-2">
          {isDraft ? (
            <>
              <Link
                href={`/dashboard?tab=post-editor&postId=${blog.id}`}
                className="w-full py-2.5 px-4 bg-orange-500 dark:bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Post
              </Link>
              <Link
                href={`/blog/preview/${blog.id}`}
                className="w-full py-2.5 px-4 bg-blue-500 dark:bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/blog/${blog.id}`}
                className="w-full py-2.5 px-4 bg-gray-900 dark:bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors duration-300 block text-center"
              >
                Read More
              </Link>
              <Link
                href={`/dashboard?tab=post-editor&postId=${blog.id}`}
                className="w-full py-2.5 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
            </>
          )}
          {}
          <button
            onClick={handleDelete}
            className="w-full py-2.5 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
