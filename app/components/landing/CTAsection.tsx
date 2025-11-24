import { Button } from '@/app/components/ui/Button';
import Link from 'next/link';
export function CTASection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900 transition-colors">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-linear-to-br from-teal-600 via-teal-500 to-emerald-500 dark:from-teal-600 dark:via-teal-600 dark:to-emerald-600 p-12 sm:p-16 text-center shadow-xl dark:shadow-teal-500/20">
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Start Blogging?
            </h2>
          </div>
          <p className="mt-4 text-base text-white/90 max-w-2xl mx-auto">
            Join thousands of creators sharing their stories. Start your blogging journey today with our powerful and intuitive platform.
          </p>
          <div className="mt-8">
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white! text-teal-600 hover:bg-gray-100! dark:bg-slate-900! dark:text-teal-400 dark:hover:bg-slate-800! font-semibold shadow-lg cursor-pointer"
              >
                Create Your First Post &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
