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
    <header className="border-b border-[#dbe7de] bg-white/95 backdrop-blur-md sticky top-0 z-30 dark:border-[#14532d] dark:bg-[#0e3d22]/95 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand & Context */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-[#1b7a43] flex items-center justify-center text-white shadow-xs shrink-0">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-[#1c2420] dark:text-white leading-tight">
                कृषि गियर्स <span className="font-semibold text-sm sm:text-base text-[#3d4a42] dark:text-[#dbe7de]">पुर्जे विश्लेषिकी</span>
              </h1>
              <span className="hidden sm:inline-flex items-center rounded-full bg-[#e9f4ed] px-2.5 py-0.5 text-xs font-bold text-[#14532d] dark:bg-[#14532d] dark:text-[#f6f8f5] border border-[#dbe7de] dark:border-[#1b7a43]">
                1,746 असली पुर्जे
              </span>
            </div>
            <p className="text-xs text-[#5f6f66] dark:text-[#dbe7de]/80 hidden md:block mt-0.5 font-medium">
              FarmingTools.in &bull; थोक चालान व मांग विश्लेषिकी &bull; Dealer Dispatch Monitor
            </p>
          </div>
        </div>

        {/* Actions: Machine Group Filter, Timeframe Filter, Theme Toggle, Catalog Link */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Category Filter */}
          <div className="relative inline-flex items-center">
            <label htmlFor="category-filter" className="sr-only">
              मशीन श्रेणी चुनें (Filter Category)
            </label>
            <div className="relative">
              <select
                id="category-filter"
                data-testid="category-filter-select"
                value={selectedCategory}
                onChange={(e) => onCategoryChange(Number(e.target.value))}
                className="appearance-none h-11 rounded-xl border border-[#dbe7de] bg-white dark:bg-[#14532d] pl-9 pr-8 text-xs sm:text-sm font-semibold text-[#1c2420] dark:text-white shadow-xs focus:border-[#1b7a43] focus:outline-hidden focus:ring-2 focus:ring-[#f0b429] cursor-pointer max-w-[150px] sm:max-w-none truncate transition-colors"
              >
                <option value={0}>सभी श्रेणियां (All 1,746 SKUs)</option>
                {Object.entries(GROUP_INFO).map(([id, grp]) => (
                  <option key={id} value={id}>
                    {grp.hindi} ({grp.count})
                  </option>
                ))}
              </select>
              <Layers className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f6f66] dark:text-[#dbe7de]" />
            </div>
          </div>

          {/* Timeframe Filter Dropdown */}
          <div className="relative inline-flex items-center">
            <label htmlFor="timeframe-filter" className="sr-only">
              समय अवधि चुनें (Filter Timeframe)
            </label>
            <div className="relative">
              <select
                id="timeframe-filter"
                data-testid="global-filter-select"
                value={currentFilter}
                onChange={(e) => onFilterChange(e.target.value as TimeframeFilter)}
                className="appearance-none h-11 rounded-xl border border-[#dbe7de] bg-white dark:bg-[#14532d] pl-9 pr-8 text-xs sm:text-sm font-semibold text-[#1c2420] dark:text-white shadow-xs focus:border-[#1b7a43] focus:outline-hidden focus:ring-2 focus:ring-[#f0b429] cursor-pointer transition-colors"
              >
                <option value="all">संपूर्ण तिमाही (Q1 2026)</option>
                <option value="q1">Q1 (Jan - Mar 2026)</option>
                <option value="last30">विगत 30 दिन (March)</option>
              </select>
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f6f66] dark:text-[#dbe7de]" />
            </div>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            data-testid="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle color theme"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[#dbe7de] bg-white text-[#1c2420] shadow-xs hover:bg-[#e9f4ed] dark:border-[#14532d] dark:bg-[#14532d] dark:text-[#f6f8f5] dark:hover:bg-[#1b7a43] transition-colors shrink-0 focus:outline-hidden focus:ring-2 focus:ring-[#f0b429]"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-[#f0b429]" />
            ) : (
              <Moon className="h-5 w-5 text-[#14532d]" />
            )}
          </button>

          {/* Link back to Main Spares Platform */}
          <a
            href="../"
            className="hidden md:inline-flex h-11 items-center gap-1.5 rounded-xl border border-[#dbe7de] bg-[#f6f8f5] px-3 text-xs font-bold text-[#1b7a43] hover:bg-[#e9f4ed] hover:text-[#14532d] dark:border-[#14532d] dark:bg-[#0e3d22] dark:text-[#f6f8f5] dark:hover:bg-[#14532d] transition-colors shrink-0"
          >
            <span>कैटलॉग स्टोर</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
};

