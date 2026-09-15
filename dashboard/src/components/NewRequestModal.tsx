import { useState, type FC, type FormEvent } from 'react';
import { X, PlusCircle, CheckCircle2, Building2, Wrench, Truck } from 'lucide-react';
import type { SparesTransaction } from '../data/krishigearsData';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newTx: SparesTransaction) => void;
}

const PRESET_DEALERS = [
  { name: "Jaipur Krishi Kendra", city: "Jaipur, RJ", origin: "Jaipur Hub" },
  { name: "Sharma Agro Spares", city: "Kota, RJ", origin: "Jaipur Hub" },
  { name: "Kisan Seva Kendra", city: "Alwar, RJ", origin: "Ludhiana Hub" },
  { name: "Marwar Agri Machinery", city: "Jodhpur, RJ", origin: "Rajkot Hub" },
  { name: "Shekhawati Kisan Depot", city: "Sikar, RJ", origin: "Jaipur Hub" },
  { name: "Mewar Farm Spares", city: "Udaipur, RJ", origin: "Rajasthan Hub" },
  { name: "Punjab Agro Spares", city: "Bathinda, PB", origin: "Ludhiana Hub" },
  { name: "Malwa Kisan Depot", city: "Indore, MP", origin: "Jaipur Hub" },
  { name: "Bharat Agro Importers", city: "Jaipur Depot", origin: "Jaipur Hub" },
];

const TRANSPORTS = [
  { name: "Jaipur Golden", code: "JG" },
  { name: "V-Trans", code: "VT" },
  { name: "Rajasthan Cargo", code: "RC" },
  { name: "Ludhiana Express", code: "LX" },
];

// Curated popular items from the 1,746 catalog for quick selection
const POPULAR_SKUS = [
  { sku: "SP-001", particular: "GEAR CASE 28MM 9T", group: 1, groupName: "Brush Cutters", price: 1100, fitment: "28mm 9T Spline Shaft" },
  { sku: "ATC-001", particular: "WEEDER 28MM-TYPE2 9T-CROSS BLADE", group: 1, groupName: "Brush Cutters", price: 2600, fitment: "28mm Type-2 Weeder" },
  { sku: "P52-020", particular: "CARBURETOR 43CC/52CC", group: 1, groupName: "Brush Cutters", price: 800, fitment: "43cc/52cc 2-Stroke" },
  { sku: "P58-008", particular: "CYLINDER KIT (58CC) CHAINSAW", group: 3, groupName: "Chainsaws", price: 1200, fitment: "58cc Chainsaw Engine" },
  { sku: "P58-002", particular: "22 INCH CHAINSAW GUIDE BAR", group: 3, groupName: "Chainsaws", price: 1520, fitment: "22 Inch Bar 0.058 Gauge" },
  { sku: "GBP-3006", particular: "171 GEAR BOX + TRANSMISSION ASSY", group: 2, groupName: "Tillers & Weeders", price: 7250, fitment: "171/105 Rotary Gearbox" },
  { sku: "GBP-3008", particular: "171 GEAR BOX ASSY", group: 2, groupName: "Tillers & Weeders", price: 6200, fitment: "171 Complete Gearbox" },
  { sku: "GE-2010", particular: "gasoline 170F piston assy STD", group: 2, groupName: "Tillers & Weeders", price: 650, fitment: "170F 7HP Petrol Weeder" },
  { sku: "DE-1001", particular: "diesel 173F air cooled diesel crankcase", group: 2, groupName: "Tillers & Weeders", price: 3750, fitment: "173F Diesel Engine" },
  { sku: "FMP-1004", particular: "CARBURETTOR ASSEMBLY 120K", group: 4, groupName: "Sprayers & Pumps", price: 850, fitment: "120K Mist Fogger" },
  { sku: "FMP-1001", particular: "CYLINDER TUBE ASSY 120K", group: 4, groupName: "Sprayers & Pumps", price: 1160, fitment: "120K Thermal Fogger" },
  { sku: "ABS-013", particular: "6205 Bearing", group: 4, groupName: "Sprayers & Pumps", price: 200, fitment: "Boom Sprayer Pump Drive" },
];

export const NewRequestModal: FC<NewRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const [dealerIdx, setDealerIdx] = useState<number>(0);
  const [customDealer, setCustomDealer] = useState<string>('');
  const [customCity, setCustomCity] = useState<string>('');
  const [selectedSkuIdx, setSelectedSkuIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(20);
  const [transportName, setTransportName] = useState<string>('Jaipur Golden');
  const [status, setStatus] = useState<'Completed' | 'Pending'>('Completed');
  const [notes, setNotes] = useState<string>('');

  const selectedPart = POPULAR_SKUS[selectedSkuIdx] || POPULAR_SKUS[0];
  const unitPrice = selectedPart.price;
  const totalAmount = quantity * unitPrice;

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    const isCustom = dealerIdx === -1;
    const client = isCustom ? (customDealer.trim() || 'Custom Dealer') : PRESET_DEALERS[dealerIdx].name;
    const clientCity = isCustom ? (customCity.trim() || 'Rajasthan') : PRESET_DEALERS[dealerIdx].city;
    const dispatchOrigin = isCustom ? 'Jaipur Hub' : PRESET_DEALERS[dealerIdx].origin;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const transportCode = TRANSPORTS.find(t => t.name === transportName)?.code || 'KG';
    const biltyNumber = `${transportCode}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newTx: SparesTransaction = {
      id: `PO-KG-26${randomSuffix.toString().slice(-2)}`,
      client,
      clientCity,
      sku: selectedPart.sku,
      particular: selectedPart.particular,
      group: selectedPart.group,
      groupName: selectedPart.groupName,
      amount: totalAmount,
      quantity,
      status,
      month: 'Mar', // current active period
      transportName,
      biltyNumber,
      dispatchOrigin,
      fitmentNote: notes.trim() || selectedPart.fitment,
      isNew: true,
    };

    onSubmit(newTx);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-request-title"
      data-testid="new-request-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-[#dbe7de] bg-white p-6 shadow-xl dark:border-[#14532d] dark:bg-[#0e3d22] text-[#1c2420] dark:text-[#f6f8f5] my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dbe7de] pb-4 dark:border-[#14532d]">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-[#e9f4ed] text-[#1b7a43] flex items-center justify-center dark:bg-[#14532d] dark:text-[#f6f8f5]">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 id="new-request-title" className="text-base font-extrabold text-[#1c2420] dark:text-white leading-tight">
                नया नेटवर्क मांग अनुरोध • New Network Request
              </h2>
              <p className="text-xs font-semibold text-[#5f6f66] dark:text-[#dbe7de]/80">
                डीलर केंद्र से प्राप्त पुर्जा मांग चालान दर्ज करें
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            data-testid="close-new-request-modal-btn"
            className="h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-[#e9f4ed] text-[#5f6f66] hover:text-[#1c2420] dark:hover:bg-[#14532d] dark:text-[#dbe7de] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="mt-5 space-y-4 text-xs font-bold">
          {/* Dealer Selection */}
          <div>
            <label htmlFor="dealer-select" className="block text-xs font-bold text-[#3d4a42] dark:text-[#dbe7de] mb-1.5 flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-[#1b7a43]" />
              <span>डीलर केंद्र (Dealer Network Node)</span>
            </label>
            <select
              id="dealer-select"
              data-testid="dealer-select"
              value={dealerIdx}
              onChange={(e) => setDealerIdx(Number(e.target.value))}
              className="w-full h-11 min-h-[44px] rounded-xl border border-[#dbe7de] bg-[#f6f8f5] px-3 text-xs font-bold text-[#1c2420] focus:border-[#1b7a43] focus:bg-white focus:outline-hidden dark:border-[#14532d] dark:bg-[#14532d] dark:text-white"
            >
              {PRESET_DEALERS.map((d, i) => (
                <option key={d.name} value={i}>
                  {d.name} ({d.city})
                </option>
              ))}
              <option value={-1}>+ अन्य नया डीलर (Custom Dealer)...</option>
            </select>

            {dealerIdx === -1 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  type="text"
                  placeholder="डीलर नाम (उदा. Sheetal Motors)"
                  value={customDealer}
                  onChange={(e) => setCustomDealer(e.target.value)}
                  required
                  className="h-11 min-h-[44px] rounded-xl border border-[#dbe7de] bg-white px-3 text-xs font-semibold text-[#1c2420] dark:border-[#14532d] dark:bg-[#14532d] dark:text-white"
                />
                <input
                  type="text"
                  placeholder="शहर/राज्य (उदा. Bikaner, RJ)"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  required
                  className="h-11 min-h-[44px] rounded-xl border border-[#dbe7de] bg-white px-3 text-xs font-semibold text-[#1c2420] dark:border-[#14532d] dark:bg-[#14532d] dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Genuine SKU Selection */}
          <div>
            <label htmlFor="part-select" className="block text-xs font-bold text-[#3d4a42] dark:text-[#dbe7de] mb-1.5 flex items-center gap-1.5">
              <Wrench className="h-4 w-4 text-[#1b7a43]" />
              <span>कैटलॉग पुर्जा (Genuine Part SKU - 1,746 Available)</span>
            </label>
            <select
              id="part-select"
              data-testid="part-select"
              value={selectedSkuIdx}
              onChange={(e) => setSelectedSkuIdx(Number(e.target.value))}
              className="w-full h-11 min-h-[44px] rounded-xl border border-[#dbe7de] bg-[#f6f8f5] px-3 text-xs font-bold text-[#1c2420] focus:border-[#1b7a43] focus:bg-white focus:outline-hidden dark:border-[#14532d] dark:bg-[#14532d] dark:text-white"
            >
              {POPULAR_SKUS.map((p, i) => (
                <option key={p.sku} value={i}>
                  [{p.sku}] {p.particular} — ₹{p.price}/pc ({p.groupName})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & Transport Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="req-qty" className="block text-xs font-bold text-[#3d4a42] dark:text-[#dbe7de] mb-1.5">
                मात्रा (Quantity in pcs)
              </label>
              <input
                id="req-qty"
                data-testid="req-qty-input"
                type="number"
                min={1}
                max={5000}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                required
                className="w-full h-11 min-h-[44px] rounded-xl border border-[#dbe7de] bg-[#f6f8f5] px-3 text-xs font-extrabold text-[#1c2420] tabular-nums dark:border-[#14532d] dark:bg-[#14532d] dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="transport-select" className="block text-xs font-bold text-[#3d4a42] dark:text-[#dbe7de] mb-1.5 flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-[#1b7a43]" />
                <span>ट्रांसपोर्ट पार्टनर</span>
              </label>
              <select
                id="transport-select"
                data-testid="transport-select"
                value={transportName}
                onChange={(e) => setTransportName(e.target.value)}
                className="w-full h-11 min-h-[44px] rounded-xl border border-[#dbe7de] bg-[#f6f8f5] px-3 text-xs font-bold text-[#1c2420] dark:border-[#14532d] dark:bg-[#14532d] dark:text-white"
              >
                {TRANSPORTS.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold text-[#3d4a42] dark:text-[#dbe7de] mb-1.5">
              चालान स्थिति (Dispatch Status)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                data-testid="status-completed-btn"
                onClick={() => setStatus('Completed')}
                className={`h-11 min-h-[44px] rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer ${
                  status === 'Completed'
                    ? 'bg-[#1b7a43] text-white border-[#1b7a43]'
                    : 'bg-[#f6f8f5] text-[#3d4a42] border-[#dbe7de] dark:bg-[#14532d] dark:text-[#dbe7de] dark:border-[#14532d]'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>भेजा गया (Dispatched)</span>
              </button>
              <button
                type="button"
                data-testid="status-pending-btn"
                onClick={() => setStatus('Pending')}
                className={`h-11 min-h-[44px] rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer ${
                  status === 'Pending'
                    ? 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]'
                    : 'bg-[#f6f8f5] text-[#3d4a42] border-[#dbe7de] dark:bg-[#14532d] dark:text-[#dbe7de] dark:border-[#14532d]'
                }`}
              >
                <span>बिलिंग (Pending Challan)</span>
              </button>
            </div>
          </div>

          {/* Fitment Notes */}
          <div>
            <label htmlFor="fitment-notes" className="block text-xs font-bold text-[#3d4a42] dark:text-[#dbe7de] mb-1.5">
              फिटमेंट व विशेष टिप्पणी (Fitment Specification / Notes)
            </label>
            <input
              id="fitment-notes"
              data-testid="fitment-notes-input"
              type="text"
              placeholder={`उदा. ${selectedPart.fitment}`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-11 min-h-[44px] rounded-xl border border-[#dbe7de] bg-[#f6f8f5] px-3 text-xs font-semibold text-[#1c2420] focus:border-[#1b7a43] focus:bg-white focus:outline-hidden dark:border-[#14532d] dark:bg-[#14532d] dark:text-white"
            />
          </div>

          {/* Amount Calculation Summary Card */}
          <div className="rounded-xl border border-[#dbe7de] bg-[#e9f4ed] p-3.5 flex items-center justify-between dark:border-[#1b7a43] dark:bg-[#14532d]/60">
            <div>
              <span className="text-[11px] font-bold text-[#14532d] dark:text-[#dbe7de] block uppercase tracking-wider">
                अनुमानित चालान राशि (Total Order Value)
              </span>
              <span className="text-xs text-[#5f6f66] dark:text-[#dbe7de]/80">
                {quantity} pcs × ₹{unitPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-[#14532d] dark:text-white tabular-nums">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#dbe7de] dark:border-[#14532d]">
            <button
              type="button"
              onClick={onClose}
              data-testid="cancel-new-request-btn"
              className="h-11 min-h-[44px] px-4 rounded-xl border border-[#dbe7de] bg-white text-xs font-bold text-[#5f6f66] hover:bg-[#f6f8f5] dark:border-[#14532d] dark:bg-[#14532d] dark:text-[#dbe7de] cursor-pointer"
            >
              रद्द करें (Cancel)
            </button>
            <button
              type="submit"
              data-testid="submit-new-request-btn"
              className="h-11 min-h-[44px] px-5 rounded-xl bg-[#1b7a43] text-white text-xs font-extrabold shadow-sm hover:bg-[#14532d] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>अनुरोध सहेजें व चालान बनाएं</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
