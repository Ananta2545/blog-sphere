import { Bolt, BookOpen, LayoutDashboard, Shield, Globe, Moon } from 'lucide-react';
import { cn } from '@/app/lib/utils';
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, bgColor }) => (
  <div className="rounded-xl bg-white dark:bg-slate-800 p-8 shadow-lg dark:shadow-slate-900/50 transition-all duration-300 hover:shadow-xl dark:hover:shadow-slate-900/70 border border-transparent dark:border-slate-700">
    <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg dark:shadow-teal-500/30', bgColor)}>
      {icon}
    </div>
    <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
    <p className="mt-3 text-base text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);
const features = [
  {
    icon: <Bolt className="h-6 w-6" />,
    title: 'Lightning Fast',
    description: 'Built with modern web technologies for blazing fast performance and seamless user experience.',
    bgColor: 'bg-teal-600',
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: 'Rich Content Editor',
    description: 'Create beautiful blog posts with our powerful rich text editor. Format text, add lists, and more.',
    bgColor: 'bg-teal-600',
  },
  {
    icon: <LayoutDashboard className="h-6 w-6" />,
    title: 'Category Management',
    description: 'Organize your content with flexible categories. Tag posts with multiple categories for better discovery.',
    bgColor: 'bg-teal-600', 
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Draft & Publish',
    description: 'Work on drafts privately and publish when ready. Complete control over your content workflow.',
    bgColor: 'bg-teal-600',
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Responsive Design',
    description: 'Beautiful on all devices. Mobile-first design ensures your blog looks great everywhere.',
    bgColor: 'bg-teal-600',
  },
  {
    icon: <Moon className="h-6 w-6" />,
    title: 'Dark Mode',
    description: 'Easy on the eyes with full dark mode support. Toggle between light and dark themes instantly.',
    bgColor: 'bg-teal-600',
  },
];
export function FeatureSection() {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-900 transition-colors">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 sm:text-4xl inline-flex items-center gap-3">
            <span className="text-4xl">💡</span> Powerful Features <span className="text-4xl">💡</span>
          </h2>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to create and manage a professional blog. Simple, powerful, and built for the modern web.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              bgColor={feature.bgColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
