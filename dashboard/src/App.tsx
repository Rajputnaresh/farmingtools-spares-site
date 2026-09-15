import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { RevenueUsersChart } from './components/RevenueUsersChart';
import { DrillDownTable } from './components/DrillDownTable';
import { NewRequestModal } from './components/NewRequestModal';
import { getKrishiGearsMetrics, type TimeframeFilter, type SparesTransaction } from './data/krishigearsData';

export function App() {
  const [filter, setFilter] = useState<TimeframeFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<number>(0); // 0 = all
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [extraTransactions, setExtraTransactions] = useState<SparesTransaction[]>([]);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
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

  // Handle adding a new network request dynamically
  const handleAddNewRequest = (newTx: SparesTransaction) => {
    setExtraTransactions((prev) => [newTx, ...prev]);
  };

  // Compute metrics and scoped chart data (including any newly submitted dealer requests)
  const metrics = useMemo(
    () => getKrishiGearsMetrics(filter, selectedCategory, extraTransactions),
    [filter, selectedCategory, extraTransactions]
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
    <div className="min-h-screen bg-[#f6f8f5] text-[#1c2420] transition-colors duration-200 dark:bg-[#0e3d22] dark:text-[#f6f8f5] flex flex-col font-sans">
      <Header
        currentFilter={filter}
        onFilterChange={setFilter}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenNewRequest={() => setIsNewModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Layer 1: Overview - Executive KPI Summary Cards with State Sync */}
        <section aria-labelledby="kpi-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="kpi-heading" className="text-xs font-extrabold uppercase tracking-wider text-[#3d4a42] dark:text-[#dbe7de]">
              व्यापार स्थिति • KrishiGears Business Health
            </h2>
            <span className="text-xs font-bold text-[#5f6f66] dark:text-[#dbe7de]/90">
              {metrics.catalogCount} सत्यापित पुर्जे (SKUs) &bull; Q1 2026
            </span>
          </div>
          <KPICards
            metrics={metrics}
            selectedPeriod={selectedPeriod}
            selectedMonthData={selectedMonthData}
            onResetPeriod={() => setSelectedPeriod(null)}
          />
        </section>

        {/* Layer 2: Trend & Exploration - High-Contrast AreaChart */}
        <section aria-labelledby="visual-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="visual-heading" className="text-xs font-extrabold uppercase tracking-wider text-[#3d4a42] dark:text-[#dbe7de]">
              मासिक पुर्जे मांग व चालान • Monthly Spares Demand
            </h2>
            <span className="text-xs font-bold text-[#5f6f66] dark:text-[#dbe7de]/90">
              टैप कर माह चुनें / Click point to inspect dispatches
            </span>
          </div>
          <RevenueUsersChart
            data={metrics.filteredMonthlyData}
            selectedPeriod={selectedPeriod}
            onSelectPeriod={setSelectedPeriod}
          />
        </section>

        {/* Layer 3: Front-and-Center Network Requests & Line-Item Dispatches */}
        <section aria-labelledby="drilldown-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="drilldown-heading" className="text-xs font-extrabold uppercase tracking-wider text-[#3d4a42] dark:text-[#dbe7de]">
              चालान व पुर्जे विवरण • Line-Item Invoices &amp; Dispatches
            </h2>
            {selectedPeriod ? (
              <span className="text-xs font-bold text-[#1b7a43] dark:text-[#f0b429]">
                {selectedPeriod} 2026 के चालानों पर फ़िल्टर
              </span>
            ) : (
              <span className="text-xs font-bold text-[#14532d] dark:text-[#f6f8f5]">
                ताज़ा नेटवर्क मांग अनुरोध (Recent Network Requests)
              </span>
            )}
          </div>

          <DrillDownTable
            selectedPeriod={selectedPeriod}
            monthData={selectedMonthData}
            allTransactions={metrics.filteredTransactions}
            onClearSelection={() => setSelectedPeriod(null)}
            onOpenNewRequest={() => setIsNewModalOpen(true)}
          />
        </section>
      </main>

      {/* New Request Modal */}
      <NewRequestModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleAddNewRequest}
      />

      {/* Footer */}
      <footer className="border-t border-[#dbe7de] bg-white py-6 text-center text-xs text-[#5f6f66] dark:border-[#14532d] dark:bg-[#0e3d22] dark:text-[#dbe7de]/90">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-medium">
          <span>कृषि गियर्स जयपुर (KrishiGears Jaipur, GSTIN 08EQLPD7160R1Z2) &bull; FarmingTools.in</span>
          <span>1,746 असली पुर्जे &bull; भारतीय किसानों व ग्रामीण डीलरों को समर्पित सेवा</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

