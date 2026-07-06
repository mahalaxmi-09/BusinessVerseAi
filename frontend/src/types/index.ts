export interface MonthlyData {
  month: string;
  revenue: number;
  profit: number;
  expenses: number;
  inventory: number;
  orders: number;
  customers: number;
  satisfaction: number;
  stockouts: number;
}

export interface SimulationSummary {
  totalRevenue: number;
  totalProfit: number;
  avgSatisfaction: number;
  totalOrders: number;
  endingInventory: number;
}

export interface AICEOAdvice {
  problem: string;
  reason: string;
  prediction: string;
  recommendation: string;
  next_action: string;
}

export interface SmartAlert {
  id: string;
  priority: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
}

export interface SimulationResult {
  simulation: {
    monthlyData: MonthlyData[];
    summary: SimulationSummary;
  };
  alerts: SmartAlert[];
  advice: AICEOAdvice;
}
