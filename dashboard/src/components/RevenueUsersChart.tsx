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
import type { MonthlyTrendData } from '../data/krishigearsData';

interface RevenueUsersChartProps {
  data: MonthlyTrendData[];
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
    const units = payload.find((p) => p.dataKey === 'units')?.value;

    return (
      <div className="rounded-xl border border-[#dbe7de] bg-white/95 p-4 shadow-md backdrop-blur-xs dark:border-[#14532d] dark:bg-[#0e3d22]/95">
        <div className="flex items-center justify-between gap-3 border-b border-[#dbe7de] pb-2 dark:border-[#14532d]">
          <p className="font-bold text-[#1c2420] dark:text-white text-sm">
            {label} 2026 चालान व पुर्जे विवरण
          </p>
          {isSelected && (
            <span className="inline-flex items-center rounded-full bg-[#e9f4ed] px-2 py-0.5 text-[11px] font-bold text-[#14532d] dark:bg-[#14532d] dark:text-[#f6f8f5]">
              सक्रिय चयन (Selected)
            </span>
          )}
        </div>

        <div className="mt-3 space-y-2 text-xs font-semibold">
          <div className="flex items-center justify-between gap-5">
            <span className="flex items-center gap-1.5 text-[#3d4a42] dark:text-[#dbe7de]">
              <span className="h-3 w-3 rounded-full bg-[#1b7a43]" />
              टर्नओवर (Turnover):
            </span>
            <span className="font-extrabold text-[#1c2420] dark:text-white tabular-nums">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(rev ?? 0)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-5">
            <span className="flex items-center gap-1.5 text-[#3d4a42] dark:text-[#dbe7de]">
              <span className="h-3 w-3 rounded-full bg-[#9a3412]" />
              भेजे गए पुर्जे (Units):
            </span>
            <span className="font-extrabold text-[#1c2420] dark:text-white tabular-nums">
              {new Intl.NumberFormat('en-IN').format(units ?? 0)} pcs
            </span>
          </div>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#1b7a43] dark:text-[#f0b429]">
          <MousePointerClick className="h-3.5 w-3.5" />
          विस्तृत चालान देखने हेतु क्लिक करें
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
    <div className="rounded-xl border border-[#dbe7de] bg-white p-6 shadow-xs dark:border-[#14532d] dark:bg-[#14532d]/60">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#dbe7de] dark:border-[#14532d]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-[#1c2420] dark:text-white">
              मासिक पुर्जे मांग व चालान (Spares Demand &amp; Turnover)
            </h2>
            {selectedPeriod && (
              <span className="inline-flex items-center gap-1 rounded-xl bg-[#e9f4ed] pl-3 pr-1 py-0.5 text-xs font-bold text-[#14532d] dark:bg-[#0e3d22] dark:text-[#f6f8f5] border border-[#dbe7de] dark:border-[#1b7a43]">
                <span>{selectedPeriod} चयनित</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPeriod(null);
                  }}
                  className="h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-[#dbe7de] dark:hover:bg-[#14532d] text-[#14532d] dark:text-[#f6f8f5] transition-colors cursor-pointer"
                  aria-label="Clear drill-down"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-[#5f6f66] dark:text-[#dbe7de]/90 mt-0.5 max-w-2xl">
            1,746 चालू पुर्जों पर राजस्थान व पंजाब डीलर नेटवर्क की मासिक मांग। किसी भी माह पर टैप कर चालान सूची देखें।
          </p>
        </div>

        {/* Quick Month Filter Buttons - 44px Minimum Touch Target */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-[#3d4a42] dark:text-[#dbe7de] mr-1 hidden sm:inline">
            माह चुनें:
          </span>
          {data.map((item) => {
            const isSelected = selectedPeriod === item.month;
            return (
              <button
                key={item.month}
                type="button"
                data-testid={`chart-period-btn-${item.month}`}
                onClick={() => onSelectPeriod(isSelected ? null : item.month)}
                className={`min-h-[44px] min-w-[44px] px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center shadow-xs cursor-pointer ${
                  isSelected
                    ? "bg-[#1b7a43] text-white shadow-xs dark:bg-[#f0b429] dark:text-[#3d2c00]"
                    : "bg-[#f6f8f5] text-[#1c2420] hover:bg-[#e9f4ed] border border-[#dbe7de] dark:border-[#14532d] dark:bg-[#0e3d22] dark:text-[#f6f8f5] dark:hover:bg-[#14532d]"
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
              className="min-h-[44px] px-3 text-xs font-bold text-[#5f6f66] hover:text-[#1c2420] dark:text-[#dbe7de] dark:hover:text-white cursor-pointer"
            >
              रीसेट
            </button>
          )}
        </div>
      </div>

      {/* Chart Instruction Banner */}
      <div className="mt-3 flex items-center justify-between px-1 text-xs font-bold text-[#5f6f66] dark:text-[#dbe7de]">
        <span className="flex items-center gap-1.5">
          <Info className="h-4 w-4 text-[#1b7a43] dark:text-[#f0b429]" />
          सुझाव: ग्राफ के किसी भी बिंदु पर टैप कर पार्ट्स चालान देखें
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#1b7a43]" />
            टर्नओवर (₹ INR)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#9a3412]" />
            भेजे गए पार्ट्स (Units)
          </span>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="mt-4 h-72 sm:h-80 w-full" data-testid="recharts-area-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            onClick={handleChartClick}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            className="cursor-pointer"
          >
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1b7a43" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#1b7a43" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="unitsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9a3412" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#9a3412" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#dbe7de"
              className="dark:stroke-[#1b7a43]/30"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#3d4a42', fontSize: 13, fontWeight: 700 }}
              dy={10}
            />

            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#1b7a43', fontSize: 12, fontWeight: 700 }}
              tickFormatter={(val) => `₹${val >= 100000 ? `${(val / 100000).toFixed(1)}L` : `${(val / 1000).toFixed(0)}k`}`}
              dx={-5}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9a3412', fontSize: 12, fontWeight: 700 }}
              tickFormatter={(val) => `${val} pcs`}
              dx={5}
            />

            <Tooltip content={<CustomTooltip selectedPeriod={selectedPeriod} />} />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              name="Turnover"
              stroke="#1b7a43"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenueGrad)"
              activeDot={{
                r: 7,
                stroke: '#1b7a43',
                strokeWidth: 2,
                fill: '#ffffff',
                className: 'cursor-pointer',
              }}
            />

            <Area
              yAxisId="right"
              type="monotone"
              dataKey="units"
              name="Units Dispatched"
              stroke="#9a3412"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#unitsGrad)"
              activeDot={{
                r: 7,
                stroke: '#9a3412',
                strokeWidth: 2,
                fill: '#ffffff',
                className: 'cursor-pointer',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
