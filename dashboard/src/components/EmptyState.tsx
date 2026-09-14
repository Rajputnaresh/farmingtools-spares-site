import type { FC } from 'react';
import { BarChart3, ChevronRight, Layers, Calendar } from 'lucide-react';
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
      className="rounded-xl border border-[#dbe7de] bg-white p-8 text-center shadow-xs dark:border-[#14532d] dark:bg-[#14532d]/40"
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9f4ed] text-[#1b7a43] shadow-xs dark:bg-[#0e3d22] dark:text-[#f6f8f5]">
          <BarChart3 className="h-5 w-5" />
        </div>
        <h3 className="text-base font-extrabold text-[#1c2420] dark:text-white">
          चालान विवरण देखने हेतु माह चुनें (Select Period)
        </h3>
      </div>

      <p
        className="text-xs sm:text-sm font-medium text-[#5f6f66] dark:text-[#dbe7de]/90 max-w-md mx-auto"
        data-testid="empty-state-message"
      >
        ग्राफ या नीचे दिए गए बटनों में से किसी भी माह पर टैप कर लाइन-आइटम ऑर्डर्स देखें।
      </p>

      {/* Quick Select by Month - 44px Minimum Touch Targets */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
        <span className="text-xs font-bold text-[#3d4a42] dark:text-[#dbe7de] mr-1 flex items-center gap-1">
          <Calendar className="h-4 w-4 text-[#1b7a43] dark:text-[#f0b429]" />
          मासिक चालान:
        </span>
        {data.map((item) => (
          <button
            key={item.month}
            type="button"
            data-testid={`quick-select-${item.month}`}
            onClick={() => onSelectPeriod(item.month)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#dbe7de] bg-[#f6f8f5] px-4 py-2 text-xs sm:text-sm font-bold text-[#1c2420] shadow-xs hover:border-[#1b7a43] hover:bg-[#e9f4ed] hover:text-[#14532d] dark:border-[#14532d] dark:bg-[#0e3d22] dark:text-[#f6f8f5] dark:hover:bg-[#14532d] transition-all cursor-pointer"
          >
            <span>{item.month} ({item.transactions.length} ऑर्डर्स)</span>
            <ChevronRight className="h-4 w-4 text-[#5f6f66] dark:text-[#dbe7de]" />
          </button>
        ))}
      </div>

      {/* Quick Select by Machine Subsystem */}
      <div className="mt-5 pt-4 border-t border-[#dbe7de] dark:border-[#14532d] flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-bold text-[#3d4a42] dark:text-[#dbe7de] mr-1 flex items-center gap-1">
          <Layers className="h-4 w-4 text-[#1b7a43] dark:text-[#f0b429]" />
          कैटलॉग श्रेणी:
        </span>
        {Object.entries(GROUP_INFO).map(([id, grp]) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelectCategory(Number(id))}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#dbe7de] bg-white px-3 py-2 text-xs font-bold text-[#3d4a42] shadow-xs hover:border-[#1b7a43] hover:bg-[#e9f4ed] hover:text-[#14532d] dark:border-[#14532d] dark:bg-[#0e3d22] dark:text-[#f6f8f5] dark:hover:bg-[#14532d] transition-all cursor-pointer"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: grp.color }} />
            <span>{grp.hindi} ({grp.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

