import { useState, useMemo, type FC } from 'react';
import { CheckCircle2, Clock, X, Receipt, Building2, Wrench, Package, Search, Share2, Filter } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Completed' | 'Pending'>('ALL');

  const rawTransactions = monthData?.transactions || [];

  // Filtered transactions by search query and status
  const filteredTransactions = useMemo(() => {
    return rawTransactions.filter((tx) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        tx.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.particular.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.clientCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || tx.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rawTransactions, searchQuery, statusFilter]);

  const totalAmount = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalQty = filteredTransactions.reduce((sum, tx) => sum + tx.quantity, 0);

  const getStatusBadge = (status: SparesTransaction['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e9f4ed] px-3 py-1 text-xs font-bold text-[#14532d] dark:bg-[#0e3d22] dark:text-[#f6f8f5] border border-[#dbe7de] dark:border-[#1b7a43]">
            <CheckCircle2 className="h-4 w-4 text-[#1b7a43]" />
            भेजा गया (Dispatched)
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-bold text-[#92400e] dark:bg-[#0e3d22] dark:text-[#f0b429] border border-[#fde68a] dark:border-[#f0b429]/60">
            <Clock className="h-4 w-4 text-[#f0b429]" />
            बिलिंग (Challan Issued)
          </span>
        );
      case 'Orderable':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e0f2fe] px-3 py-1 text-xs font-bold text-[#0369a1] dark:bg-[#0e3d22] dark:text-[#38bdf8] border border-[#bae6fd]">
            <Package className="h-4 w-4" />
            मंगाया जा सकता है
          </span>
        );
      default:
        return null;
    }
  };

  const createWhatsAppLink = (tx: SparesTransaction) => {
    const text = `नमस्ते! कृषि गियर्स (FarmingTools.in) द्वारा आपका ऑर्डर चालान विवरण:\n` +
      `• ऑर्डर नंबर: ${tx.id}\n` +
      `• पुर्जा (SKU): ${tx.sku} - ${tx.particular}\n` +
      `• डीलर: ${tx.client} (${tx.clientCity})\n` +
      `• मात्रा: ${tx.quantity} pcs\n` +
      `• कुल राशि: ₹${tx.amount.toLocaleString('en-IN')}\n` +
      `• स्थिति: ${tx.status === 'Completed' ? 'डिस्पैच पूर्ण (Dispatched)' : 'चालान जारी (Pending Dispatch)'}\n\n` +
      `किसी भी सहायता हेतु कृषि गियर्स जयपुर से संपर्क करें।`;

    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  return (
    <div
      data-testid="drill-down-table-container"
      className="rounded-xl border border-[#dbe7de] bg-white shadow-xs dark:border-[#14532d] dark:bg-[#14532d]/40 overflow-hidden transition-all duration-300"
    >
      {/* Table Header / Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 border-b border-[#dbe7de] dark:border-[#14532d] bg-[#f6f8f5]/80 dark:bg-[#0e3d22]/50">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-[#1b7a43] dark:text-[#f0b429]" />
            <h3 className="text-base font-extrabold text-[#1c2420] dark:text-white">
              विस्तृत पुर्जे चालान — {selectedPeriod} 2026 (Line-Item Dispatches)
            </h3>
            <span className="rounded-md bg-[#e9f4ed] px-2.5 py-0.5 text-xs font-bold text-[#14532d] dark:bg-[#14532d] dark:text-[#f6f8f5] border border-[#dbe7de] dark:border-[#1b7a43]">
              {filteredTransactions.length} ऑर्डर्स ({totalQty} पार्ट्स)
            </span>
          </div>
          <p className="text-xs font-medium text-[#5f6f66] dark:text-[#dbe7de]/90 mt-0.5">
            {selectedPeriod} 2026 में डीलर केंद्रों को भेजे गए असली फिटमेंट-जांच पूर्ण पार्ट्स।
          </p>
        </div>

        <div className="flex items-center gap-3 self-end lg:self-auto">
          <div className="text-right sm:border-r sm:pr-4 border-[#dbe7de] dark:border-[#14532d]">
            <span className="text-xs uppercase font-bold tracking-wider text-[#5f6f66] dark:text-[#dbe7de] block">
              फ़िल्टर टर्नओवर
            </span>
            <span className="text-base font-extrabold text-[#1c2420] dark:text-white tabular-nums">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalAmount)}
            </span>
          </div>

          <button
            type="button"
            onClick={onClearSelection}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#dbe7de] bg-white px-3.5 text-xs font-bold text-[#1c2420] shadow-xs hover:bg-[#e9f4ed] dark:border-[#14532d] dark:bg-[#0e3d22] dark:text-[#f6f8f5] dark:hover:bg-[#14532d] transition-colors"
          >
            <X className="h-4 w-4" />
            चयन हटाएं (Clear)
          </button>
        </div>
      </div>

      {/* Operational Triage Controls: Live Search & Status Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white dark:bg-[#14532d]/20 border-b border-[#dbe7de] dark:border-[#14532d]">
        {/* Live Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <label htmlFor="sku-search" className="sr-only">
            पार्ट्स कोड या डीलर खोजें (Search SKU / Dealer)
          </label>
          <input
            id="sku-search"
            type="text"
            placeholder="SKU (उदा. SP-001) या डीलर खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] rounded-xl border border-[#dbe7de] bg-[#f6f8f5] pl-10 pr-4 text-xs sm:text-sm font-semibold text-[#1c2420] placeholder-[#5f6f66] focus:border-[#1b7a43] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#f0b429] dark:border-[#14532d] dark:bg-[#0e3d22] dark:text-white dark:placeholder-[#dbe7de]/60"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f6f66] dark:text-[#dbe7de]" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5f6f66] hover:text-[#1c2420]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-[#5f6f66] dark:text-[#dbe7de] mr-1 hidden sm:flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" />
            स्थिति:
          </span>
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`min-h-[44px] px-3.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              statusFilter === 'ALL'
                ? "bg-[#1b7a43] text-white shadow-xs"
                : "bg-[#f6f8f5] text-[#1c2420] hover:bg-[#e9f4ed] border border-[#dbe7de] dark:bg-[#0e3d22] dark:text-[#f6f8f5] dark:border-[#14532d]"
            }`}
          >
            सभी ({rawTransactions.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('Completed')}
            className={`min-h-[44px] px-3.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              statusFilter === 'Completed'
                ? "bg-[#1b7a43] text-white shadow-xs"
                : "bg-[#f6f8f5] text-[#1c2420] hover:bg-[#e9f4ed] border border-[#dbe7de] dark:bg-[#0e3d22] dark:text-[#f6f8f5] dark:border-[#14532d]"
            }`}
          >
            भेजा गया (Dispatched)
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('Pending')}
            className={`min-h-[44px] px-3.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              statusFilter === 'Pending'
                ? "bg-[#f0b429] text-[#3d2c00] shadow-xs"
                : "bg-[#f6f8f5] text-[#1c2420] hover:bg-[#e9f4ed] border border-[#dbe7de] dark:bg-[#0e3d22] dark:text-[#f6f8f5] dark:border-[#14532d]"
            }`}
          >
            बिलिंग (Pending Challan)
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" data-testid="drill-down-table">
          <thead className="border-b border-[#dbe7de] bg-[#f6f8f5] text-xs uppercase font-extrabold tracking-wider text-[#3d4a42] dark:border-[#14532d] dark:bg-[#0e3d22]/80 dark:text-[#dbe7de]">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                ऑर्डर / PO
              </th>
              <th scope="col" className="px-5 py-3.5">
                असली पार्ट SKU व विवरण
              </th>
              <th scope="col" className="px-5 py-3.5">
                डीलर / केंद्र
              </th>
              <th scope="col" className="px-5 py-3.5 text-center">
                मात्रा (Qty)
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                राशि (INR)
              </th>
              <th scope="col" className="px-5 py-3.5 text-center">
                चालान स्थिति
              </th>
              <th scope="col" className="px-5 py-3.5 text-center">
                WhatsApp
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dbe7de] dark:divide-[#14532d]">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm font-semibold text-[#5f6f66] dark:text-[#dbe7de]">
                  कोई चालान रिकॉर्ड नहीं मिला। कृपया खोज शब्द बदलें।
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="transition-colors hover:bg-[#e9f4ed]/50 dark:hover:bg-[#14532d]/60"
                >
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-bold text-[#1c2420] dark:text-white tabular-nums">
                    {tx.id}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-2.5">
                      <Wrench className="h-4 w-4 text-[#1b7a43] dark:text-[#f0b429] mt-0.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-[#1c2420] dark:text-white">
                            {tx.sku}
                          </span>
                          <span className="rounded-md bg-[#e9f4ed] px-2 py-0.5 text-xs font-bold text-[#14532d] dark:bg-[#0e3d22] dark:text-[#f6f8f5] border border-[#dbe7de] dark:border-[#1b7a43]">
                            {tx.groupName}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#3d4a42] dark:text-[#dbe7de] mt-1">
                          {tx.particular}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#5f6f66] dark:text-[#dbe7de]" />
                      <div>
                        <span className="font-bold text-[#1c2420] dark:text-white text-xs block">
                          {tx.client}
                        </span>
                        <span className="text-xs font-medium text-[#5f6f66] dark:text-[#dbe7de]/80">
                          {tx.clientCity}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-center text-xs font-extrabold text-[#1c2420] dark:text-white tabular-nums">
                    {tx.quantity} pcs
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-right font-extrabold text-[#1c2420] dark:text-white tabular-nums text-sm">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(tx.amount)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-center">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-center">
                    <a
                      href={createWhatsAppLink(tx)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-[#25d366] text-white hover:bg-[#1ebc59] shadow-xs px-3 py-1 text-xs font-bold transition-transform hover:scale-105"
                      title="डीलर को WhatsApp चालान विवरण भेजें"
                      aria-label={`Send WhatsApp dispatch info for ${tx.id}`}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      <span>WhatsApp</span>
                    </a>
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

