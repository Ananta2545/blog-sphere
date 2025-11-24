"use client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/app/store/useAppStore";
ChartJS.register(ArcElement, Tooltip, Legend);
export function StatusPieChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { data: statsData, isLoading } = trpc.post.getStats.useQuery();
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Post Status Distribution
        </h3>
        <div className="flex items-center justify-center" style={{ height: "280px" }}>
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
      </div>
    );
  }
  const publishedCount = statsData?.publishedPosts || 0;
  const draftCount = statsData?.draftPosts || 0;
  const data: ChartData<"doughnut"> = {
    labels: ["Published", "Drafts"],
    datasets: [
      {
        label: "Posts",
        data: [publishedCount, draftCount],
        backgroundColor: isDark
          ? ["rgba(45, 212, 191, 0.85)", "rgba(251, 146, 60, 0.85)"]
          : ["rgba(16, 185, 129, 0.85)", "rgba(249, 115, 22, 0.85)"],
        borderColor: isDark
          ? ["rgba(45, 212, 191, 1)", "rgba(251, 146, 60, 1)"]
          : ["rgba(16, 185, 129, 1)", "rgba(249, 115, 22, 1)"],
        borderWidth: 3,
        hoverOffset: 8
      }
    ]
  };
  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: isDark ? "#e2e8f0" : "#374151",
          font: { size: 14, weight: 600 },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle"
        }
      },
      tooltip: {
        backgroundColor: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(0, 0, 0, 0.85)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: isDark ? "rgba(45, 212, 191, 0.45)" : "rgba(16, 185, 129, 0.5)",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            const label = context.label ?? "";
            const value = (context.parsed ?? 0) as number;
            const dataset = context.dataset.data as number[];
            const total = dataset.reduce((a, b) => a + b, 0);
            const percentage = total === 0 ? 0 : ((value / total) * 100).toFixed(0);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };
  return (
    <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-600 dark:text-white">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Post Status Distribution
      </h3>
      <div style={{ height: "280px" }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
