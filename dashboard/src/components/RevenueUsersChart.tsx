import type { FC } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { MousePointerClick, X, Info } from 'lucide-react';
import type { MonthData } from '../data/mockData';



interface RevenueUsersChartProps {
  data: MonthData[];
  selectedPeriod: string | null;
  onSelectPeriod: (month: string | null) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  selectedPeriod?: string | null;
}

const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload, label, selectedPeriod }) => {
  if (active && payload && payload.length) {
    const isSelected = selectedPeriod === label;
    const rev = payload.find((p) => p.dataKey === 'revenue')?.value;
    const usr = payload.find((p) => p.dataKey === 'users')?.value;

    return (
      <div className="rounded-xl border border-slate-200 bg-white/95 p-3.5 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 dark:border-slate-800">
          <p className="font-semibold text-slate-900 dark:text-white">
            {label} Details
          </p>
          {isSelected && (
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Selected
            </span>
          )}
        </div>

        <div className="mt-2.5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Revenue:
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(rev ?? 0)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
              Active Users:
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {new Intl.NumberFormat('en-US').format(usr ?? 0)}
            </span>
          </div>
        </div>

        <p className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <MousePointerClick className="h-3 w-3" />
          Click to inspect transactions
        </p>
      </div>
    );
  }

  return null;
};

export const RevenueUsersChart: FC<RevenueUsersChartProps> = ({
  data,
  selectedPeriod,
  onSelectPeriod,
}) => {
  const handleChartClick = (state: any) => {
    if (state && state.activeLabel) {
      if (selectedPeriod === state.activeLabel) {
        onSelectPeriod(null); // toggle off
      } else {
        onSelectPeriod(state.activeLabel);
      }
    } else if (state && state.activePayload && state.activePayload.length > 0) {
      const month = state.activePayload[0].payload.month;
      if (month) {
        onSelectPeriod(selectedPeriod === month ? null : month);
      }
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Revenue vs. Users
            </h2>
            {selectedPeriod && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Drilled down: {selectedPeriod}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPeriod(null);
                  }}
                  className="ml-1 hover:text-emerald-900 dark:hover:text-emerald-200"
                  aria-label="Clear drill-down"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interactive multi-metric performance over time. Click any month or point to filter transactions below.
          </p>
        </div>

        {/* Quick Month Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mr-1 hidden sm:inline">
            Period:
          </span>
          {data.map((item) => {
            const isSelected = selectedPeriod === item.month;
            return (
              <button
                key={item.month}
                type="button"
                data-testid={`chart-period-btn-${item.month}`}
                onClick={() => onSelectPeriod(isSelected ? null : item.month)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-sm dark:bg-emerald-600 dark:text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {item.month}
              </button>
            );
          })}
          {selectedPeriod && (
            <button
              type="button"
              onClick={() => onSelectPeriod(null)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1.5 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Chart Instruction Banner */}
      <div className="mt-3 flex items-center justify-between px-1 text-xs text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1">
          <Info className="h-3.5 w-3.5" />
          Tip: Click any data point or area column to trigger progressive drill-down.
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Revenue (USD)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            Users
          </span>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="mt-4 h-72 sm:h-80 w-full" data-testid="recharts-area-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            onClick={handleChartClick}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            className="cursor-pointer"
          >
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-slate-200/80 dark:text-slate-800/80"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />

            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
              dx={-5}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(val) => `${val}`}
              dx={5}
            />

            <Tooltip content={<CustomTooltip selectedPeriod={selectedPeriod} />} />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revenueGrad)"
              activeDot={{
                r: 6,
                stroke: '#10b981',
                strokeWidth: 2,
                fill: '#ffffff',
                className: 'cursor-pointer animate-pulse',
              }}
            />

            <Area
              yAxisId="right"
              type="monotone"
              dataKey="users"
              name="Users"
              stroke="#6366f1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#usersGrad)"
              activeDot={{
                r: 6,
                stroke: '#6366f1',
                strokeWidth: 2,
                fill: '#ffffff',
                className: 'cursor-pointer animate-pulse',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
