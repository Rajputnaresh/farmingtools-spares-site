import type { FC } from 'react';
import { BarChart3, MousePointerClick, ChevronRight } from 'lucide-react';
import type { MonthData } from '../data/mockData';

interface EmptyStateProps {
  data: MonthData[];
  onSelectPeriod: (month: string) => void;
}

export const EmptyState: FC<EmptyStateProps> = ({ data, onSelectPeriod }) => {

  return (
    <div
      data-testid="empty-state-container"
      className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-10 text-center dark:border-slate-800 dark:bg-slate-900/40"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-sm dark:bg-emerald-950/60 dark:text-emerald-400">
        <BarChart3 className="h-6 w-6" />
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
        No Period Selected
      </h3>

      <p
        className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto"
        data-testid="empty-state-message"
      >
        Select a data point on the chart above to view granular transaction details
      </p>

      {/* Quick Select Exploration Options */}
      <div className="mt-5 flex items-center justify-center gap-2">
        <span className="text-xs text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
          <MousePointerClick className="h-3 w-3" />
          Or jump to:
        </span>
        {data.map((item) => (
          <button
            key={item.month}
            type="button"
            data-testid={`quick-select-${item.month}`}
            onClick={() => onSelectPeriod(item.month)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:bg-slate-700 transition-all"
          >
            <span>{item.month} ({item.transactions.length})</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
          </button>
        ))}
      </div>
    </div>
  );
};
