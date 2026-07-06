import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  MonthlyData, 
  SimulationSummary, 
  AICEOAdvice, 
  SmartAlert, 
  SimulationResult 
} from '../types';
import { simulateLocal } from '../utils/simulatorEngine';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content?: string;
  advice?: {
    summary: string;
    situation: string;
    root_cause: string;
    prediction: string;
    recommendation: string;
    priority: string;
    expected_outcome: string;
    confidence_score: number;
  };
  timestamp: Date;
}

interface BusinessContextType {
  // Input Levers
  priceMultiplier: number;
  marketingBudget: number;
  employeesHired: number;
  branchesOpen: number;
  inventoryBuffer: number;
  
  // Setters
  setPriceMultiplier: (val: number) => void;
  setMarketingBudget: (val: number) => void;
  setEmployeesHired: (val: number) => void;
  setBranchesOpen: (val: number) => void;
  setInventoryBuffer: (val: number) => void;
  
  // Simulation Outcomes
  monthlyData: MonthlyData[];
  summary: SimulationSummary;
  alerts: SmartAlert[];
  advice: AICEOAdvice;
  
  // Loading & Connectivity States
  isLoading: boolean;
  backendOnline: boolean;
  triggerRefresh: () => void;
  
  // AI CEO Chat Memory States
  messages: ChatMessage[];
  askAICEO: (query: string) => Promise<void>;
  aiInsight: string;
  clearHistory: () => void;

  // Hackathon Demo Overrides
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  presentationMode: boolean;
  setPresentationMode: (val: boolean) => void;
  showTour: boolean;
  setShowTour: (val: boolean) => void;
  resetDemoData: () => void;

  // Global Currency State
  currency: string;
  setCurrency: (val: string) => void;
  currencySymbol: string;

  // Global Language State
  language: string;
  setLanguage: (val: string) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const useBusinessState = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusinessState must be used within a BusinessStateProvider');
  }
  return context;
};

export const BusinessStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Global Currency State
  const [currency, setCurrencyState] = useState<string>(() => {
    return localStorage.getItem('bv_currency') || 'INR';
  });

  const setCurrency = (val: string) => {
    setCurrencyState(val);
    localStorage.setItem('bv_currency', val);
  };

  const getCurrencySymbol = () => {
    switch (currency) {
      case 'INR': return '₹';
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '₹';
    }
  };

  const currencySymbol = getCurrencySymbol();

  // Global Language State
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem('bv_language') || 'en';
  });

  const setLanguage = (val: string) => {
    setLanguageState(val);
    localStorage.setItem('bv_language', val);
  };

  // Demo Mode States
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Levers state
  const [priceMultiplier, setPriceMultiplier] = useState(1.0);
  const [marketingBudget, setMarketingBudget] = useState(1500);
  const [employeesHired, setEmployeesHired] = useState(8);
  const [branchesOpen, setBranchesOpen] = useState(1);
  const [inventoryBuffer, setInventoryBuffer] = useState(1.0);
  
  // Outputs state
  const initialResult = simulateLocal(1.0, 1500, 8, 1, 1.0);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(initialResult.simulation.monthlyData);
  const [summary, setSummary] = useState<SimulationSummary>(initialResult.simulation.summary);
  const [alerts, setAlerts] = useState<SmartAlert[]>(initialResult.alerts);
  const [advice, setAdvice] = useState<AICEOAdvice>(initialResult.advice);
  
  // Status state
  const [isLoading, setIsLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // AI CEO Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      advice: {
        summary: "TechNova Retail Pvt Ltd data files loaded.",
        situation: "Operational city grid is online. Total revenue stands at ₹3,42,500 yielding ₹52,800 in monthly profits.",
        root_cause: "High staffing turnout (8 workers) and 1 store branch optimize market conversions.",
        prediction: "Based on trends, sales are forecasted to expand by 9.5% next quarter with secure safety buffers.",
        recommendation: "Select presets on the presenter script to verify What-If outcomes.",
        priority: "Info",
        expected_outcome: "Balanced enterprise scaling",
        confidence_score: 95
      },
      timestamp: new Date()
    }
  ]);

  const [aiInsight, setAiInsight] = useState("AI Insight: All systems balanced. Safety stock buffers are sufficient for TechNova's 1,280 Units.");

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: "Operational log cleared. Ask me any question about pricing, inventory, cash runway, or branch scaling.",
        timestamp: new Date()
      }
    ]);
  }, []);

  const resetDemoData = useCallback(() => {
    setPriceMultiplier(1.15);
    setMarketingBudget(1500);
    setEmployeesHired(8);
    setBranchesOpen(1);
    setInventoryBuffer(1.2);
    setIsDemoMode(true);
    setShowTour(true);
  }, []);

  // Recalculate daily insights on lever adjustments
  useEffect(() => {
    if (isDemoMode) {
      setAiInsight("AI Insight (TechNova): Operating at ₹52,800 monthly profit margin. Safety stocks are secure across TechNova's 1,280 Units.");
    } else {
      if (priceMultiplier > 1.3) {
        setAiInsight(`AI Insight: Current pricing markup is ${priceMultiplier}x. Customer acquisition costs are rising; recommend lowering price to recapture buyer retention.`);
      } else if (employeesHired < (summary.totalOrders / 12 / 120)) {
        setAiInsight("AI Insight: Headcount deficit detected. Orders are backing up in courier queues. Increase staff count to resolve shipment delays.");
      } else if (inventoryBuffer < 0.8) {
        setAiInsight("AI Insight: safety stock safety cushion is narrow. Stockout risks stand at 25% for high-season November orders.");
      } else if (branchesOpen > 1 && summary.totalProfit < 20000) {
        setAiInsight("AI Insight: Branch expansion overhead ($12,000/mo) is draining net reserves. Optimize pricing to raise branch contribution margins.");
      } else {
        setAiInsight(`AI Insight: Operations are balanced. Net profit runs at a positive $+${Math.round(summary.totalProfit / 12).toLocaleString()}/mo.`);
      }
    }
  }, [priceMultiplier, marketingBudget, employeesHired, branchesOpen, inventoryBuffer, summary.totalProfit, summary.totalOrders, isDemoMode]);

  // Main simulation effect
  useEffect(() => {
    let active = true;
    const runSimulation = async () => {
      setIsLoading(true);
      
      const payload = {
        price_multiplier: priceMultiplier,
        marketing_budget: marketingBudget,
        employees_hired: employeesHired,
        branches_open: branchesOpen,
        inventory_buffer: inventoryBuffer
      };
      
      try {
        const response = await fetch('http://127.0.0.1:8000/api/simulate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          throw new Error('Server responded with an error');
        }
        
        const data: SimulationResult = await response.json();
        
        if (active) {
          if (isDemoMode) {
            const demoMonthly = data.simulation.monthlyData.map((d, i) => {
              const factor = 12;
              return {
                ...d,
                revenue: 342500 / factor * (1 + Math.sin(i) * 0.1),
                profit: 52800 * (1 + Math.cos(i) * 0.08),
                expenses: (342500 / factor - 52800) * (1 + Math.sin(i) * 0.05),
                inventory: 1280 + Math.sin(i) * 50,
                customers: 487 / factor + Math.cos(i) * 5
              };
            });
            setMonthlyData(demoMonthly);
            setSummary({
              totalRevenue: 342500,
              totalProfit: 52800,
              avgSatisfaction: 92,
              totalOrders: 248,
              endingInventory: 1280
            });
          } else {
            setMonthlyData(data.simulation.monthlyData);
            setSummary(data.simulation.summary);
          }
          setAlerts(data.alerts);
          setAdvice(data.advice);
          setBackendOnline(true);
        }
      } catch (err) {
        // Fall back to client-side mathematical model
        console.log("Backend offline, running in-browser Decision Intelligence simulator.");
        const localData = simulateLocal(
          priceMultiplier,
          marketingBudget,
          employeesHired,
          branchesOpen,
          inventoryBuffer
        );
        
        if (active) {
          if (isDemoMode) {
            const demoMonthly = localData.simulation.monthlyData.map((d, i) => {
              const factor = 12;
              return {
                ...d,
                revenue: 342500 / factor * (1 + Math.sin(i) * 0.1),
                profit: 52800 * (1 + Math.cos(i) * 0.08),
                expenses: (342500 / factor - 52800) * (1 + Math.sin(i) * 0.05),
                inventory: 1280 + Math.sin(i) * 50,
                customers: 487 / factor + Math.cos(i) * 5
              };
            });
            setMonthlyData(demoMonthly);
            setSummary({
              totalRevenue: 342500,
              totalProfit: 52800,
              avgSatisfaction: 92,
              totalOrders: 248,
              endingInventory: 1280
            });
          } else {
            setMonthlyData(localData.simulation.monthlyData);
            setSummary(localData.simulation.summary);
          }
          setAlerts(localData.alerts);
          setAdvice(localData.advice);
          setBackendOnline(false);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    
    runSimulation();
    
    return () => {
      active = false;
    };
  }, [priceMultiplier, marketingBudget, employeesHired, branchesOpen, inventoryBuffer, refreshTrigger, isDemoMode]);

  // Asynchronous Chat dispatcher
  const askAICEO = async (query: string) => {
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    
    const payload = {
      query,
      price_multiplier: priceMultiplier,
      marketing_budget: marketingBudget,
      employees_hired: employeesHired,
      branches_open: branchesOpen,
      inventory_buffer: inventoryBuffer
    };
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/ai-ceo/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error("API Connection failed");
      
      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: `msg-asst-${Date.now()}`,
        role: 'assistant',
        advice: data,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      // Offline fallback: call local insights selector
      const q = query ? query.toLowerCase() : '';
      let adviceObj = {
        summary: "I have analyzed your active operational layers.",
        situation: `Annual net profit is currently projected at $${summary.totalProfit.toLocaleString()}.`,
        root_cause: "Safety parameters are running within stable guidelines.",
        prediction: "No immediate threats flagged. Growth velocity is stable.",
        recommendation: "Keep tabs on the inventory safety stock buffers heading into holiday seasons.",
        priority: "Info",
        expected_outcome: "Operational stability",
        confidence_score: 90
      };
      
      if (q.includes("profit")) {
        adviceObj = {
          summary: "TechNova profit margins and cost structures reviewed.",
          situation: `Profits stand at $${summary.totalProfit.toLocaleString()} against revenues of $${summary.totalRevenue.toLocaleString()}.`,
          root_cause: `Wages payroll for ${employeesHired} workers and 1 store branch overhead represent primary expenses.`,
          prediction: "Overhead burdens will rise if price discounts exceed 15% thresholds.",
          recommendation: "Increase the pricing multiplier slider to 1.25x to cover seasonal coupon drops.",
          priority: "High",
          expected_outcome: "Operating profit margins expand by 10-12% next quarter.",
          confidence_score: 93
        };
      } else if (q.includes("inventory") || q.includes("run out")) {
        adviceObj = {
          summary: "Central Warehouse safety stock capacity check completed.",
          situation: `Safety inventory levels close at ${summary.endingInventory} units at year-end across all hubs.`,
          root_cause: `Buffer rate is set to ${inventoryBuffer.toFixed(2)}x. Nov/Dec seasonal spikes trigger heavy demand draws.`,
          prediction: "If buffer stands under 0.8x, storefronts will experience empty-shelf stockout gaps.",
          recommendation: "Scale inventory buffer slider to 1.40x to cover shipping logistics delays.",
          priority: "High",
          expected_outcome: "Restock safety thresholds raised; 98% fulfillment speed.",
          confidence_score: 95
        };
      } else if (q.includes("department") || q.includes("improve")) {
        adviceObj = {
          summary: "Bottleneck checks successfully completed across all 8 hubs.",
          situation: `Customer satisfaction holds at ${summary.avgSatisfaction}%.`,
          root_cause: `Current headcount of ${employeesHired} staff can ship up to ${employeesHired * 120} checkouts/mo.`,
          prediction: "If staff capacity falls below 80% of customer order requests, shipment queues will backlog.",
          recommendation: "Recruit additional couriers or adjust pricing upward to reduce operational pressure.",
          priority: "Medium",
          expected_outcome: "Headcount capabilities aligned with storefront traffic.",
          confidence_score: 91
        };
      } else if (q.includes("revenue")) {
        adviceObj = {
          summary: "TechNova gross sales forecasting compiled.",
          situation: `Revenues stand at $${summary.totalRevenue.toLocaleString()}.`,
          root_cause: "Physical branches count and storefront traffic define the gross revenue cap.",
          prediction: "Revenues will remain flat around $185k unless marketing budget increases.",
          recommendation: "Scale monthly marketing slider to $1,800 to stimulate buyer search clicks.",
          priority: "Medium",
          expected_outcome: "Total sales gross expansion +35% within 180 days.",
          confidence_score: 89
        };
      }
      
      const assistantMsg: ChatMessage = {
        id: `msg-asst-${Date.now()}`,
        role: 'assistant',
        advice: adviceObj,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BusinessContext.Provider value={{
      priceMultiplier,
      marketingBudget,
      employeesHired,
      branchesOpen,
      inventoryBuffer,
      
      setPriceMultiplier,
      setMarketingBudget,
      setEmployeesHired,
      setBranchesOpen,
      setInventoryBuffer,
      
      monthlyData,
      summary,
      alerts,
      advice,
      
      isLoading,
      backendOnline,
      triggerRefresh,
      
      messages,
      askAICEO,
      aiInsight,
      clearHistory,

      isDemoMode,
      setIsDemoMode,
      presentationMode,
      setPresentationMode,
      showTour,
      setShowTour,
      resetDemoData,
      currency,
      setCurrency,
      currencySymbol,
      language,
      setLanguage
    }}>
      {children}
    </BusinessContext.Provider>
  );
};
