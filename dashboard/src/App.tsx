import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { RevenueUsersChart } from './components/RevenueUsersChart';
import { DrillDownTable } from './components/DrillDownTable';
import { EmptyState } from './components/EmptyState';
import { getKrishiGearsMetrics, type TimeframeFilter } from './data/krishigearsData';

export function App() {
  const [filter, setFilter] = useState<TimeframeFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<number>(0); // 0 = all
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('kg-theme') === 'dark' ||
        (!localStorage.getItem('kg-theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  // Apply dark mode class to root
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('kg-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('kg-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Compute metrics and scoped chart data
  const metrics = useMemo(
    () => getKrishiGearsMetrics(filter, selectedCategory),
    [filter, selectedCategory]
  );

  // If filter changes and selected month is no longer in scope, reset selectedPeriod
  useEffect(() => {
    if (selectedPeriod && !metrics.filteredMonthlyData.some((d) => d.month === selectedPeriod)) {
      setSelectedPeriod(null);
    }
  }, [filter, metrics.filteredMonthlyData, selectedPeriod]);

  // Find data for currently selected period
  const selectedMonthData = useMemo(() => {
    if (!selectedPeriod) return undefined;
    return metrics.filteredMonthlyData.find((d) => d.month === selectedPeriod);
  }, [selectedPeriod, metrics.filteredMonthlyData]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 flex flex-col">
      <Header
        currentFilter={filter}
        onFilterChange={setFilter}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Layer 1: Overview - Executive KPI Summary Cards */}
        <section aria-labelledby="kpi-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="kpi-heading" className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Executive Overview &bull; KrishiGears Business Health
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {metrics.catalogCount} Verified SKUs &bull; Q1 2026
            </span>
          </div>
          <KPICards metrics={metrics} />
        </section>

        {/* Layer 2: Zoom & Filter - Interactive AreaChart */}
        <section aria-labelledby="visual-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="visual-heading" className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Performance Trend &amp; Demand Velocity
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Interactive Zoom / Point Click to Drill Down
            </span>
          </div>
          <RevenueUsersChart
            data={metrics.filteredMonthlyData}
            selectedPeriod={selectedPeriod}
            onSelectPeriod={setSelectedPeriod}
          />
        </section>

        {/* Layer 3: Details-on-Demand - Granular Drill-Down Data Table OR Empty State */}
        <section aria-labelledby="drilldown-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="drilldown-heading" className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Details-On-Demand &bull; Line-Item Dispatches
            </h2>
            {selectedPeriod && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Filtered to {selectedPeriod} Dispatches
              </span>
            )}
          </div>

          {selectedPeriod ? (
            <DrillDownTable
              selectedPeriod={selectedPeriod}
              monthData={selectedMonthData}
              onClearSelection={() => setSelectedPeriod(null)}
            />
          ) : (
            <EmptyState
              data={metrics.filteredMonthlyData}
              onSelectPeriod={setSelectedPeriod}
              onSelectCategory={setSelectedCategory}
            />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>KrishiGears (Jaipur, GSTIN 08EQLPD7160R1Z2) &bull; FarmingTools.in Spares Intelligence</span>
          <span>1,746 Genuine Parts &bull; Progressive Disclosure Architecture</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
