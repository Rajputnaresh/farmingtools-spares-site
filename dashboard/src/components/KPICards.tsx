import type { FC } from 'react';
import { IndianRupee, Boxes, CheckCircle2, ArrowUpRight, ArrowDownRight, RotateCcw } from 'lucide-react';
import type { DashboardMetrics, MonthlyTrendData } from '../data/krishigearsData';

interface KPICardsProps {
  metrics: DashboardMetrics;
  selectedPeriod?: string | null;
  selectedMonthData?: MonthlyTrendData;
  onResetPeriod?: () => void;
}

export const KPICards: FC<KPICardsProps> = ({
  metrics,
  selectedPeriod,
  selectedMonthData,
  onResetPeriod,
}) => {
  // If a specific period is selected, display period-scoped metrics
  const displayRevenue = selectedMonthData ? selectedMonthData.revenue : metrics.totalRevenue;
  const displayUnits = selectedMonthData ? selectedMonthData.units : metrics.totalUnits;
  const displayDealers = selectedMonthData ? selectedMonthData.activeDealers : 14;

  const cards = [
    {
      title: "पुर्जे टर्नओवर / Spares Turnover",
      value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(displayRevenue),
      change: selectedPeriod ? 0 : metrics.revenueChange,
      periodLabel: selectedPeriod ? `${selectedPeriod} 2026 Turnover` : "Q1 2026 Turnover",
      icon: IndianRupee,
      iconBg: "bg-[#e9f4ed] text-[#1b7a43] dark:bg-[#0e3d22] dark:text-[#f6f8f5]",
      description: selectedPeriod
        ? `${selectedPeriod} माह में डीलर नेटवर्क द्वारा कुल मांग`
        : "राजस्थान व पंजाब डीलर नेटवर्क का कुल ऑर्डर मूल्य",
    },
    {
      title: "सत्यापित पुर्जे / Catalog Units",
      value: new Intl.NumberFormat('en-IN').format(displayUnits) + " pcs",
      change: selectedPeriod ? 0 : metrics.unitsChange,
      periodLabel: selectedPeriod ? `${selectedPeriod} Dispatches` : "Total Dispatches",
      icon: Boxes,
      iconBg: "bg-[#e9f4ed] text-[#14532d] dark:bg-[#0e3d22] dark:text-[#f6f8f5]",
      description: selectedPeriod
        ? `${selectedPeriod} में ${selectedMonthData?.transactions.length || 0} ऑर्डर्स में भेजे गए कुल पार्ट्स`
        : `1,746 कैटलॉग SKU में से ${metrics.catalogCount} चालू पुर्जे`,
    },
    {
      title: "सक्रिय डीलर व पूर्ति / Fulfillment",
      value: selectedPeriod ? `${displayDealers} Dealers` : `${metrics.fulfillmentRate}%`,
      change: selectedPeriod ? 0 : metrics.fulfillmentChange,
      periodLabel: selectedPeriod ? "Active Nodes" : "Fulfillment Rate",
      icon: CheckCircle2,
      iconBg: "bg-[#fef3c7] text-[#b45309] dark:bg-[#0e3d22] dark:text-[#f0b429]",
      description: selectedPeriod
        ? `${selectedPeriod} में माल प्राप्त करने वाले सक्रिय डीलर केंद्र`
        : "जीरो-इन्वेंट्री मॉडल में 100% फिटमेंट-जांच पूर्ण ऑर्डर्स",
    },
  ];

  return (
    <div className="space-y-3">
      {/* Active Drill-Down Filter Scope Banner */}
      {selectedPeriod && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#e9f4ed] px-4 py-2.5 border border-[#dbe7de] dark:bg-[#14532d] dark:border-[#1b7a43]">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#14532d] dark:text-[#f6f8f5]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1b7a43] animate-pulse" />
            <span>सक्रिय समय अवधि: {selectedPeriod} 2026 (Filtered Period)</span>
            <span className="hidden sm:inline font-normal text-[#3d4a42] dark:text-[#dbe7de]">
              — नीचे दिए गए आंकड़े {selectedPeriod} के चालानों के अनुसार हैं।
            </span>
          </div>
          {onResetPeriod && (
            <button
              type="button"
              onClick={onResetPeriod}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-3 text-xs font-bold text-[#1b7a43] shadow-xs hover:bg-[#1b7a43] hover:text-white dark:bg-[#0e3d22] dark:text-[#f6f8f5] dark:hover:bg-[#1b7a43] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>संपूर्ण तिमाही देखें (Reset to All)</span>
            </button>
          )}
        </div>
      )}

      <section aria-label="Executive Overview KPIs" className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => {
          const isPositive = card.change >= 0;
          const IconComponent = card.icon;

          return (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-xl border border-[#dbe7de] bg-white p-6 shadow-xs transition-all duration-200 hover:border-[#1b7a43]/50 dark:border-[#14532d] dark:bg-[#14532d] dark:hover:border-[#1b7a43]"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#1c2420] dark:text-white">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.iconBg} transition-transform duration-200 group-hover:scale-105`}>
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-3xl font-extrabold tracking-tight text-[#1c2420] dark:text-white tabular-nums">
                  {card.value}
                </div>

                {/* Percentage Change Badge */}
                {card.change !== 0 && (
                  <div
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                      isPositive
                        ? "bg-[#e9f4ed] text-[#14532d] border border-[#dbe7de] dark:bg-[#0e3d22] dark:text-[#f6f8f5] dark:border-[#1b7a43]"
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    <span className="tabular-nums">
                      {isPositive ? `+${card.change}%` : `${card.change}%`}
                    </span>
                  </div>
                )}
              </div>

              <p className="mt-2 text-xs font-medium text-[#5f6f66] dark:text-[#dbe7de]/90">
                {card.description}
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
};

