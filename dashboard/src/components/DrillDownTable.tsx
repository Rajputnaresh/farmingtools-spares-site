import type { FC } from 'react';
import { CheckCircle2, Clock, AlertCircle, X, Receipt, Building2 } from 'lucide-react';
import type { MonthData, Transaction } from '../data/mockData';

interface DrillDownTableProps {
  selectedPeriod: string;
  monthData?: MonthData;
  onClearSelection: () => void;
}

export const DrillDownTable: FC<DrillDownTableProps> = ({

  selectedPeriod,
  monthData,
  onClearSelection,
}) => {
  const transactions = monthData?.transactions || [];
  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
            <Clock className="h-3.5 w-3.5" />
            Pending
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60">
            <AlertCircle className="h-3.5 w-3.5" />
            Failed
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
              Granular Transactions — {selectedPeriod}
            </h3>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {transactions.length} {transactions.length === 1 ? 'record' : 'records'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Itemized audit entries recorded during {selectedPeriod}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right sm:border-r sm:pr-4 border-slate-200 dark:border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Period Subtotal
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalAmount)}
            </span>
          </div>

          <button
            type="button"
            onClick={onClearSelection}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <X className="h-3.5 w-3.5" />
            Clear Drill-Down
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" data-testid="drill-down-table">
          <thead className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">
                Transaction ID
              </th>
              <th scope="col" className="px-6 py-3 font-semibold">
                Client / Counterparty
              </th>
              <th scope="col" className="px-6 py-3 font-semibold text-right">
                Amount (USD)
              </th>
              <th scope="col" className="px-6 py-3 font-semibold text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                  No transaction records found for this period.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {tx.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {tx.client}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-slate-900 dark:text-slate-100">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
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
