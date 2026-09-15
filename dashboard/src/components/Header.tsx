import type { FC } from 'react';
import { Calendar, Sun, Moon, ArrowUpRight, Wrench, Layers, PlusCircle } from 'lucide-react';
import type { TimeframeFilter } from '../data/krishigearsData';
import { GROUP_INFO } from '../data/krishigearsData';

interface HeaderProps {
  currentFilter: TimeframeFilter;
  onFilterChange: (filter: TimeframeFilter) => void;
  selectedCategory: number;
  onCategoryChange: (cat: number) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenNewRequest: () => void;
}

export const Header: FC<HeaderProps> = ({
  currentFilter,
  onFilterChange,
  selectedCategory,
  onCategoryChange,
  isDark,
  onToggleTheme,
  onOpenNewRequest,
}) => {
  return (
    <header className="border-b border-[#dbe7de] bg-white/95 backdrop-blur-md sticky top-0 z-30 dark:border-[#14532d] dark:bg-[#0e3d22]/95 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-0 min-h-[64px] sm:h-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
        {/* Brand & Context */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-[#1b7a43] flex items-center justify-center text-white shadow-xs shrink-0">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-[#1c2420] dark:text-white leading-tight">
                  कृषि गियर्स <span className="font-semibold text-sm sm:text-base text-[#3d4a42] dark:text-[#dbe7de]">पुर्जे विश्लेषिकी</span>
                </h1>
                <span className="inline-flex items-center rounded-full bg-[#e9f4ed] px-2.5 py-0.5 text-xs font-bold text-[#14532d] dark:bg-[#14532d] dark:text-[#f6f8f5] border border-[#dbe7de] dark:border-[#1b7a43]">
                  1,746 चालू पुर्जे
                </span>
              </div>
              <p className="text-xs text-[#5f6f66] dark:text-[#dbe7de]/80 hidden md:block mt-0.5 font-medium">
                FarmingTools.in &bull; थोक चालान व मांग विश्लेषिकी &bull; Dealer Dispatch Monitor
              </p>
            </div>
          </div>

          {/* Quick actions on small screens - 44px touch targets */}
          <div className="sm:hidden flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onOpenNewRequest}
              data-testid="mobile-header-new-request-btn"
              className="inline-flex min-h-[44px] items-center gap-1 rounded-xl bg-[#1b7a43] px-2.5 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-[#14532d] focus:outline-hidden focus:ring-2 focus:ring-[#f0b429] cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>+ मांग</span>
            </button>
            <a
              href="../"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-xl border border-[#dbe7de] bg-[#f6f8f5] px-2.5 py-2 text-xs font-bold text-[#1b7a43] hover:bg-[#e9f4ed] dark:border-[#14532d] dark:bg-[#0e3d22] dark:text-[#f6f8f5]"
            >
              <span>स्टोर</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Actions: Machine Group Filter, Timeframe Filter, Theme Toggle, Catalog Link */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Desktop New Request Button */}
          <button
            type="button"
            onClick={onOpenNewRequest}
            data-testid="header-new-request-btn"
            className="hidden sm:inline-flex min-h-[44px] h-11 items-center gap-1.5 rounded-xl bg-[#1b7a43] px-3.5 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-[#14532d] focus:outline-hidden focus:ring-2 focus:ring-[#f0b429] transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ नया नेटवर्क अनुरोध</span>
          </button>
          {/* Category Filter */}
          <div className="relative inline-flex items-center flex-1 sm:flex-initial">
            <label htmlFor="category-filter" className="sr-only">
              मशीन श्रेणी चुनें (Filter Category)
            </label>
            <div className="relative w-full">
              <select
                id="category-filter"
                data-testid="category-filter-select"
                value={selectedCategory}
                onChange={(e) => onCategoryChange(Number(e.target.value))}
                className="w-full appearance-none h-11 rounded-xl border border-[#dbe7de] bg-white dark:bg-[#14532d] pl-8 sm:pl-9 pr-6 sm:pr-8 text-xs sm:text-sm font-semibold text-[#1c2420] dark:text-white shadow-xs focus:border-[#1b7a43] focus:outline-hidden focus:ring-2 focus:ring-[#f0b429] cursor-pointer truncate transition-colors"
              >
                <option value={0}>सभी श्रेणियां (All 1,746)</option>
                {Object.entries(GROUP_INFO).map(([id, grp]) => (
                  <option key={id} value={id}>
                    {grp.hindi} ({grp.count})
                  </option>
                ))}
              </select>
              <Layers className="pointer-events-none absolute left-2.5 sm:left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f6f66] dark:text-[#dbe7de]" />
            </div>
          </div>

          {/* Timeframe Filter Dropdown */}
          <div className="relative inline-flex items-center flex-1 sm:flex-initial">
            <label htmlFor="timeframe-filter" className="sr-only">
              समय अवधि चुनें (Filter Timeframe)
            </label>
            <div className="relative w-full">
              <select
                id="timeframe-filter"
                data-testid="global-filter-select"
                value={currentFilter}
                onChange={(e) => onFilterChange(e.target.value as TimeframeFilter)}
                className="w-full appearance-none h-11 rounded-xl border border-[#dbe7de] bg-white dark:bg-[#14532d] pl-8 sm:pl-9 pr-6 sm:pr-8 text-xs sm:text-sm font-semibold text-[#1c2420] dark:text-white shadow-xs focus:border-[#1b7a43] focus:outline-hidden focus:ring-2 focus:ring-[#f0b429] cursor-pointer truncate transition-colors"
              >
                <option value="all">Q1 2026 (सभी)</option>
                <option value="q1">तिमाही (Jan - Mar)</option>
                <option value="last30">विगत 30 दिन</option>
              </select>
              <Calendar className="pointer-events-none absolute left-2.5 sm:left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f6f66] dark:text-[#dbe7de]" />
            </div>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            data-testid="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle color theme"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[#dbe7de] bg-white text-[#1c2420] shadow-xs hover:bg-[#e9f4ed] dark:border-[#14532d] dark:bg-[#14532d] dark:text-[#f6f8f5] dark:hover:bg-[#1b7a43] transition-colors shrink-0 focus:outline-hidden focus:ring-2 focus:ring-[#f0b429] cursor-pointer"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-[#f0b429]" />
            ) : (
              <Moon className="h-5 w-5 text-[#14532d]" />
            )}
          </button>

          {/* Link back to Main Spares Platform on larger screens */}
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
