import type { FC } from 'react';
import { DollarSign, Users, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { DashboardMetrics } from '../data/mockData';

interface KPICardsProps {
  metrics: DashboardMetrics;
}

export const KPICards: FC<KPICardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: "Total Revenue",
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(metrics.totalRevenue),
      change: metrics.revenueChange,
      icon: DollarSign,
      iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
      description: "vs. previous billing period",
    },
    {
      title: "Active Users",
      value: new Intl.NumberFormat('en-US').format(metrics.activeUsers),
      change: metrics.usersChange,
      icon: Users,
      iconBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400",
      description: "unique active accounts",
    },
    {
      title: "Conversion Rate",
      value: `${metrics.conversionRate}%`,
      change: metrics.conversionChange,
      icon: Percent,
      iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
      description: "checkout conversion efficiency",
    },
  ];

  return (
    <section aria-label="Executive Overview KPIs" className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((card) => {
        const isPositive = card.change >= 0;
        const IconComponent = card.icon;

        return (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.iconBg} transition-transform duration-200 group-hover:scale-105`}>
                <IconComponent className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {card.value}
              </div>

              {/* Percentage Change Badge */}
              <div
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  isPositive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/50"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                <span>
                  {isPositive ? `+${card.change}%` : `${card.change}%`}
                </span>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              {card.description}
            </p>
          </div>
        );
      })}
    </section>
  );
};
