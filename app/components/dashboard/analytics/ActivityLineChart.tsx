'use client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { trpc } from '@/app/_trpc/client';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/app/store/useAppStore';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function ActivityLineChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { data: postsData, isLoading } = trpc.post.getAll.useQuery({
    page: 1,
    limit: 100,
    status: 'ALL',
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Publishing Activity (Last 7 Days)
        </h3>
        <div className="flex items-center justify-center" style={{ height: '280px' }}>
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
      </div>
    );
  }

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const labels = last7Days.map(date =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );

  const posts = postsData?.posts ?? [];
  const countsPerDay = last7Days.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    return posts.filter(post => new Date(post.createdAt).toISOString().split('T')[0] === dateStr).length;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Posts',
        data: countsPerDay,
        borderColor: isDark ? 'rgba(45, 212, 191, 1)' : 'rgba(16, 185, 129, 1)',
        backgroundColor: isDark ? 'rgba(45, 212, 191, 0.15)' : 'rgba(16, 185, 129, 0.12)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: isDark ? 'rgba(45, 212, 191, 1)' : 'rgba(16, 185, 129, 1)',
        pointBorderColor: isDark ? '#1e293b' : '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: isDark ? '#38d6c7' : '#10b981',
          font: { size: 14, weight: 600 },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        borderColor: isDark ? 'rgba(45, 212, 191, 0.45)' : 'rgba(16, 185, 129, 0.5)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 2,
          color: isDark ? '#cbd5e1' : '#6b7280',
        },
        grid: {
          color: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
        },
      },
      x: {
        ticks: {
          color: isDark ? '#e2e8f0' : '#374151',
          font: { size: 12, weight: 500 },
        },
        grid: { display: false },
      },
    },
  };
  
  return (
    <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-600 dark:text-white">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Publishing Activity (Last 7 Days)
      </h3>
      <div style={{ height: '280px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
