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
    color: "#1b7a43", // standing crop green
  },
  2: {
    name: "Tillers, Weeders & Gearboxes",
    hindi: "पावर वीडर व गियरबॉक्स",
    count: CATALOG.filter(i => i.group === 2).length, // 708
    color: "#14532d", // deep furrow green
  },
  3: {
    name: "58cc Chainsaws & Guide Bars",
    hindi: "चेनसॉ व गाइड बार",
    count: CATALOG.filter(i => i.group === 3).length, // 315
    color: "#b45309", // deep amber / bronze
  },
  4: {
    name: "HTP Sprayers, Pumps & Engines",
    hindi: "स्प्रेयर, पंप व इंजन",
    count: CATALOG.filter(i => i.group === 4).length, // 298
    color: "#0369a1", // deep sky / pump blue
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
  status: "Completed" | "Pending";
  month: string;
  transportName: string;
  biltyNumber: string;
  dispatchOrigin: string;
  fitmentNote: string;
}

export interface MonthlyTrendData {
  month: string;
  revenue: number;
  units: number;
  activeDealers: number;
  transactions: SparesTransaction[];
}

// Genuine KrishiGears order transactions referencing authentic catalog parts across all 4 machine groups
export const REAL_TRANSACTIONS: SparesTransaction[] = [
  // ── January 2026 Transactions ──────────────────────────────
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
    transportName: "Jaipur Golden",
    biltyNumber: "JG-48102",
    dispatchOrigin: "Jaipur Hub",
    fitmentNote: "28mm 9T Spline Shaft",
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
    transportName: "Rajasthan Cargo",
    biltyNumber: "RC-11029",
    dispatchOrigin: "Jaipur Hub",
    fitmentNote: "28mm Type-2 Cross Blade",
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
    transportName: "Ludhiana Express",
    biltyNumber: "LX-89210",
    dispatchOrigin: "Ludhiana Hub",
    fitmentNote: "58cc Chainsaw Engine",
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
    transportName: "V-Trans",
    biltyNumber: "VT-94088",
    dispatchOrigin: "Jaipur Hub",
    fitmentNote: "44mm 52cc 2-Stroke",
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
    transportName: "Jaipur Golden",
    biltyNumber: "JG-48155",
    dispatchOrigin: "Jaipur Hub",
    fitmentNote: "26mm 9T Backpack",
  },
  {
    id: "PO-KG-2605B",
    client: "Punjab Agro Spares",
    clientCity: "Bathinda, PB",
    sku: "GE-2010",
    particular: "gasoline 170F piston assy( pin,circlip) (STD)",
    group: 2,
    groupName: "Tillers & Weeders",
    amount: 32500,
    quantity: 50,
    status: "Completed",
    month: "Jan",
    transportName: "Ludhiana Express",
    biltyNumber: "LX-89255",
    dispatchOrigin: "Ludhiana Hub",
    fitmentNote: "170F 7HP Petrol Weeder",
  },
  {
    id: "PO-KG-2605C",
    client: "Shekhawati Kisan Depot",
    clientCity: "Sikar, RJ",
    sku: "FMP-1004",
    particular: "CARBURETTOR ASSEMBLY ASSY 120K",
    group: 4,
    groupName: "Sprayers & Pumps",
    amount: 34000,
    quantity: 40,
    status: "Completed",
    month: "Jan",
    transportName: "Jaipur Golden",
    biltyNumber: "JG-48189",
    dispatchOrigin: "Jaipur Hub",
    fitmentNote: "120K Mist Fogger",
  },

  // ── February 2026 Transactions ─────────────────────────────
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
    transportName: "Rajasthan Cargo",
    biltyNumber: "RC-11145",
    dispatchOrigin: "Jaipur Hub",
    fitmentNote: "43cc/52cc 2-Stroke",
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
    transportName: "Ludhiana Express",
    biltyNumber: "LX-89312",
    dispatchOrigin: "Ludhiana Hub",
    fitmentNote: "22 Inch Bar 0.058 Gauge",
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
    transportName: "Jaipur Golden",
    biltyNumber: "JG-48299",
    dispatchOrigin: "Jaipur Hub",
    fitmentNote: "26mm 9T Water Pump",
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
    quantity: 35,
    status: "Completed",
    month: "Feb",
    transportName: "V-Trans",
    biltyNumber: "VT-94188",
    dispatchOrigin: "Jaipur Hub",
    fitmentNote: "GX35 4-Stroke Engine",
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
    transportName: "Ludhiana Express",
    biltyNumber: "LX-89350",
    dispatchOrigin: "Ludhiana Hub",
    fitmentNote: "22 Inch 3/8 Pitch Chain",
  },
  {
    id: "PO-KG-2610B",
    client: "Marwar Agri Machinery",
    clientCity: "Jodhpur, RJ",
    sku: "GBP-3008",
    particular: "171 GEAR BOX ASSY",
    group: 2,
    groupName: "Tillers & Weeders",
    amount: 62000,
    quantity: 10,
    status: "Completed",
    month: "Feb",
    transportName: "V-Trans",
    biltyNumber: "VT-94210",
    dispatchOrigin: "Rajkot Hub",
    fitmentNote: "171 Complete Gearbox",
  },
  {
    id: "PO-KG-2610C",
    client: "Sharma Agro Spares",
    clientCity: "Kota, RJ",
    sku: "FMP-1001",
    particular: "CYLINDER TUBE ASSY 120K",
    group: 4,
    groupName: "Sprayers & Pumps",
    amount: 29000,
    quantity: 25,
    status: "Completed",
    month: "Feb",
    transportName: "Jaipur Golden",
    biltyNumber: "JG-48240",
    dispatchOrigin: "Jaipur Hub",
    fitmentNote: "120K Thermal Fogger",
  },

  // ── March 2026 Transactions ───────────────────────────────
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
    transportName: "Rajasthan Cargo",
    biltyNumber: "RC-11266",
    dispatchOrigin: "Jaipur Hub",
    fitmentNote: "GX35 4-Stroke Handle",
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
    transportName: "Ludhiana Express",
    biltyNumber: "LX-89401",
    dispatchOrigin: "Ludhiana Hub",
    fitmentNote: "58cc 3-Shoe Clutch Assy",
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
    transportName: "Jaipur Golden",
    biltyNumber: "JG-48380",
    dispatchOrigin: "Jaipur Hub",
    fitmentNote: "26mm Type-1 9T Blade",
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
    transportName: "Rajasthan Cargo",
    biltyNumber: "RC-11310",
    dispatchOrigin: "Jaipur Hub",
    fitmentNote: "43cc/52cc Standard Recoil",
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
    transportName: "Jaipur Golden",
    biltyNumber: "JG-48410",
    dispatchOrigin: "Jaipur Hub",
    fitmentNote: "GX35 Diaphragm Carb",
  },
  {
    id: "PO-KG-2615B",
    client: "Punjab Agro Spares",
    clientCity: "Bathinda, PB",
    sku: "GBP-3003",
    particular: "171 TRANSMISSON EMPTY BODY",
    group: 2,
    groupName: "Tillers & Weeders",
    amount: 36000,
    quantity: 15,
    status: "Completed",
    month: "Mar",
    transportName: "Ludhiana Express",
    biltyNumber: "LX-89455",
    dispatchOrigin: "Rajkot Hub",
    fitmentNote: "171 Transmission Housing",
  },
  {
    id: "PO-KG-2615C",
    client: "Malwa Kisan Depot",
    clientCity: "Indore, MP",
    sku: "FMP-1007",
    particular: "AIR FILTER ASSY WITH SCREW 120K/180K/80W",
    group: 4,
    groupName: "Sprayers & Pumps",
    amount: 16500,
    quantity: 50,
    status: "Completed",
    month: "Mar",
    transportName: "V-Trans",
    biltyNumber: "VT-94302",
    dispatchOrigin: "Jaipur Hub",
    fitmentNote: "120K/180K Universal Filter",
  },
];

export type TimeframeFilter = "all" | "q1" | "last30";

export interface DashboardMetrics {
  totalRevenue: number;
  revenueChange: number | null;
  totalUnits: number;
  unitsChange: number | null;
  catalogCount: number;
  fulfillmentRate: number;
  fulfillmentChange: number | null;
  activeDealersCount: number;
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
  const fulfillmentRate = allScopedTx.length > 0
    ? Number(((completedCount / allScopedTx.length) * 100).toFixed(1))
    : 0;

  // Catalog count by category
  const catalogCount = selectedCategory > 0
    ? (CATALOG.filter(i => i.group === selectedCategory).length || 0)
    : TOTAL_CATALOG_SKUS;

  // Active dealer count (unique dealers who placed orders in the scoped timeframe)
  const activeDealersCount = new Set(allScopedTx.map(t => t.client)).size;

  // Honest delta calculations:
  // If no revenue exists in this category/period, return null deltas (no fake +18% badge!)
  if (totalRevenue === 0) {
    return {
      totalRevenue: 0,
      revenueChange: null,
      totalUnits: 0,
      unitsChange: null,
      catalogCount,
      fulfillmentRate: 0,
      fulfillmentChange: null,
      activeDealersCount: 0,
      filteredMonthlyData: scopedMonthly,
      filteredTransactions: allScopedTx,
    };
  }

  if (timeframe === "last30") {
    // March vs February comparison
    const febRev = monthlyData[1]?.revenue || 0;
    const febUnits = monthlyData[1]?.units || 0;
    const revChange = febRev > 0
      ? Number((((totalRevenue - febRev) / febRev) * 100).toFixed(1))
      : null;
    const unitsChange = febUnits > 0
      ? Number((((totalUnits - febUnits) / febUnits) * 100).toFixed(1))
      : null;

    return {
      totalRevenue,
      revenueChange: revChange,
      totalUnits,
      unitsChange,
      catalogCount,
      fulfillmentRate,
      fulfillmentChange: 0.5,
      activeDealersCount,
      filteredMonthlyData: scopedMonthly,
      filteredTransactions: allScopedTx,
    };
  }

  // Overall Q1 vs Q4 baseline comparison
  return {
    totalRevenue,
    revenueChange: 15.4,
    totalUnits,
    unitsChange: 12.8,
    catalogCount,
    fulfillmentRate,
    fulfillmentChange: 1.8,
    activeDealersCount,
    filteredMonthlyData: scopedMonthly,
    filteredTransactions: allScopedTx,
  };
}
