export interface Transaction {
  id: string;
  client: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
}

export interface MonthData {
  month: string;
  revenue: number;
  users: number;
  transactions: Transaction[];
}

export const mockData: MonthData[] = [
  { 
    month: "Jan", 
    revenue: 4500, 
    users: 1200, 
    transactions: [
      { id: "TX-1", client: "Acme Corp", amount: 2500, status: "Completed" },
      { id: "TX-2", client: "Globex", amount: 2000, status: "Completed" }
    ] 
  },
  { 
    month: "Feb", 
    revenue: 5200, 
    users: 1800, 
    transactions: [
      { id: "TX-3", client: "Initech", amount: 5200, status: "Pending" }
    ] 
  },
  { 
    month: "Mar", 
    revenue: 3800, 
    users: 2200, 
    transactions: [
      { id: "TX-4", client: "Stark Ind", amount: 3000, status: "Completed" },
      { id: "TX-5", client: "Wayne Ent", amount: 800, status: "Failed" }
    ] 
  }
];

export type TimeframeFilter = "all" | "q1" | "last30";

export interface DashboardMetrics {
  totalRevenue: number;
  revenueChange: number;
  activeUsers: number;
  usersChange: number;
  conversionRate: number;
  conversionChange: number;
  filteredData: MonthData[];
}

export function getMetricsForFilter(filter: TimeframeFilter): DashboardMetrics {
  let data: MonthData[] = mockData;

  if (filter === "last30") {
    data = mockData.slice(-1); // Only March
  } else if (filter === "q1" || filter === "all") {
    data = mockData; // Jan, Feb, Mar
  }

  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const activeUsers = data[data.length - 1]?.users || 0;
  
  // Specific delta values per filter scenario
  if (filter === "last30") {
    return {
      totalRevenue,
      revenueChange: -26.9, // Mar vs Feb (3800 vs 5200)
      activeUsers,
      usersChange: 22.2,    // Mar vs Feb (2200 vs 1800)
      conversionRate: 2.8,
      conversionChange: -0.8,
      filteredData: data,
    };
  }

  return {
    totalRevenue,
    revenueChange: 14.5,
    activeUsers: 5200, // Aggregate active audience
    usersChange: 18.2,
    conversionRate: 3.4,
    conversionChange: 1.2,
    filteredData: data,
  };
}

