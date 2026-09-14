import type { FC } from 'react';
import { CheckCircle2, Clock, X, Receipt, Building2, Wrench, Package } from 'lucide-react';
import type { SparesTransaction, MonthlyTrendData } from '../data/krishigearsData';


interface DrillDownTableProps {
  selectedPeriod: string;
  monthData?: MonthlyTrendData;
  onClearSelection: () => void;
}

export const DrillDownTable: FC<DrillDownTableProps> = ({
  selectedPeriod,
  monthData,
  onClearSelection,
}) => {
  const transactions = monthData?.transactions || [];
  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalQty = transactions.reduce((sum, tx) => sum + tx.quantity, 0);

  const getStatusBadge = (status: SparesTransaction['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Dispatched / भेजा गया
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
            <Clock className="h-3.5 w-3.5" />
            Challan Issued / बिलिंग
          </span>
        );
      case 'Orderable':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400 border border-cyan-200/60 dark:border-cyan-800/60">
            <Package className="h-3.5 w-3.5" />
            Orderable / मंगाया जा सकता है
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      data-testid="drill-down-table-container"
      className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-2"
    >
      {/* Table Header / Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Granular Spares Dispatches — {selectedPeriod} 2026
            </h3>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {transactions.length} orders ({totalQty} parts)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real fitment-checked line entries dispatched during {selectedPeriod}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right sm:border-r sm:pr-4 border-slate-200 dark:border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Period Turnover
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalAmount)}
            </span>
          </div>

          <button
            type="button"
            onClick={onClearSelection}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <X className="h-3.5 w-3.5" />
            Clear Selection
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" data-testid="drill-down-table">
          <thead className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold">
                Order / PO
              </th>
              <th scope="col" className="px-5 py-3 font-semibold">
                Genuine Part SKU &amp; Particular
              </th>
              <th scope="col" className="px-5 py-3 font-semibold">
                Dealer / Counterparty
              </th>
              <th scope="col" className="px-5 py-3 font-semibold text-center">
                Qty
              </th>
              <th scope="col" className="px-5 py-3 font-semibold text-right">
                Amount (INR)
              </th>
              <th scope="col" className="px-5 py-3 font-semibold text-center">
                Dispatch Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-400">
                  No transaction records found for this period.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                >
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {tx.id}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-2">
                      <Wrench className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0 dark:text-emerald-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                            {tx.sku}
                          </span>
                          <span className="rounded-sm bg-slate-100 px-1.5 py-0.2 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            {tx.groupName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                          {tx.particular}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                      <div>
                        <span className="font-medium text-slate-900 dark:text-slate-100 text-xs block">
                          {tx.client}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          {tx.clientCity}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-center text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {tx.quantity} pcs
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-right font-bold text-slate-900 dark:text-slate-100">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(tx.amount)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-center">
                    {getStatusBadge(tx.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
