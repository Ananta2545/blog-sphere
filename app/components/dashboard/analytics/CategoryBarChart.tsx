'use client';
import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { trpc } from '@/app/_trpc/client';
import { Loader2 } from 'lucide-react';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
export function CategoryBarChart() {
  const { data: categories, isLoading } = trpc.category.getAll.useQuery();
  const chartRef = useRef(null);
  const isDark =
    typeof window !== 'undefined' &&
    document.documentElement.classList.contains('dark');
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Posts by Category
        </h3>
        <div className="flex items-center justify-center" style={{ height: '280px' }}>
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
      </div>
    );
  }
  const categoryData = Array.isArray(categories) ? categories : [];
  const labels = categoryData.map(cat => cat.name);
  const counts = categoryData.map(cat => cat.postCount || 0);
  const data = {
    labels: labels.length > 0 ? labels : ['No categories'],
    datasets: [
      {
        label: 'Posts',
        data: counts.length > 0 ? counts : [0],
        backgroundColor: isDark ? 'rgba(45, 212, 191, 0.9)' : 'rgba(16, 185, 129, 0.8)',
        borderColor: isDark ? 'rgba(45, 212, 191, 1)' : 'rgba(16, 185, 129, 1)',
        borderRadius: 8,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255,255,255,0.95)',
        titleColor: isDark ? '#e2e8f0' : '#111827',
        bodyColor: isDark ? '#e2e8f0' : '#111827',
        borderColor: isDark ? 'rgba(45,212,191,0.4)' : 'rgba(16,185,129,0.4)',
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: isDark ? '#cbd5e1' : '#475569',
        },
        grid: {
          color: isDark ? 'rgba(45,212,191,0.08)' : 'rgba(0,0,0,0.05)',
        },
      },
      x: {
        ticks: {
          color: isDark ? '#e2e8f0' : '#374151',
        },
        grid: { display: false },
      },
    },
  };
  return (
    <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-600 transition-colors">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Posts by Category
      </h3>
      <div style={{ height: '280px' }}>
        <Bar ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}
