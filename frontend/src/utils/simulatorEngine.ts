import { 
  MonthlyData, 
  SimulationSummary, 
  AICEOAdvice, 
  SmartAlert, 
  SimulationResult 
} from '../types';

export function simulateLocal(
  priceMultiplier: number,
  marketingBudget: number,
  employeesHired: number,
  branchesOpen: number,
  inventoryBuffer: number
): SimulationResult {
  const BASE_UNIT_PRICE = 120.0;
  const BASE_UNIT_COGS = 45.0;
  const EMPLOYEE_MONTHLY_SALARY = 3800.0;
  const BRANCH_MONTHLY_OVERHEAD = 6000.0;
  const HOLDING_COST_PER_UNIT = 4.0;
  
  const seasonality = [0.85, 0.90, 1.00, 1.05, 1.10, 1.15, 1.05, 0.95, 1.00, 1.10, 1.25, 1.40];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const monthlyData: MonthlyData[] = [];
  let totalRevenue = 0;
  let totalProfit = 0;
  let totalOrders = 0;
  
  let currentInventory = 1500 * branchesOpen * inventoryBuffer;
  
  for (let i = 0; i < 12; i++) {
    const monthName = months[i];
    const season = seasonality[i];
    
    const baseDemandUnits = 800 * season;
    let priceFactor = Math.max(0, 2.5 - 1.5 * priceMultiplier);
    if (priceMultiplier > 1.5) {
      priceFactor = Math.max(0, priceFactor - (priceMultiplier - 1.5) * 2.0);
    }
    
    const marketingFactor = 1.0 + 0.45 * Math.log((marketingBudget / 500.0) + 1.0);
    
    let targetDemand = Math.floor(baseDemandUnits * priceFactor * marketingFactor * branchesOpen);
    targetDemand = Math.max(50, targetDemand);
    
    const maxProcessingCapacity = employeesHired * 120;
    const ordersProcessed = Math.min(targetDemand, maxProcessingCapacity);
    
    const restockTarget = Math.floor(targetDemand * inventoryBuffer);
    currentInventory += restockTarget;
    
    const ordersFulfilled = Math.min(ordersProcessed, Math.floor(currentInventory));
    currentInventory = Math.max(0, currentInventory - ordersFulfilled);
    
    const stockouts = Math.max(0, targetDemand - ordersFulfilled);
    
    const fulfillmentRate = targetDemand > 0 ? ordersFulfilled / targetDemand : 1.0;
    const satisfactionDeduction = (priceMultiplier - 1.0) * 20.0 + (1.0 - fulfillmentRate) * 50.0;
    const satisfaction = Math.max(10, Math.min(100, Math.floor(90 - satisfactionDeduction + (marketingBudget / 5000.0) * 5.0)));
    
    const unitSalePrice = BASE_UNIT_PRICE * priceMultiplier;
    const revenue = ordersFulfilled * unitSalePrice;
    const cogs = ordersFulfilled * BASE_UNIT_COGS;
    
    const marketingExpense = marketingBudget;
    const laborExpense = employeesHired * EMPLOYEE_MONTHLY_SALARY;
    const overheadExpense = branchesOpen * BRANCH_MONTHLY_OVERHEAD;
    const holdingExpense = currentInventory * HOLDING_COST_PER_UNIT;
    
    const totalExpenses = marketingExpense + laborExpense + overheadExpense + holdingExpense;
    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - totalExpenses;
    
    totalRevenue += revenue;
    totalProfit += netProfit;
    totalOrders += ordersFulfilled;
    
    monthlyData.push({
      month: monthName,
      revenue: Math.round(revenue * 100) / 100,
      profit: Math.round(netProfit * 100) / 100,
      expenses: Math.round(totalExpenses * 100) / 100,
      inventory: Math.floor(currentInventory),
      orders: ordersFulfilled,
      customers: Math.floor(targetDemand * 1.25),
      satisfaction,
      stockouts
    });
  }
  
  const summary: SimulationSummary = {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100,
    avgSatisfaction: Math.round((monthlyData.reduce((acc, d) => acc + d.satisfaction, 0) / 12) * 10) / 10,
    totalOrders,
    endingInventory: Math.floor(currentInventory)
  };
  
  // Rule-based advice
  let advice: AICEOAdvice = {
    problem: "Plateau Risk in Balanced Equilibrium",
    reason: "Operations, staff, and pricing are in solid alignment, maintaining high customer satisfaction. However, without active expansion, natural inflation and competitor entry will erode margins.",
    prediction: "Margins will contract by 3-5% annually as competitors leverage dynamic pricing and automated operations.",
    recommendation: "Boost your marketing spend by 20% to capture remaining local demand, and prepare a capital plan to open a new branch next quarter.",
    next_action: "Increase marketing to $2,000 to assert market dominance, and benchmark local retail sites."
  };
  
  const avgOrdersPerMonth = totalOrders / 12;
  const requiredEmployees = Math.max(1, Math.round(avgOrdersPerMonth / 120));
  
  if (priceMultiplier > 1.4) {
    advice = {
      problem: "Severe Customer Churn Due to Overpricing",
      reason: `Pricing multiplier is set to ${priceMultiplier}x, which exceeds the customer price ceiling. At this rate, price-sensitive demand drops by over 60%, leaving assets underutilized.`,
      prediction: "Continuing at this price tier will permanently contract the active customer pool, causing sales volumes to decline even with increased marketing.",
      recommendation: "Moderate the pricing strategy to a 1.15x - 1.25x premium. This captures optimal consumer surplus while retaining 90%+ customer retention.",
      next_action: "Reduce the pricing slider to 1.20x and allocate 15% of saved capital towards localized marketing."
    };
  } else if (employeesHired < requiredEmployees) {
    advice = {
      problem: "Operational Capacity Overload (Understaffing)",
      reason: `Current staff of ${employeesHired} can handle at most ${employeesHired * 120} orders per month. However, demand is averaging ${Math.floor(avgOrdersPerMonth)} orders. You are leaving valuable orders unfulfilled.`,
      prediction: "Customer satisfaction will plummet due to long wait times and shipping delays. Employee burn-out will trigger talent churn.",
      recommendation: `Scale up the workforce. Hire at least ${requiredEmployees - employeesHired} additional full-time employees to meet baseline traffic requirements.`,
      next_action: `Slide the employees count to ${requiredEmployees} immediately and establish a staff training program.`
    };
  } else if (inventoryBuffer < 0.8) {
    advice = {
      problem: "Supply Chain Vulnerability (Low Inventory Safety Stock)",
      reason: `An inventory buffer of ${inventoryBuffer}x leaves no margin for supply chain shocks or seasonal spikes. In months like November/December, you will experience stockouts.`,
      prediction: `Lost potential revenue of up to 25% due to inventory depletion, leading to sunk marketing costs and customers switching to competitors.`,
      recommendation: "Raise the inventory buffer to 1.2x. This creates a cushion to absorb seasonal demand spikes while maintaining manageable holding costs.",
      next_action: "Adjust the inventory buffer slider to 1.20x to stabilize fulfillment rates."
    };
  } else if (marketingBudget < 1000 && summary.totalProfit > 20000) {
    advice = {
      problem: "Underfunded Customer Acquisition Funnel",
      reason: `Marketing budget is set at $${marketingBudget}/month. While current profit margins are healthy ($${summary.totalProfit.toLocaleString()}), the business is growing far below its market potential.`,
      prediction: "Growth will plateau. Competitors with higher share of voice will capture market share, increasing acquisition costs in the long run.",
      recommendation: "Increase marketing budget to $1,800/month. This will accelerate the customer fly-wheel and lower CAC through economies of scale.",
      next_action: "Increase the marketing budget slider to $1,800 to stimulate customer growth."
    };
  } else if (branchesOpen === 1 && summary.totalProfit > 100000) {
    advice = {
      problem: "Unutilized Expansion Capital",
      reason: `Single branch operation has achieved maximum efficiency and generated $${summary.totalProfit.toLocaleString()} in net profit. The local market is fully saturated, capping additional returns.`,
      prediction: "Remaining in a single location limits revenue ceiling. Growth will stall and tax liabilities will rise on idle corporate reserves.",
      recommendation: "Scale operations. Launch a second branch in an adjacent high-density commercial district to replicate the model.",
      next_action: "Move the branches slider to 2, increase staff to support the expansion, and boost marketing to build local awareness."
    };
  }
  
  // Smart Alerts
  const alerts: SmartAlert[] = [];
  if (summary.avgSatisfaction < 70) {
    alerts.push({
      id: "alert-satisfaction",
      priority: "critical",
      title: "Severe Retention Drop",
      message: `Average customer satisfaction is dangerously low (${summary.avgSatisfaction}%). Customers are abandoning your brand due to pricing or bottleneck issues.`
    });
  }
  if (summary.totalProfit < 0) {
    alerts.push({
      id: "alert-profit",
      priority: "critical",
      title: "Negative Cash Flow",
      message: `Annual net profit is negative ($${summary.totalProfit.toLocaleString()}). The current operational configuration is unsustainable.`
    });
  }
  const anyStockouts = monthlyData.some(d => d.stockouts > 50);
  if (anyStockouts) {
    alerts.push({
      id: "alert-stockouts",
      priority: "warning",
      title: "Fulfillment Stockouts",
      message: "Supply chain stockouts detected. Your inventory buffer is too low to meet peak seasonal customer demand, resulting in lost sales."
    });
  }
  const capacityDeficit = monthlyData.some(d => (employeesHired * 120) < (d.customers * 0.8));
  if (capacityDeficit) {
    alerts.push({
      id: "alert-labor",
      priority: "warning",
      title: "Labor Capacity Gap",
      message: `Headcount (${employeesHired}) is insufficient to handle incoming orders in peak months. Employees are operating at 100%+ utilization.`
    });
  }
  if (summary.avgSatisfaction >= 85 && summary.totalProfit > 10000) {
    alerts.push({
      id: "alert-brand",
      priority: "info",
      title: "Premium Brand Position",
      message: `High customer satisfaction (${summary.avgSatisfaction}%) and positive cash flow indicate strong brand health. This is an optimal baseline for scaling.`
    });
  }
  if (alerts.length === 0) {
    alerts.push({
      id: "alert-status",
      priority: "info",
      title: "Operations Balanced",
      message: "All operational metrics are within standard tolerances. No severe bottlenecks detected."
    });
  }
  
  return {
    simulation: { monthlyData, summary },
    alerts,
    advice
  };
}
