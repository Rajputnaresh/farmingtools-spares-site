import type { FC } from 'react';
import { BarChart3, MousePointerClick, ChevronRight, Layers } from 'lucide-react';
import type { MonthlyTrendData } from '../data/krishigearsData';
import { GROUP_INFO } from '../data/krishigearsData';

interface EmptyStateProps {
  data: MonthlyTrendData[];
  onSelectPeriod: (month: string) => void;
  onSelectCategory: (groupId: number) => void;
}

export const EmptyState: FC<EmptyStateProps> = ({ data, onSelectPeriod, onSelectCategory }) => {
  return (
    <div
      data-testid="empty-state-container"
      className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-10 text-center dark:border-slate-800 dark:bg-slate-900/40"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-xs dark:bg-emerald-950/60 dark:text-emerald-400">
        <BarChart3 className="h-6 w-6" />
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
        No Period Selected / कोई समय चुना नहीं गया
      </h3>

      <p
        className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto"
        data-testid="empty-state-message"
      >
        Select a data point on the chart above to view granular transaction details
      </p>

      {/* Quick Select by Month */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
          <MousePointerClick className="h-3 w-3" />
          Jump to Month:
        </span>
        {data.map((item) => (
          <button
            key={item.month}
            type="button"
            data-testid={`quick-select-${item.month}`}
            onClick={() => onSelectPeriod(item.month)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:bg-slate-700 transition-all"
          >
            <span>{item.month} ({item.transactions.length} orders)</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
          </button>
        ))}
      </div>

      {/* Quick Select by Machine Subsystem */}
      <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
          <Layers className="h-3 w-3" />
          Or Explore Catalog:
        </span>
        {Object.entries(GROUP_INFO).map(([id, grp]) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelectCategory(Number(id))}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-xs hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all"
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: grp.color }} />
            <span>{grp.name} ({grp.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
};
