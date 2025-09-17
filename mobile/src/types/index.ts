// Alert types
export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  status: "active" | "acknowledged" | "resolved";
  timestamp: string;
  resource: string;
  category: string;
}

// Cost types
export interface CostData {
  date: string;
  cost: number;
  predicted: number;
}

export interface CostSummary {
  currentCost: number;
  previousCost: number;
  change: number;
  changePercent: number;
  totalSavings: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// Navigation types
export type RootTabParamList = {
  Dashboard: undefined;
  Alerts: undefined;
  Cost: undefined;
  Settings: undefined;
};
