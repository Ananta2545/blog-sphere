"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Chart,
  ChartData,
  ChartOptions,
  Plugin
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/app/store/useAppStore";

ChartJS.register(ArcElement, Tooltip, Legend);

export function CategoryDistributionChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data: categories, isLoading } = trpc.category.getAll.useQuery();

  if (isLoading) {

    return (
      <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Category Distribution
        </h3>
        <div className="flex items-center justify-center" style={{ height: "320px" }}>
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
      </div>
    );
  }

  const labels = categories?.map((cat) => cat.name) ?? [];
  const counts = categories?.map((cat) => cat.postCount || 0) ?? [];

  const colors = isDark
    ? ["#34d399", "#22d3ee", "#60a5fa", "#a855f7", "#f472b6", "#fb923c", "#facc15"]
    : ["#10b981", "#14b8a6", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#fb923c"];

  const data: ChartData<"pie"> = {
    labels: labels.length ? labels : ["No categories"],
    datasets: [
      {
        data: counts.length ? counts : [0],
        backgroundColor: labels.map((_, i) => colors[i % colors.length]),
        borderColor: isDark ? "#1e293b" : "#ffffff",
        borderWidth: 3
      }
    ]
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: isDark ? "#e2e8f0" : "#374151",
          font: { size: 14, weight: 600 },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
          generateLabels: (chart: Chart<"pie">) => {
            const dataset = chart.data.datasets[0];
            const total = dataset.data.reduce((sum, value) => sum + (value as number), 0);

            return chart.data.labels!.map((label, index) => {
              const percent =
                total === 0
                  ? 0
                  : (((dataset.data[index] as number) / total) * 100).toFixed(0);

              return {
                text: `${label}: ${percent}%`,
                fillStyle: dataset.backgroundColor![index] as string,
                strokeStyle: dataset.backgroundColor![index] as string,
                fontColor: isDark ? "#e2e8f0" : "#374151",
                index
              };
            });
          }
        }
      },
      tooltip: {
        backgroundColor: isDark ? "rgba(15,23,42,0.9)" : "rgba(0,0,0,0.85)",
        padding: 12,
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: (context) => {
            const label = context.label ?? "";
            const value = (context.parsed ?? 0) as number;
            const dataset = context.dataset.data as number[];
            const total = dataset.reduce((a, b) => a + b, 0);
            const percentage = total === 0 ? 0 : ((value / total) * 100).toFixed(0);
            return `${label}: ${value} posts (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    
    <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-600 dark:text-white">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Category Distribution
      </h3>
      <div className="h-80">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
