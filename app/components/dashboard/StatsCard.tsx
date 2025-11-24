import { LucideIcon } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface StatsCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: 'emerald' | 'green' | 'orange' | 'purple' | 'blue';
}

const colorStyles = {
  emerald: {
    bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    iconBg: 'bg-emerald-600/20',
    iconColor: 'text-white',
  },
  green: {
    bg: 'bg-gradient-to-br from-green-500 to-green-600',
    iconBg: 'bg-green-600/20',
    iconColor: 'text-white',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    iconBg: 'bg-orange-600/20',
    iconColor: 'text-white',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    iconBg: 'bg-purple-600/20',
    iconColor: 'text-white',
  },
  blue: {
    bg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    iconBg: 'bg-blue-600/20',
    iconColor: 'text-white',
  },
};

export function StatsCard({ label, value, icon: Icon, color }: StatsCardProps) {
  const styles = colorStyles[color];
  return (
    <div className={cn(
      'rounded-2xl p-6 shadow-lg dark:shadow-2xl dark:shadow-black/40 text-white transition-shadow',
      styles.bg
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/90 mb-3">{label}</p>
          <p className="text-4xl font-bold">{value}</p>
        </div>
        <div className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center',
          styles.iconBg
        )}>
          <Icon className={cn('w-7 h-7', styles.iconColor)} />
        </div>
      </div>
    </div>
  );
}
