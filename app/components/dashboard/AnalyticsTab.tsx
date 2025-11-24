'use client';
import { FileText, CheckCircle, FileEdit, Folder, Clock, Loader2 } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { CategoryBarChart } from './analytics/CategoryBarChart';
import { StatusPieChart } from './analytics/StatusPieChart';
import { ActivityLineChart } from './analytics/ActivityLineChart';
import { CategoryDistributionChart } from './analytics/CategoryDistributionChart';
import { trpc } from '@/app/_trpc/client';
export function AnalyticsTab() {
  const { data: statsData, isLoading } = trpc.post.getStats.useQuery();
  const { data: postsData } = trpc.post.getAll.useQuery({
    page: 1,
    limit: 100,
    status: 'ALL',
  });
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-teal-600 dark:text-teal-400 animate-spin" />
      </div>
    );
  }
  const avgReadTime = postsData?.posts?.length
    ? Math.round(
        postsData.posts.reduce((sum, post) => sum + (post.readingTimeMins || 0), 0) /
          postsData.posts.length
      )
    : 0;
  const stats = [
    {
      label: 'Total Posts',
      value: statsData?.totalPosts?.toString() || '0',
      icon: FileText,
      color: 'emerald' as const,
    },
    {
      label: 'Published',
      value: statsData?.publishedPosts?.toString() || '0',
      icon: CheckCircle,
      color: 'green' as const,
    },
    {
      label: 'Drafts',
      value: statsData?.draftPosts?.toString() || '0',
      icon: FileEdit,
      color: 'orange' as const,
    },
    {
      label: 'Categories',
      value: statsData?.totalCategories?.toString() || '0',
      icon: Folder,
      color: 'purple' as const,
    },
    {
      label: 'Avg. Read Time',
      value: `${avgReadTime} min`,
      icon: Clock,
      color: 'blue' as const,
    },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBarChart />
        <StatusPieChart />
      </div>
      <ActivityLineChart />
      <CategoryDistributionChart />
    </div>
  );
}
