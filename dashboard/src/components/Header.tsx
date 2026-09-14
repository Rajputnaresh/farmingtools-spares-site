import type { FC } from 'react';
import { Calendar, Sun, Moon, ArrowUpRight, Wrench, Layers } from 'lucide-react';
import type { TimeframeFilter } from '../data/krishigearsData';
import { GROUP_INFO } from '../data/krishigearsData';

interface HeaderProps {
  currentFilter: TimeframeFilter;
  onFilterChange: (filter: TimeframeFilter) => void;
  selectedCategory: number;
  onCategoryChange: (cat: number) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: FC<HeaderProps> = ({
  currentFilter,
  onFilterChange,
  selectedCategory,
  onCategoryChange,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Context */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                KrishiGears Spares Analytics
              </h1>
              <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                1,746 Genuine SKUs
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
              FarmingTools.in &bull; Overview &bull; Zoom &amp; Filter &bull; Details-on-Demand
            </p>
          </div>
        </div>

        {/* Actions: Machine Group Filter, Timeframe Filter, Theme Toggle, Catalog Link */}
        <div className="flex items-center gap-2.5">
          {/* Category Filter */}
          <div className="relative inline-flex items-center">
            <label htmlFor="category-filter" className="sr-only">
              Filter Machine Category
            </label>
            <div className="relative">
              <select
                id="category-filter"
                data-testid="category-filter-select"
                value={selectedCategory}
                onChange={(e) => onCategoryChange(Number(e.target.value))}
                className="appearance-none rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-7 pr-7 text-xs font-semibold text-slate-800 shadow-xs focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer max-w-[160px] sm:max-w-none truncate"
              >
                <option value={0}>All Categories (1,746 SKUs)</option>
                {Object.entries(GROUP_INFO).map(([id, grp]) => (
                  <option key={id} value={id}>
                    {grp.name} ({grp.count})
                  </option>
                ))}
              </select>
              <Layers className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Timeframe Filter Dropdown */}
          <div className="relative inline-flex items-center">
            <label htmlFor="timeframe-filter" className="sr-only">
              Filter Timeframe
            </label>
            <div className="relative">
              <select
                id="timeframe-filter"
                data-testid="global-filter-select"
                value={currentFilter}
                onChange={(e) => onFilterChange(e.target.value as TimeframeFilter)}
                className="appearance-none rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-7 pr-7 text-xs font-semibold text-slate-800 shadow-xs focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="all">All Months (Jan - Mar)</option>
                <option value="q1">This Quarter (Q1 2026)</option>
                <option value="last30">Last 30 Days (March)</option>
              </select>
              <Calendar className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            data-testid="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle color theme"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>

          {/* Link back to Main Spares Platform */}
          <a
            href="../"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 ml-1 shrink-0"
          >
            <span>Spares Storefront</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </header>
  );
};
