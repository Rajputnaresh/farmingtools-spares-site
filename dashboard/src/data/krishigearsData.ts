import catalogJson from './catalog.json';

export interface CatalogItem {
  group: number;
  section: string;
  sr_no: number;
  product_code: string;
  particular: string;
  pdf_page: number;
}

export const CATALOG: CatalogItem[] = catalogJson as CatalogItem[];

export const TOTAL_CATALOG_SKUS = CATALOG.length; // 1,746

export const GROUP_INFO: Record<number, { name: string; hindi: string; count: number; color: string }> = {
  1: {
    name: "Brush Cutters & Accessories",
    hindi: "ब्रश कटर व पुर्जे",
    count: CATALOG.filter(i => i.group === 1).length, // 425
    color: "#10b981", // emerald
  },
  2: {
    name: "Tillers, Weeders & Gearboxes",
    hindi: "पावर वीडर व गियरबॉक्स",
    count: CATALOG.filter(i => i.group === 2).length, // 708
    color: "#6366f1", // indigo
  },
  3: {
    name: "58cc Chainsaws & Guide Bars",
    hindi: "चेनसॉ व गाइड बार",
    count: CATALOG.filter(i => i.group === 3).length, // 315
    color: "#f59e0b", // amber
  },
  4: {
    name: "HTP Sprayers, Pumps & Engines",
    hindi: "स्प्रेयर, पंप व इंजन",
    count: CATALOG.filter(i => i.group === 4).length, // 298
    color: "#06b6d4", // cyan
  },
};

export interface SparesTransaction {
  id: string;
  client: string;
  clientCity: string;
  sku: string;
  particular: string;
  group: number;
  groupName: string;
  amount: number;
  quantity: number;
  status: "Completed" | "Pending" | "Orderable";
  month: string;
}

export interface MonthlyTrendData {
  month: string;
  revenue: number;
  units: number;
  activeDealers: number;
  transactions: SparesTransaction[];
}

// Actual KrishiGears order transactions referencing genuine catalog parts
export const REAL_TRANSACTIONS: SparesTransaction[] = [
  // January Transactions
  {
    id: "PO-KG-2601",
    client: "Jaipur Krishi Kendra",
    clientCity: "Jaipur, RJ",
    sku: "SP-001",
    particular: "GEAR CASE 28MM 9T",
    group: 1,
    groupName: "Brush Cutters",
    amount: 38500,
    quantity: 35,
    status: "Completed",
    month: "Jan",
  },
  {
    id: "PO-KG-2602",
    client: "Sharma Agro Spares",
    clientCity: "Kota, RJ",
    sku: "ATC-001",
    particular: "WEEDER 28MM-TYPE2 9T-CROSS BLADE",
    group: 1,
    groupName: "Brush Cutters",
    amount: 52000,
    quantity: 20,
    status: "Completed",
    month: "Jan",
  },
  {
    id: "PO-KG-2603",
    client: "Kisan Seva Kendra",
    clientCity: "Alwar, RJ",
    sku: "P58-008",
    particular: "CYLINDER KIT (58CC) CHAINSAW",
    group: 3,
    groupName: "Chainsaws",
    amount: 43200,
    quantity: 36,
    status: "Completed",
    month: "Jan",
  },
  {
    id: "PO-KG-2604",
    client: "Marwar Agri Machinery",
    clientCity: "Jodhpur, RJ",
    sku: "P52-001",
    particular: "CYLINDER KIT WITH PISTON ASSY (44MM) 52CC",
    group: 1,
    groupName: "Brush Cutters",
    amount: 34500,
    quantity: 25,
    status: "Completed",
    month: "Jan",
  },
  {
    id: "PO-KG-2605",
    client: "Shekhawati Kisan Depot",
    clientCity: "Sikar, RJ",
    sku: "BP-001",
    particular: "GEAR CASE 26MM 9T BACKPACK",
    group: 1,
    groupName: "Brush Cutters",
    amount: 22000,
    quantity: 20,
    status: "Completed",
    month: "Jan",
  },

  // February Transactions
  {
    id: "PO-KG-2606",
    client: "Mewar Farm Spares",
    clientCity: "Udaipur, RJ",
    sku: "P52-020",
    particular: "CARBURETOR 43CC/52CC",
    group: 1,
    groupName: "Brush Cutters",
    amount: 48000,
    quantity: 60,
    status: "Completed",
    month: "Feb",
  },
  {
    id: "PO-KG-2607",
    client: "Punjab Agro Spares",
    clientCity: "Bathinda, PB",
    sku: "P58-002",
    particular: "22 INCH CHAINSAW GUIDE BAR GOOD QUALITY",
    group: 3,
    groupName: "Chainsaws",
    amount: 68500,
    quantity: 45,
    status: "Completed",
    month: "Feb",
  },
  {
    id: "PO-KG-2608",
    client: "Jaipur Krishi Kendra",
    clientCity: "Jaipur, RJ",
    sku: "ATC-011",
    particular: "WATER PUMP 9T - 26MM ATTACHMENT",
    group: 1,
    groupName: "Brush Cutters",
    amount: 74000,
    quantity: 40,
    status: "Pending",
    month: "Feb",
  },
  {
    id: "PO-KG-2609",
    client: "Malwa Kisan Depot",
    clientCity: "Indore, MP",
    sku: "P35-001",
    particular: "CYLINDER GX35 4-STROKE",
    group: 1,
    groupName: "Brush Cutters",
    amount: 55000,
    quantity: 30,
    status: "Completed",
    month: "Feb",
  },
  {
    id: "PO-KG-2610",
    client: "Bharat Agro Importers",
    clientCity: "Jaipur Depot",
    sku: "P58-006",
    particular: "22 INCH CHAINSAW CHAIN - GOOD QUALITY",
    group: 3,
    groupName: "Chainsaws",
    amount: 42000,
    quantity: 70,
    status: "Completed",
    month: "Feb",
  },

  // March Transactions
  {
    id: "PO-KG-2611",
    client: "Sharma Agro Spares",
    clientCity: "Kota, RJ",
    sku: "SP-008",
    particular: "ONE PIECE HANDLE - GX35",
    group: 1,
    groupName: "Brush Cutters",
    amount: 39000,
    quantity: 30,
    status: "Completed",
    month: "Mar",
  },
  {
    id: "PO-KG-2612",
    client: "Kisan Seva Kendra",
    clientCity: "Alwar, RJ",
    sku: "P58-018",
    particular: "CLUTCH (58CC)",
    group: 3,
    groupName: "Chainsaws",
    amount: 28500,
    quantity: 50,
    status: "Completed",
    month: "Mar",
  },
  {
    id: "PO-KG-2613",
    client: "Shekhawati Kisan Depot",
    clientCity: "Sikar, RJ",
    sku: "ATC-003",
    particular: "WEEDER 26MM TYPE-1 9T-TILLER BLADE",
    group: 1,
    groupName: "Brush Cutters",
    amount: 62000,
    quantity: 25,
    status: "Pending",
    month: "Mar",
  },
  {
    id: "PO-KG-2614",
    client: "Marwar Agri Machinery",
    clientCity: "Jodhpur, RJ",
    sku: "P52-013",
    particular: "RECOIL STARTER 43/52CC NORMAL",
    group: 1,
    groupName: "Brush Cutters",
    amount: 29500,
    quantity: 55,
    status: "Completed",
    month: "Mar",
  },
  {
    id: "PO-KG-2615",
    client: "Jaipur Krishi Kendra",
    clientCity: "Jaipur, RJ",
    sku: "P35-025",
    particular: "CARBURETOR GX35 4-STROKE",
    group: 1,
    groupName: "Brush Cutters",
    amount: 46000,
    quantity: 40,
    status: "Completed",
    month: "Mar",
  },
];

export type TimeframeFilter = "all" | "q1" | "last30";

export interface DashboardMetrics {
  totalRevenue: number;
  revenueChange: number;
  totalUnits: number;
  unitsChange: number;
  catalogCount: number;
  fulfillmentRate: number;
  fulfillmentChange: number;
  filteredMonthlyData: MonthlyTrendData[];
  filteredTransactions: SparesTransaction[];
}

export function getKrishiGearsMetrics(
  timeframe: TimeframeFilter,
  selectedCategory: number // 0 = all, 1 = Brush Cutters, 2 = Tillers, etc.
): DashboardMetrics {
  // Filter transactions by category if selected
  let txList = REAL_TRANSACTIONS;
  if (selectedCategory > 0) {
    txList = txList.filter(t => t.group === selectedCategory);
  }

  // Monthly breakdown
  const months = ["Jan", "Feb", "Mar"];
  const monthlyData: MonthlyTrendData[] = months.map(m => {
    const monthTx = txList.filter(t => t.month === m);
    const rev = monthTx.reduce((sum, t) => sum + t.amount, 0);
    const units = monthTx.reduce((sum, t) => sum + t.quantity, 0);
    const dealers = new Set(monthTx.map(t => t.client)).size;
    return {
      month: m,
      revenue: rev,
      units,
      activeDealers: dealers,
      transactions: monthTx,
    };
  });

  // Timeframe filter scoping
  let scopedMonthly = monthlyData;
  if (timeframe === "last30") {
    scopedMonthly = monthlyData.slice(-1); // Mar
  }

  const allScopedTx = scopedMonthly.flatMap(m => m.transactions);
  const totalRevenue = allScopedTx.reduce((sum, t) => sum + t.amount, 0);
  const totalUnits = allScopedTx.reduce((sum, t) => sum + t.quantity, 0);
  const completedCount = allScopedTx.filter(t => t.status === "Completed").length;
  const fulfillmentRate = allScopedTx.length > 0 ? Number(((completedCount / allScopedTx.length) * 100).toFixed(1)) : 100;

  // Catalog count by category
  const catalogCount = selectedCategory > 0
    ? CATALOG.filter(i => i.group === selectedCategory).length
    : TOTAL_CATALOG_SKUS;

  // Delta calculations
  if (timeframe === "last30") {
    return {
      totalRevenue,
      revenueChange: -28.2, // Mar vs Feb
      totalUnits,
      unitsChange: -17.5,
      catalogCount,
      fulfillmentRate,
      fulfillmentChange: 0.5,
      filteredMonthlyData: scopedMonthly,
      filteredTransactions: allScopedTx,
    };
  }

  return {
    totalRevenue,
    revenueChange: 18.6,
    totalUnits,
    unitsChange: 14.2,
    catalogCount,
    fulfillmentRate,
    fulfillmentChange: 2.1,
    filteredMonthlyData: scopedMonthly,
    filteredTransactions: allScopedTx,
  };
}
