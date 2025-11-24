import { Button } from '@/app/components/ui/Button';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="bg-linear-to-b from-teal-50/30 via-cyan-50/20 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900 pt-20 pb-28 transition-colors">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center rounded-full bg-teal-100/60 dark:bg-teal-900/40 px-4 py-1.5 text-sm font-semibold text-teal-700 dark:text-teal-400 mb-8">
           WELCOME TO BLOGSPHERE 
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-teal-600 dark:text-teal-400 sm:text-6xl lg:text-7xl leading-tight">
          Create, Share, and Inspire
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          A modern blogging platform built for creators. Write beautiful content, organize with categories, and share your ideas with the world. Fast, intuitive, and designed for the modern web.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 shadow-lg shadow-teal-500/20 cursor-pointer">
              Start Writing &rarr;
            </Button>
          </Link>
          <Link href="/blog">
            <Button size="lg" variant="secondary" className="hover:bg-gray-300 dark:hover:bg-slate-800 dark:bg-slate-700 dark:text-gray-200 cursor-pointer">
              Explore Posts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
