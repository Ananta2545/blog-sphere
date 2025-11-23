
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-base text-teal-600 dark:text-teal-400">
              <div className="w-8 h-8 bg-teal-600 dark:bg-teal-500 rounded-lg flex items-center justify-center text-white shadow-lg dark:shadow-teal-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <span>BlogSphere</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-gray-600 dark:text-gray-400">
              A modern blogging platform for creators and storytellers.
            </p>
          </div>

         
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">Product</h3>
            <nav className="mt-4 space-y-2 text-sm">
              <Link href="/features" className="block text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Features</Link>
              <Link href="/dashboard" className="block text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Dashboard</Link>
              <Link href="/categories" className="block text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Categories</Link>
            </nav>
          </div>

          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">Resources</h3>
            <nav className="mt-4 space-y-2 text-sm">
              <Link href="/docs" className="block text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Documentation</Link>
              <Link href="/guides" className="block text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Guides</Link>
              <Link href="/support" className="block text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Support</Link>
            </nav>
          </div>

          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">Company</h3>
            <nav className="mt-4 space-y-2 text-sm">
              <Link href="/about" className="block text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">About</Link>
              <Link href="/blog" className="block text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Blog</Link>
              <Link href="/careers" className="block text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Careers</Link>
            </nav>
          </div>
        </div>

        
        <div className="mt-12 border-t border-gray-100 dark:border-slate-800 pt-8">
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">
            &copy; {currentYear} BlogSphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}